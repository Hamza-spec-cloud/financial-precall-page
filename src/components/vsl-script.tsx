// Long-form script renderer. Maps the structured Block[] in src/content/vsl-script.ts
// onto the Arysn typography scale — h2/h3 read at full headline weight per user direction
// ("subheadlines must look like proper headlines"). Inline tokens carry .text-burgundy
// italic and #e0e0e0 strong emphasis from the data layer.

import Image from "next/image";
import { ScriptVignette } from "@/components/script-vignette";
import { VSL_SCRIPT, type Block, type Inline } from "@/content/vsl-script";

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
      <span key={`${baseKey}-${i}`} className="text-[#e0e0e0] font-medium">
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
          className="text-[22px] md:text-[27px] lg:text-[33px] font-semibold tracking-tight text-[#e0e0e0] leading-[1.15] mt-[58px] mb-[22px]"
        >
          {renderInline(block.content, key)}
        </h2>
      );

    case "h3":
      return (
        <h3
          key={key}
          className="text-[18px] md:text-[22px] font-medium tracking-tight text-[#e0e0e0] leading-[1.2] mt-[44px] mb-[15px]"
        >
          {renderInline(block.content, key)}
        </h3>
      );

    case "p":
      return (
        <p
          key={key}
          className="text-[15px] md:text-[16px] text-[#aaaaaa] leading-relaxed mb-[22px]"
        >
          {renderInline(block.content, key)}
        </p>
      );

    case "ul":
      return (
        <ul key={key} className="space-y-[11px] mb-[22px] list-none pl-0">
          {block.items.map((item, j) => (
            <li
              key={`${key}-${j}`}
              className="text-[15px] md:text-[16px] text-[#aaaaaa] leading-relaxed flex gap-[11px]"
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
        <ol key={key} className="space-y-[11px] mb-[22px] list-none pl-0 counter-reset-list">
          {block.items.map((item, j) => (
            <li
              key={`${key}-${j}`}
              className="text-[15px] md:text-[16px] text-[#aaaaaa] leading-relaxed flex gap-[11px]"
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
          className="border-l pl-[22px] italic text-[#e0e0e0] my-[29px] text-[16px] md:text-[18px] leading-relaxed"
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
          className="my-[58px]"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        />
      );

    case "cta":
      return (
        <a
          key={key}
          href="#book"
          className="inline-block text-[#FFBF00] text-[12px] font-medium tracking-[0.20em] uppercase border-b border-[#FFBF00]/40 pb-[1px] hover:border-[#FFBF00] mb-[22px]"
          style={{ transition: "border-color 200ms cubic-bezier(0.16,1,0.3,1)" }}
        >
          {block.text}
        </a>
      );

    case "image":
      return (
        <div
          key={key}
          className="my-[36px] border border-white/[0.06] overflow-hidden"
        >
          <Image
            src={block.src}
            alt={block.alt}
            width={block.width}
            height={block.height}
            className="w-full h-auto"
            style={{ display: "block" }}
          />
        </div>
      );
  }
}

export function VSLScript() {
  return (
    <section className="relative w-full px-6 py-[87px]">
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
