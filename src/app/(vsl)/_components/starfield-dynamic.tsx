// Client boundary that code-splits the particle starfield out of the initial JS chunk.
// ssr:false is valid here (inside a client module) and is correct: the field is a
// pure canvas effect with no SSR value, and it starts at opacity 0 anyway.
"use client";

import dynamic from "next/dynamic";

export const Starfield = dynamic(
  () => import("./starfield").then((m) => m.Starfield),
  { ssr: false }
);
