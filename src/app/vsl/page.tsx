import { HeroNav } from "@/components/hero-nav";
import { Starfield } from "@/components/starfield-dynamic";
import { VSLHero } from "@/components/vsl-hero";
import { VSLMarquee } from "@/components/vsl-marquee";
import { VSLScript } from "@/components/vsl-script";
import { VSLTestimonials } from "@/components/vsl-testimonials";
import { VSLBooking } from "@/components/vsl-booking";
import { SiteFooter } from "@/components/site-footer";
import { SectionArrow } from "@/components/section-arrow";
import { Spacer } from "@/components/spacer";
import { ImagePrefetch, type PrefetchTarget } from "@/components/image-prefetch";

// Heavy below-the-fold imagery, warmed at idle/lowest priority so a fast scroll
// never reveals a loading image. sizes mirror the values on the actual <Image>s so
// the prefetch hits the identical optimizer cache entry.
const CARD_SCREENSHOT = "(max-width: 1024px) 90vw, 45vw";
const DIAMOND_SCREENSHOT = "(max-width: 1024px) 45vw, 50vw";
const CARD_LOGO = "(max-width: 1024px) 60vw, 480px";
const SCRIPT_IMG = "(max-width: 768px) 90vw, 720px";

const PREFETCH: PrefetchTarget[] = [
  { src: "/testimonials/galriv-1.png", width: 1200, height: 760, sizes: CARD_SCREENSHOT },
  { src: "/testimonials/galriv-2.png", width: 1200, height: 700, sizes: CARD_SCREENSHOT },
  { src: "/testimonials/galriv-logo.png", width: 480, height: 272, sizes: CARD_LOGO },
  { src: "/testimonials/cc-1.jpeg", width: 1200, height: 380, sizes: CARD_SCREENSHOT },
  { src: "/testimonials/cc-2.jpeg", width: 1200, height: 1040, sizes: CARD_SCREENSHOT },
  { src: "/testimonials/cc-logo.png", width: 186, height: 82, sizes: CARD_LOGO },
  { src: "/testimonials/diamond-1.png", width: 1200, height: 620, sizes: DIAMOND_SCREENSHOT },
  { src: "/testimonials/diamond-2.jpeg", width: 1200, height: 900, sizes: DIAMOND_SCREENSHOT },
  { src: "/testimonials/diamond-3.jpeg", width: 1200, height: 900, sizes: DIAMOND_SCREENSHOT },
  { src: "/testimonials/diamond-logo.png", width: 328, height: 86, sizes: CARD_LOGO },
  { src: "/script/referral-funnel.png", width: 1149, height: 329, sizes: SCRIPT_IMG },
  { src: "/script/advisory-conversations.png", width: 947, height: 456, sizes: SCRIPT_IMG },
  { src: "/script/compliance-rate.png", width: 969, height: 334, sizes: SCRIPT_IMG },
];

export default function VSLPage() {
  return (
    <>
      <ImagePrefetch targets={PREFETCH} />
      <HeroNav />
      <Starfield />
      <main className="relative" style={{ overflowX: "clip" }}>
        <VSLHero />

        <VSLMarquee />

        <SectionArrow pad="3vh" />
        <VSLTestimonials />

        <SectionArrow pad="3vh" />
        <VSLScript />

        <SectionArrow pad="3vh" />
        <VSLBooking />

        <Spacer h="20vh" />
      </main>
      <SiteFooter />
    </>
  );
}
