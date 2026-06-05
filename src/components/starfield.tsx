// Page-wide animated starfield — the Framer `FloatingParticlesBackground` module
// (same one Funnel V2 uses). Wrapped in a fixed, pointer-events-none container so
// the field sits behind every section while the rest of the page stays interactive.
//
// Scroll-driven opacity: invisible while the hero owns the viewport, fades in as
// the user scrolls into the script. Thresholds are viewport-relative so the math
// stays correct across desktop sizes without needing refs into the hero section.

"use client";

import { useEffect, useState } from "react";
import FloatingParticlesBackground from "@/lib/floating-particles-background.js";

export function Starfield() {
  const [opacity, setOpacity] = useState(0);
  const [hidden, setHidden] = useState(false);

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

  // The field is fully transparent across the hero + marquee — no reason to burn a
  // RAF loop on particle physics no one can see. Pause when invisible or backgrounded.
  const paused = opacity === 0 || hidden;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
        opacity,
        transition: "opacity 200ms linear",
      }}
    >
      <FloatingParticlesBackground
        particleCount={45}
        particleSize={0.25}
        particleOpacity={0.5}
        glowIntensity={4}
        movementSpeed={0.5}
        mouseInfluence={140}
        mouseGravity="attract"
        gravityStrength={50}
        backgroundColor="transparent"
        particleColor="#e0e0e0"
        paused={paused}
      />
    </div>
  );
}
