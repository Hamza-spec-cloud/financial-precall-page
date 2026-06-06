// Low-priority background warming for below-the-fold images.
//
// next/image dropped lazyBoundary/lazyRoot, so to guarantee no pop-in on very fast
// scroll we emit <link rel="prefetch" as="image"> for the heavy below-fold images.
// rel="prefetch" is idle/lowest priority — it never competes with the LCP — but by
// the time the user scrolls down, the AVIF/WebP variant is already in the HTTP cache,
// so the image paints instantly (the blur placeholder only ever shows on a cold visit
// to that scroll position before the prefetch lands).
//
// getImageProps resolves the exact optimizer URL + srcSet the <Image> will request,
// so the prefetch and the eventual render hit the identical cache entry.

import { getImageProps } from "next/image";

export interface PrefetchTarget {
  src: string;
  width: number;
  height: number;
  sizes: string;
  quality?: number;
}

export function ImagePrefetch({ targets }: { targets: PrefetchTarget[] }) {
  return (
    <>
      {targets.map((t) => {
        const { props } = getImageProps({
          src: t.src,
          width: t.width,
          height: t.height,
          sizes: t.sizes,
          quality: t.quality,
          alt: "",
        });
        return (
          <link
            key={t.src}
            rel="prefetch"
            as="image"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            href={props.src}
            imageSrcSet={props.srcSet}
            imageSizes={props.sizes}
          />
        );
      })}
    </>
  );
}
