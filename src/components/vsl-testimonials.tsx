import { SmartImage } from "@/components/smart-image";
import { BurgundyGlow } from "@/components/burgundy-glow";
import { GlowingEffect } from "@/components/glowing-effect";

interface Screenshot {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface CaseStudy {
  eyebrow?: string;
  logoSrc: string;
  logoAlt: string;
  logoHeight: number;
  logoWidth: number;
  amount: string;
  middlePhrase: string;
  duration: string;
  screenshots: Screenshot[];
  screenshotsLayout?: "vertical" | "horizontal" | "two-plus-one";
}

const GALRIV: CaseStudy = {
  eyebrow: "GALRIV WEALTH MANAGEMENT",
  logoSrc: "/testimonials/galriv-logo.png",
  logoAlt: "Galriv Capital",
  logoHeight: 42,
  logoWidth: 480,
  amount: "$262,011.61",
  middlePhrase: "Cash Collected In",
  duration: "120 Days",
  screenshots: [
    { src: "/testimonials/galriv-1.png", alt: "Galriv profit and cash collected dashboard", width: 1200, height: 760 },
    { src: "/testimonials/galriv-2.png", alt: "Galriv all-time products purchased dashboard", width: 1200, height: 700 },
  ],
};

const COMMISSION_CLUB: CaseStudy = {
  logoSrc: "/testimonials/cc-logo.png",
  logoAlt: "Commission Club",
  logoHeight: 82,
  logoWidth: 186,
  amount: "$441,767.62",
  middlePhrase: "in Revenue In",
  duration: "30 Days",
  screenshots: [
    { src: "/testimonials/cc-1.jpeg", alt: "Commission Club ad spend, revenue, ROAS and profit", width: 1200, height: 380 },
    { src: "/testimonials/cc-2.jpeg", alt: "Commission Club booked meetings calendar", width: 1200, height: 1040 },
  ],
};

const DIAMOND: CaseStudy = {
  logoSrc: "/testimonials/diamond-logo.png",
  logoAlt: "Diamond Trading Institution",
  logoHeight: 86,
  logoWidth: 328,
  amount: "$211,474.11",
  middlePhrase: "in Revenue In",
  duration: "90 Days",
  screenshotsLayout: "two-plus-one",
  screenshots: [
    { src: "/testimonials/diamond-1.png", alt: "Diamond Trading transactions table", width: 1200, height: 620 },
    { src: "/testimonials/diamond-2.jpeg", alt: "Diamond Trading November to December calendar", width: 1200, height: 900 },
    { src: "/testimonials/diamond-3.jpeg", alt: "Diamond Trading December calendar", width: 1200, height: 900 },
  ],
};

function TestimonialCard({ data }: { data: CaseStudy }) {
  const isHorizontal = data.screenshotsLayout === "horizontal";

  return (
    <article
      className="relative bg-[#0d0d0d] border border-white/[0.08] p-[22px] md:p-[29px] flex flex-col items-center gap-5"
      style={{
        boxShadow:
          "0 40px 120px 0px rgba(0,0,0,0.8), 0 0 60px 10px rgba(0,0,0,0.5)",
      }}
    >
      <GlowingEffect
        disabled={false}
        borderWidth={1}
        spread={80}
        proximity={100}
        inactiveZone={0}
        movementDuration={1.5}
      />

      {data.eyebrow && (
        <p className="text-[11px] font-light tracking-[0.25em] text-[#555555] uppercase">
          {data.eyebrow}
        </p>
      )}

      <div className="flex items-center justify-center" style={{ height: data.logoHeight }}>
        <SmartImage
          src={data.logoSrc}
          alt={data.logoAlt}
          width={data.logoWidth}
          height={data.logoHeight}
          sizes="(max-width: 1024px) 60vw, 480px"
          style={{
            mixBlendMode: "screen",
            objectFit: "contain",
            height: "100%",
            width: "auto",
          }}
          priority={false}
        />
      </div>

      <div className="w-[43px]" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />

      <h3 className="text-[17px] md:text-[22px] font-semibold tracking-tight text-[#e0e0e0] leading-[1.15] text-center">
        <span className="text-burgundy italic">{data.amount}</span> {data.middlePhrase}{" "}
        <span className="text-burgundy italic">{data.duration}</span>
      </h3>

      {data.screenshotsLayout === "two-plus-one" ? (
        (() => {
          const [first, second, third] = data.screenshots;
          return (
            <div className="w-full flex flex-col gap-[11px]">
              <div className="w-full flex flex-row gap-[11px]">
                <div className="flex-1 min-w-0 border border-white/[0.06] overflow-hidden">
                  <SmartImage
                    src={first.src}
                    alt={first.alt}
                    width={first.width}
                    height={first.height}
                    sizes="(max-width: 1024px) 45vw, 50vw"
                    className="w-full h-auto"
                    style={{ display: "block" }}
                  />
                </div>
                <div className="flex-1 min-w-0 border border-white/[0.06] overflow-hidden">
                  <SmartImage
                    src={second.src}
                    alt={second.alt}
                    width={second.width}
                    height={second.height}
                    sizes="(max-width: 1024px) 45vw, 50vw"
                    className="w-full h-auto"
                    style={{ display: "block" }}
                  />
                </div>
              </div>
              <div
                className="border border-white/[0.06] overflow-hidden mx-auto"
                style={{ width: "calc(50% - 6px)" }}
              >
                <SmartImage
                  src={third.src}
                  alt={third.alt}
                  width={third.width}
                  height={third.height}
                  sizes="(max-width: 1024px) 45vw, 50vw"
                  className="w-full h-auto"
                  style={{ display: "block" }}
                />
              </div>
            </div>
          );
        })()
      ) : isHorizontal ? (
        <div className="w-full flex flex-row gap-[11px]">
          {data.screenshots.map((s) => (
            <div
              key={s.src}
              className="flex-1 min-w-0 overflow-hidden border border-white/[0.06]"
              style={{ height: 144 }}
            >
              <SmartImage
                src={s.src}
                alt={s.alt}
                width={s.width}
                height={s.height}
                sizes="(max-width: 1024px) 45vw, 22vw"
                className="w-full h-full"
                style={{ display: "block", objectFit: "cover" }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full flex flex-col gap-[14px]">
          {data.screenshots.map((s) => (
            <SmartImage
              key={s.src}
              src={s.src}
              alt={s.alt}
              width={s.width}
              height={s.height}
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="w-full h-auto border border-white/[0.06]"
              style={{ display: "block" }}
            />
          ))}
        </div>
      )}
    </article>
  );
}

export function VSLTestimonials() {
  return (
    <section className="relative w-full px-6 py-[104px]">
      <BurgundyGlow variant="whisper" />

      <div
        className="relative max-w-7xl mx-auto w-full flex flex-col items-center gap-[52px]"
        style={{ zIndex: 1 }}
      >
        <div className="max-w-3xl w-full flex flex-col items-center text-center gap-5">
          <p className="text-[11px] font-light tracking-[0.25em] text-[#555555] uppercase">
            Proof
          </p>
          <h2 className="text-[20px] md:text-[24px] lg:text-[30px] font-semibold tracking-tight text-[#e0e0e0] leading-[1.1]">
            Three operators. Three quarters.{" "}
            <span className="text-burgundy italic">One protocol.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          <TestimonialCard data={GALRIV} />
          <TestimonialCard data={COMMISSION_CLUB} />
          <div className="lg:col-span-2">
            <TestimonialCard data={DIAMOND} />
          </div>
        </div>
      </div>
    </section>
  );
}
