import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Production webhook default; override with N8N_LEAD_WEBHOOK_URL if needed
// (e.g. point back at the /webhook-test/ URL for n8n editor testing).
const DEFAULT_WEBHOOK_URL =
  "https://maryyoung.app.n8n.cloud/webhook/f6f5e438-cfec-4229-ab62-a5d5aa5ffbcc";

/**
 * Server-side proxy: receives the captured lead from the browser and forwards
 * it to the n8n webhook. Keeps the webhook URL out of the page source and
 * sidesteps any CORS constraints on the n8n side.
 */
export async function POST(req: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  if (!email) {
    return NextResponse.json({ ok: false, error: "email required" }, { status: 400 });
  }

  const url = process.env.N8N_LEAD_WEBHOOK_URL ?? DEFAULT_WEBHOOK_URL;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const body = await res.text();

    if (!res.ok) {
      console.error(`[lead] n8n responded ${res.status}:`, body);
      return NextResponse.json(
        { ok: false, error: "upstream error", status: res.status, body },
        { status: 502 },
      );
    }

    console.info("[lead] forwarded ok", email);
    return NextResponse.json({ ok: true, status: res.status, body });
  } catch (err) {
    console.error("[lead] failed to forward to n8n:", err);
    return NextResponse.json(
      { ok: false, error: "forward failed", detail: String(err) },
      { status: 502 },
    );
  }
}
