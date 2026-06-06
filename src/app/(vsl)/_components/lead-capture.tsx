"use client";

import { useEffect } from "react";

// In-memory guard against React 19 StrictMode double-invoke of the effect.
// localStorage handles cross-load dedupe; this handles the same-mount double fire.
// Reset to false on a failed send so a reload/navigation can retry.
let sent = false;

// Bump this suffix to invalidate previously-stored dedupe keys.
const DEDUPE_VERSION = "v2";

/**
 * Captures the lead identity carried in the campaign URL and forwards it to the
 * n8n webhook (via the /api/lead proxy) so it can be appended to a Google Sheet.
 *
 * Renders nothing. Mount once on the entry page. Fires only on the first click:
 * once per browser per email, and only when an email is present in the URL.
 *
 * Dedupe is gated on a SUCCESSFUL send — a failed attempt never blocks a retry.
 * Append `?leadForce=1` to the URL to bypass dedupe entirely (manual testing).
 *
 * Source of truth: prefer name/email params, fall back to utm_content/utm_term.
 */
export function LeadCapture() {
  useEffect(() => {
    if (sent) return;

    const params = new URLSearchParams(window.location.search);
    const force = params.get("leadForce") === "1";

    // email: explicit `email` param wins, else utm_term.
    const rawEmail = params.get("email") ?? params.get("utm_term") ?? "";
    const email = rawEmail.trim().toLowerCase();
    if (!email) {
      console.info("[lead] no email in URL — skipping capture");
      return;
    }

    // Dedupe on first click (unless forced): if already captured, stop.
    const dedupeKey = `lead_captured_${DEDUPE_VERSION}:${email}`;
    if (!force) {
      try {
        if (localStorage.getItem(dedupeKey)) {
          sent = true;
          console.info("[lead] already captured this email — skipping", email);
          return;
        }
      } catch {
        // localStorage may be unavailable (private mode); proceed without dedupe.
      }
    }

    // full name: `name` param wins, else utm_content. URLSearchParams already
    // decodes the value (e.g. "Kent%20Dougherty" -> "Kent Dougherty").
    const fullName = (params.get("name") ?? params.get("utm_content") ?? "").trim();
    const spaceIdx = fullName.indexOf(" ");
    const firstName = spaceIdx === -1 ? fullName : fullName.slice(0, spaceIdx);
    const lastName = spaceIdx === -1 ? "" : fullName.slice(spaceIdx + 1).trim();

    const payload = {
      firstName,
      lastName,
      email,
      utm_source: params.get("utm_source") ?? "",
      utm_medium: params.get("utm_medium") ?? "",
      utm_campaign: params.get("utm_campaign") ?? "",
      utm_content: params.get("utm_content") ?? "",
      utm_term: params.get("utm_term") ?? "",
      landingUrl: window.location.href,
      timestamp: new Date().toISOString(),
    };

    // Hold the in-memory guard so a StrictMode re-invoke can't double-fire while
    // this request is in flight. Released back to false only on failure.
    sent = true;
    console.info("[lead] sending capture", payload);

    // keepalive lets the request finish even if the user navigates/closes quickly.
    fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    })
      .then(async (res) => {
        if (res.ok) {
          // Only persist dedupe once the lead actually went through.
          try {
            localStorage.setItem(dedupeKey, payload.timestamp);
          } catch {
            // best effort
          }
          console.info("[lead] captured ok", email);
        } else {
          sent = false; // allow retry on next load
          const body = await res.text().catch(() => "");
          console.warn("[lead] /api/lead returned", res.status, body);
        }
      })
      .catch((err) => {
        sent = false; // allow retry on next load
        console.warn("[lead] /api/lead request failed", err);
      });
  }, []);

  return null;
}
