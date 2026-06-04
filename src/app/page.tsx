import { HeroNav } from "@/components/hero-nav";
import { ConfirmationHeader } from "@/components/confirmation-header";
import { PreCallStepsSection } from "@/components/pre-call-steps-section";
import { ConfirmCallSection } from "@/components/confirm-call-section";
import { PreCallAssetsSection } from "@/components/pre-call-assets-section";
import { ShowUpPreparedSection } from "@/components/show-up-prepared-section";
import { SiteFooter } from "@/components/site-footer";
import { SectionArrow } from "@/components/section-arrow";
import { Spacer } from "@/components/spacer";

// Layout: a single overflow-x-clip wrapper so burgundy glows can bleed vertically between
// sections without producing horizontal scrollbars from the §15A weak variant's 110% width.
// All sections are transparent; the body bg (#121212 in globals.css) is the page floor and
// the BurgundyGlow tapestry visually spans the entire scroll without per-section clipping.
//
// Loop 2: section transitions carry a minimalist SectionArrow chevron — each instance owns
// its own pad so the chevron sits centered within the inter-section breathing.

export default function Page() {
  return (
    <>
      <HeroNav />
      <main className="relative" style={{ overflowX: "clip" }}>

        {/* Hero — eyebrow + H1 + subhead + orientation VSL */}
        <ConfirmationHeader />

        {/* Hero → 3-step grid */}
        <SectionArrow pad="5vh" />
        <PreCallStepsSection />

        {/* 3-step grid → confirm-call: ≈1cm spacing per user directive (Loop 2) */}
        <SectionArrow pad="12px" />
        <ConfirmCallSection />

        {/* Confirm-call → pre-call assets */}
        <SectionArrow pad="10vh" />
        <PreCallAssetsSection />

        {/* Pre-call assets → numbers */}
        <SectionArrow pad="10vh" />
        <ShowUpPreparedSection />

        {/* No arrow before footer — experience ends here */}
        <Spacer h="20vh" />
      </main>
      <SiteFooter />
    </>
  );
}
