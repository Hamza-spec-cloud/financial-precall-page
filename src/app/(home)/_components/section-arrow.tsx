// Minimalist scroll cue between top-level sections. Lucide ChevronDown, ghost-grey #555555,
// strokeWidth 1.25 per system iconography rules. No animation — "minimalist and clean."
//
// The component owns its own vertical breathing via the `pad` prop so it can drop in as a
// direct replacement for <Spacer> at section boundaries:
//   <SectionArrow pad="10vh" />  → 10vh top + 16px chevron + 10vh bottom
//   <SectionArrow pad="12px" />  → 12px + 16px + 12px = 40px total (≈ 1cm)
//
// aria-hidden — pure visual scroll affordance, no semantic content.

import { ChevronDown } from "lucide-react";

interface SectionArrowProps {
  pad?: string;
}

export function SectionArrow({ pad = "10vh" }: SectionArrowProps) {
  return (
    <div
      className="w-full flex items-center justify-center"
      style={{ paddingTop: pad, paddingBottom: pad }}
      aria-hidden="true"
    >
      <ChevronDown size={16} strokeWidth={1.25} color="#555555" />
    </div>
  );
}
