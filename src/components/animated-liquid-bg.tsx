"use client";
import dynamic from "next/dynamic";

// WebGL requires a real DOM — load client-only, never on the server
const Inner = dynamic(() => import("@/lib/animated-liquid-background"), { ssr: false });

export function AnimatedLiquidBg(props: Record<string, unknown>) {
  return <Inner {...props} />;
}
