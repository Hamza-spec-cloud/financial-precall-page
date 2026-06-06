// Drop-in replacement for next/image that auto-applies a self-blur placeholder.
//
// The blur map (src/lib/blur-data.generated.ts) is produced at build time by
// scripts/generate-blur.mjs. When a matching entry exists for `src`, we set
// placeholder="blur" + blurDataURL so an in-flight image renders a styled blur of
// itself instead of a blank box — killing white pop-in on fast scroll.
//
// Server-component compatible (no client hooks): a plain lookup + next/image.
// Always pass a `sizes` prop so the optimizer downscales to the rendered width.

import Image, { type ImageProps } from "next/image";
import { BLUR_DATA } from "../_lib/blur-data.generated";

export function SmartImage(props: ImageProps) {
  const { src, placeholder, blurDataURL, ...rest } = props;

  // Only string srcs (public/ paths) are in the generated map.
  const blur = typeof src === "string" ? BLUR_DATA[src] : undefined;

  if (blur && !placeholder) {
    return (
      <Image src={src} placeholder="blur" blurDataURL={blurDataURL ?? blur} {...rest} />
    );
  }

  return <Image src={src} placeholder={placeholder} blurDataURL={blurDataURL} {...rest} />;
}
