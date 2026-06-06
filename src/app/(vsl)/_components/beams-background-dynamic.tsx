// Client boundary that code-splits the WebGL mist (shader + ShaderMount) out of the
// initial JS chunk. ssr:false is correct: the canvas renders nothing server-side and
// sits behind the hero veils, so deferring it to hydration causes no visible pop.
"use client";

import dynamic from "next/dynamic";

export const BeamsBackground = dynamic(
  () => import("./beams-background").then((m) => m.BeamsBackground),
  { ssr: false }
);
