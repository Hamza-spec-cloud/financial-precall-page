// Extracted §16 IconBox primitive. Lifted from Funnel V2's apply-section.tsx so it can be
// reused by ConfirmationHeader (sm) and PreCallStepsSection (md).
// Tokens: rgba(184,54,90,0.55) radial fill, backdrop-blur(8px), border-white/10,
// dual-layer inset+outer corona shadow, signature easing 0.16/1/0.3/1 over 350ms.

"use client";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";

const SHADOW_DEFAULT =
  "inset 0 0 14px 4px rgba(184,54,90,0.70), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 10px 2px rgba(184,54,90,0.18)";
const SHADOW_HOVER =
  "inset 0 0 14px 4px rgba(184,54,90,0.70), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 22px 6px rgba(184,54,90,0.45), 0 0 55px 14px rgba(184,54,90,0.18)";

interface StepIconCellProps {
  icon: LucideIcon;
  size?: "sm" | "md";
}

export function StepIconCell({ icon: Icon, size = "md" }: StepIconCellProps) {
  const [hovered, setHovered] = useState(false);

  const dims = size === "sm" ? "w-10 h-10" : "w-14 h-14";
  const iconSize = size === "sm" ? 18 : 22;

  return (
    <div
      className={`${dims} flex items-center justify-center border border-white/10`}
      style={{
        backdropFilter: "blur(8px)",
        background:
          "radial-gradient(circle at center, rgba(184,54,90,0.55) 0%, rgba(255,255,255,0.03) 100%)",
        boxShadow: hovered ? SHADOW_HOVER : SHADOW_DEFAULT,
        transition: "box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Icon size={iconSize} strokeWidth={1.25} color="#e0e0e0" />
    </div>
  );
}
