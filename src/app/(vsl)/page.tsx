import { HeroNav } from "./_components/hero-nav";
import { Starfield } from "./_components/starfield-dynamic";
import { VSLHero } from "./_components/vsl-hero";
import { VSLMarquee } from "./_components/vsl-marquee";
import { VSLScript } from "./_components/vsl-script";
import { VSLTestimonials } from "./_components/vsl-testimonials";
import { VSLBooking } from "./_components/vsl-booking";
import { SiteFooter } from "./_components/site-footer";
import { SectionArrow } from "./_components/section-arrow";
import { Spacer } from "./_components/spacer";
import { ImagePrefetch, type PrefetchTarget } from "./_components/image-prefetch";
import { LeadCapture } from "./_components/lead-capture";

// Heavy below-the-fold imagery, warmed at idle/lowest priority so a fast scroll
// never reveals a loading image. sizes mirror the values on the actual <Image>s so
// the prefetch hits the identical optimizer cache entry.
const CARD_SCREENSHOT = "(max-width: 1024px) 90vw, 45vw";
const DIAMOND_SCREENSHOT = "(max-width: 1024px) 45vw, 50vw";
const CARD_LOGO = "(max-width: 1024px) 60vw, 480px";
const SCRIPT_IMG = "(max-width: 768px) 90vw, 720px";

const PREFETCH: PrefetchTarget[] = [
  { src: "/vsl/testimonials/galriv-1.png", width: 1200, height: 760, sizes: CARD_SCREENSHOT },
  { src: "/vsl/testimonials/galriv-2.png", width: 1200, height: 700, sizes: CARD_SCREENSHOT },
  { src: "/vsl/testimonials/galriv-logo.png", width: 480, height: 272, sizes: CARD_LOGO },
  { src: "/vsl/testimonials/cc-1.jpeg", width: 1200, height: 380, sizes: CARD_SCREENSHOT },
  { src: "/vsl/testimonials/cc-2.jpeg", width: 1200, height: 1040, sizes: CARD_SCREENSHOT },
  { src: "/vsl/testimonials/cc-logo.png", width: 186, height: 82, sizes: CARD_LOGO },
  { src: "/vsl/testimonials/diamond-1.png", width: 1200, height: 620, sizes: DIAMOND_SCREENSHOT },
  { src: "/vsl/testimonials/diamond-2.jpeg", width: 1200, height: 900, sizes: DIAMOND_SCREENSHOT },
  { src: "/vsl/testimonials/diamond-3.jpeg", width: 1200, height: 900, sizes: DIAMOND_SCREENSHOT },
  { src: "/vsl/testimonials/diamond-logo.png", width: 328, height: 86, sizes: CARD_LOGO },
  { src: "/vsl/script/referral-funnel.png", width: 1149, height: 329, sizes: SCRIPT_IMG },
  { src: "/vsl/script/advisory-conversations.png", width: 947, height: 456, sizes: SCRIPT_IMG },
  { src: "/vsl/script/compliance-rate.png", width: 969, height: 334, sizes: SCRIPT_IMG },
];

export default function VSLPage() {
  return (
    <>
      <LeadCapture />
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
