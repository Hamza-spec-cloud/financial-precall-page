// Page-wide animated starfield — the Framer `FloatingParticlesBackground` module
// (same one Funnel V2 uses). Wrapped in a fixed, pointer-events-none container so
// the field sits behind every section while the rest of the page stays interactive.
//
// Scroll-driven opacity: invisible while the hero owns the viewport, fades in as
// the user scrolls into the script. Thresholds are viewport-relative so the math
// stays correct across desktop sizes without needing refs into the hero section.

"use client";

import { useEffect, useState } from "react";
import FloatingParticlesBackground from "../_lib/floating-particles-background.js";

export function Starfield() {
  const [opacity, setOpacity] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    function update() {
      const vh = window.innerHeight;
      // Hero occupies ~1 viewport; marquee sits in the next ~0.4 vh — keep stars
      // invisible through both and fade in as testimonials arrive.
      const start = vh * 1.0;
      const end = vh * 1.4;
      const t = Math.max(0, Math.min(1, (window.scrollY - start) / (end - start)));
      setOpacity(t);
    }
    function onVisibility() {
      setHidden(document.hidden);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // Respect the OS "reduce motion" preference — drop the particle RAF loop entirely
  // for those users (the mist shader is intentionally left untouched).
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // The field is fully transparent across the hero + marquee — no reason to burn a
  // RAF loop on particle physics no one can see. Pause when invisible or backgrounded,
  // and never run it for reduced-motion users.
  const paused = opacity === 0 || hidden || reduceMotion;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
        opacity: reduceMotion ? 0 : opacity,
        transition: "opacity 200ms linear",
      }}
    >
      {/* Very faint, small dust — quiet depth behind the content rather than a visible
          starfield. Lower opacity + glow is both the look and the per-frame cost win
          (canvas shadowBlur scales with glowIntensity). */}
      <FloatingParticlesBackground
        particleCount={36}
        particleSize={0.2}
        particleOpacity={0.16}
        glowIntensity={2}
        movementSpeed={0.35}
        mouseInfluence={140}
        mouseGravity="attract"
        gravityStrength={35}
        backgroundColor="transparent"
        particleColor="#e0e0e0"
        paused={paused}
      />
    </div>
  );
}
