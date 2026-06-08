"use client";
import { createElement, useEffect } from "react";
import { GlowingEffect } from "./glowing-effect";

const PLAYER_ID = "vid-6a23575fa85d6b55026ec3be";
const PLAYER_SRC =
  "https://scripts.converteai.net/81abe951-051c-413a-ab78-e030a918b967/players/6a23575fa85d6b55026ec3be/v4/player.js";

/**
 * The VTurb player lives in a CLOSED shadow DOM. Its fullscreen button calls
 * requestFullscreen() on a shadow-internal element, which leaves the light-DOM
 * host <vturb-smartplayer> pinned at the embed width (~759px) — so a portrait
 * video stays narrow in fullscreen. We monkey-patch requestFullscreen so any
 * call originating from inside the player's shadow root retargets to the host,
 * which DOES expand to the full viewport. The player tracks its own fullscreen
 * state via a CSS class (not document.fullscreenElement), so this stays in sync.
 */
function patchFullscreenToHost() {
  if (typeof window === "undefined") return;
  const w = window as unknown as { __vturbFsPatched?: boolean };
  if (w.__vturbFsPatched) return;
  w.__vturbFsPatched = true;

  type RFS = (this: Element, ...args: unknown[]) => Promise<void> | void;
  const redirect = (orig: RFS): RFS =>
    function (this: Element, ...args: unknown[]) {
      try {
        const root = this.getRootNode?.() as { host?: HTMLElement } | undefined;
        const host = root?.host;
        if (host?.tagName?.toLowerCase() === "vturb-smartplayer") {
          return orig.apply(host, args);
        }
      } catch {
        /* fall through to default behavior */
      }
      return orig.apply(this, args);
    };

  const proto = Element.prototype as unknown as Record<string, RFS | undefined>;
  for (const key of ["requestFullscreen", "webkitRequestFullscreen"]) {
    const orig = proto[key];
    if (typeof orig === "function") proto[key] = redirect(orig);
  }
}

export function VturbPlayer() {
  useEffect(() => {
    patchFullscreenToHost();
    if (document.querySelector(`script[src="${PLAYER_SRC}"]`)) return;
    const s = document.createElement("script");
    s.src = PLAYER_SRC;
    s.async = true;
    document.head.appendChild(s);
  }, []);

  return (
    <div className="relative w-full overflow-hidden border border-white/[0.08] shadow-[0_40px_120px_0px_rgba(0,0,0,1),0_0_60px_10px_rgba(0,0,0,0.8)]">
      <GlowingEffect
        disabled={false}
        borderWidth={1}
        spread={80}
        proximity={100}
        inactiveZone={0}
        movementDuration={1.5}
      />
      {/* Reserve the 16:9 video footprint from the first paint so the player mounting
          never pushes the hero CTA down (CLS). Mirrors the (home) vsl-player pattern. */}
      <div className="relative aspect-video bg-[#0d0d0d] overflow-hidden">
        {createElement("vturb-smartplayer", {
          id: PLAYER_ID,
          style: {
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            display: "block",
          },
        })}
      </div>
    </div>
  );
}
