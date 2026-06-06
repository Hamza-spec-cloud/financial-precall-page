// Long-form script renderer. Maps the structured Block[] in src/content/vsl-script.ts
// onto an enlarged typography scale tuned for a calm, hypnotic downward read — body 18/20px,
// section h2 28/36/44px, with four distinct vertical-spacing tiers (br phrase-jump < idea gap <
// headline approach < section rule). Inline tokens carry .text-burgundy italic and #e0e0e0
// strong emphasis from the data layer.

import { SmartImage } from "./smart-image";
import { ScriptVignette } from "./script-vignette";
import { VSL_SCRIPT, type Block, type Inline } from "../_content/vsl-script";

function renderInline(content: Inline[], baseKey: string) {
  return content.map((node, i) => {
    if (typeof node === "string") return <span key={`${baseKey}-${i}`}>{node}</span>;
    if ("b" in node) {
      return (
        <span key={`${baseKey}-${i}`} className="text-burgundy italic">
          {node.b}
        </span>
      );
    }
    return (
      <span key={`${baseKey}-${i}`} className="text-[#e0e0e0] font-semibold">
        {node.s}
      </span>
    );
  });
}

function renderBlock(block: Block, i: number) {
  const key = `b-${i}`;

  switch (block.type) {
    case "h2":
      return (
        <h2
          key={key}
          className="text-[28px] md:text-[36px] lg:text-[44px] font-semibold tracking-[-0.025em] text-[#e0e0e0] leading-[1.12] mt-[72px] md:mt-[88px] mb-[24px] md:mb-[28px]"
        >
          {renderInline(block.content, key)}
        </h2>
      );

    case "h3":
      return (
        <h3
          key={key}
          className="text-[21px] md:text-[26px] font-medium tracking-[-0.02em] text-[#e0e0e0] leading-[1.25] mt-[52px] md:mt-[60px] mb-[16px] md:mb-[20px]"
        >
          {renderInline(block.content, key)}
        </h3>
      );

    case "p":
      return (
        <p
          key={key}
          className="text-[18px] md:text-[20px] text-[#aaaaaa] leading-[1.7] mb-[32px] md:mb-[40px]"
        >
          {renderInline(block.content, key)}
        </p>
      );

    case "ul":
      return (
        <ul key={key} className="space-y-[16px] mb-[32px] md:mb-[40px] list-none pl-0">
          {block.items.map((item, j) => (
            <li
              key={`${key}-${j}`}
              className="text-[18px] md:text-[20px] text-[#aaaaaa] leading-[1.7] flex gap-[14px]"
            >
              <span className="text-[#555555] shrink-0 select-none" aria-hidden="true">
                &ndash;
              </span>
              <span>{renderInline(item, `${key}-${j}`)}</span>
            </li>
          ))}
        </ul>
      );

    case "ol":
      return (
        <ol key={key} className="space-y-[16px] mb-[32px] md:mb-[40px] list-none pl-0 counter-reset-list">
          {block.items.map((item, j) => (
            <li
              key={`${key}-${j}`}
              className="text-[18px] md:text-[20px] text-[#aaaaaa] leading-[1.7] flex gap-[14px]"
            >
              <span className="text-[#555555] shrink-0 select-none tabular-nums" aria-hidden="true">
                {String(j + 1).padStart(2, "0")}
              </span>
              <span>{renderInline(item, `${key}-${j}`)}</span>
            </li>
          ))}
        </ol>
      );

    case "blockquote":
      return (
        <blockquote
          key={key}
          className="border-l pl-[24px] italic text-[#e0e0e0] my-[40px] text-[20px] md:text-[24px] leading-[1.6]"
          style={{ borderColor: "rgba(184,54,90,0.40)" }}
        >
          {renderInline(block.content, key)}
        </blockquote>
      );

    case "hr":
      return (
        <div
          key={key}
          aria-hidden="true"
          className="my-[72px] md:my-[96px]"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        />
      );

    case "cta":
      return (
        <a
          key={key}
          href="#book"
          className="inline-block text-[#FFBF00] text-[13px] md:text-[14px] font-medium tracking-[0.20em] uppercase border-b border-[#FFBF00]/40 pb-[1px] hover:border-[#FFBF00] mb-[32px] md:mb-[40px]"
          style={{ transition: "border-color 200ms cubic-bezier(0.16,1,0.3,1)" }}
        >
          {block.text}
        </a>
      );

    case "image":
      return (
        <div
          key={key}
          className="my-[48px] md:my-[56px] border border-white/[0.06] overflow-hidden"
        >
          <SmartImage
            src={block.src}
            alt={block.alt}
            width={block.width}
            height={block.height}
            sizes="(max-width: 768px) 90vw, 720px"
            className="w-full h-auto"
            style={{ display: "block" }}
          />
        </div>
      );
  }
}

export function VSLScript() {
  return (
    <section className="cv-auto relative w-full px-6 py-[110px] md:py-[140px]">
      <ScriptVignette />

      <div
        className="relative max-w-3xl mx-auto w-full"
        style={{ zIndex: 1 }}
      >
        {VSL_SCRIPT.map(renderBlock)}
      </div>
    </section>
  );
}
