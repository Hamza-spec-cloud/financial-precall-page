import { HeroNav } from "@/components/hero-nav";
import { Starfield } from "@/components/starfield";
import { VSLHero } from "@/components/vsl-hero";
import { VSLMarquee } from "@/components/vsl-marquee";
import { VSLScript } from "@/components/vsl-script";
import { VSLTestimonials } from "@/components/vsl-testimonials";
import { VSLBooking } from "@/components/vsl-booking";
import { SiteFooter } from "@/components/site-footer";
import { SectionArrow } from "@/components/section-arrow";
import { Spacer } from "@/components/spacer";

export default function VSLPage() {
  return (
    <>
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
