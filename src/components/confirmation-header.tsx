// Repurposed: new hero. The orientation VSL lives inside this fold; the confirmation
// buttons that used to live here now have their own micro-section (ConfirmCallSection).
// Design system: §17 standard section + §15A weak ambient burgundy oval + §4 max-w-5xl
// container so the inner VSL (max-w-4xl) fits without overflow.

import { VSLPlayer } from "@/components/vsl-player";
import { BurgundyGlow } from "@/components/burgundy-glow";

export function ConfirmationHeader() {
  return (
    <section className="relative w-full px-6 pt-32 pb-24">

      <BurgundyGlow variant="weak" />

      <div
        className="relative max-w-5xl mx-auto w-full flex flex-col items-center text-center gap-8"
        style={{ zIndex: 1 }}
      >

        {/* Eyebrow — institutional directive */}
        <p className="text-[11px] font-light tracking-[0.25em] text-[#555555] uppercase">
          Action Required
        </p>

        {/* H1 split — primary #e0e0e0 + .text-burgundy italic on the warning half.
            Loop 2: stepped down a second time (text-3xl md:text-4xl lg:text-5xl) so more of
            the orientation VSL is visible above the fold on standard desktop viewports.
            Loop 2: em-dash → comma for sharper directive cadence. */}
        <h1
          className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-[1.05] tracking-tight max-w-4xl"
          style={{ textShadow: "0 4px 40px rgba(0,0,0,0.8)" }}
        >
          <span className="text-[#e0e0e0]">Your System Diagnostic Is Scheduled, </span>
          <span className="text-burgundy italic">But Not Yet Confirmed.</span>
        </h1>

        {/* Subtext — max-w-xl reading column per §4 */}
        <p className="text-base md:text-lg text-[#aaaaaa] leading-relaxed max-w-xl">
          Watch the video below — it walks you through every step you must
          complete before your call.
        </p>

        {/* Orientation VSL — §11a GlowingEffect chrome on the player.
            mt-4 nudges the player away from the subhead so the messaging stack and the video
            read as two distinct elements, not a single block. */}
        <div className="w-full max-w-4xl mx-auto mt-4">
          <VSLPlayer videoUrl={undefined} />
        </div>

      </div>
    </section>
  );
}
