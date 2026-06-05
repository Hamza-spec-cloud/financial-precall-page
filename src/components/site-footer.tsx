// Design tokens sourced strictly from DESIGN-Funnel.md
// Page bg: #121212 | Primary: #e0e0e0 | Muted: #aaaaaa | Ghost: #555555
// Severance border: rgba(255,255,255,0.06) | Divider: rgba(255,255,255,0.06)
// Container: max-w-6xl | Font: Inter | border-radius: 0px global

import { SmartImage } from "@/components/smart-image";

const FOOTER_LINKS = [
  { label: "Terms & Conditions", href: "#" },
  { label: "Privacy Policy", href: "#" },
];

export function SiteFooter() {
  return (
    <footer
      className="relative z-10 w-full bg-[#121212] px-6 py-14"
      style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="max-w-6xl mx-auto w-full flex flex-col gap-8">

        {/* Tier 1: Logo (left) | Nav links (right) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">

          <a href="/" className="flex items-center gap-3 no-underline">
            <SmartImage
              src="/logo.png"
              alt="Arysn logo"
              width={32}
              height={32}
              sizes="32px"
              className="shrink-0"
              style={{ mixBlendMode: "screen" }}
            />
            <span className="text-sm font-light tracking-[0.25em] text-[#e0e0e0] uppercase">
              Arysn
            </span>
          </a>

          <nav className="flex items-center gap-6">
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs tracking-[0.12em] uppercase text-[#aaaaaa] hover:text-[#e0e0e0] transition-colors duration-150 no-underline"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Tier 2 divider */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />

        {/* Tier 2: Copyright (left) | Disclaimer (right) */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">

          <p className="text-xs tracking-[0.08em] text-[#aaaaaa] flex-shrink-0">
            © {new Date().getFullYear()} Arysn. All rights reserved.
          </p>

          <p className="text-[10px] leading-relaxed text-[#555555] max-w-xl md:text-right">
            Results referenced are not typical. Individual outcomes vary based on
            operator background, infrastructure quality, and execution. Arysn
            engagements are offered to a limited number of operators per
            quarter and are not available to every applicant.
          </p>

        </div>

      </div>
    </footer>
  );
}
