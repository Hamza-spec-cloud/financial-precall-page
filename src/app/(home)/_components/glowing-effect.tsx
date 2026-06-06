"use client";
import { memo, useCallback, useEffect, useRef } from "react";
import { cn } from "../_lib/utils";
import { animate } from "framer-motion";

interface GlowingEffectProps {
  blur?: number;
  inactiveZone?: number;
  proximity?: number;
  spread?: number;
  variant?: "default" | "white";
  glow?: boolean;
  className?: string;
  disabled?: boolean;
  movementDuration?: number;
  borderWidth?: number;
}

const GlowingEffect = memo(
  ({
    blur = 0,
    inactiveZone = 0.7,
    proximity = 0,
    spread = 20,
    variant = "default",
    glow = false,
    className,
    movementDuration = 2,
    borderWidth = 1,
    disabled = true,
  }: GlowingEffectProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const lastPosition = useRef({ x: 0, y: 0 });
    const animationFrameRef = useRef<number>(0);

    const handleMove = useCallback(
      (e?: MouseEvent | { x: number; y: number }) => {
        if (!containerRef.current) return;
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        animationFrameRef.current = requestAnimationFrame(() => {
          const element = containerRef.current;
          if (!element) return;
          const { left, top, width, height } = element.getBoundingClientRect();
          const mouseX = e?.x ?? lastPosition.current.x;
          const mouseY = e?.y ?? lastPosition.current.y;
          if (e) {
            lastPosition.current = { x: mouseX, y: mouseY };
          }
          const center = [left + width * 0.5, top + height * 0.5];
          const distanceFromCenter = Math.hypot(
            mouseX - center[0],
            mouseY - center[1]
          );
          const inactiveRadius = 0.5 * Math.min(width, height) * inactiveZone;
          if (distanceFromCenter < inactiveRadius) {
            element.style.setProperty("--active", "0");
            return;
          }
          const isActive =
            mouseX > left - proximity &&
            mouseX < left + width + proximity &&
            mouseY > top - proximity &&
            mouseY < top + height + proximity;
          element.style.setProperty("--active", isActive ? "1" : "0");
          if (!isActive) return;
          const currentAngle =
            parseFloat(element.style.getPropertyValue("--start")) || 0;
          let targetAngle =
            (180 * Math.atan2(mouseY - center[1], mouseX - center[0])) /
              Math.PI +
            90;
          const angleDiff = ((targetAngle - currentAngle + 180) % 360) - 180;
          const newAngle = currentAngle + angleDiff;
          animate(currentAngle, newAngle, {
            duration: movementDuration,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (value) => {
              element.style.setProperty("--start", String(value));
            },
          });
        });
      },
      [inactiveZone, proximity, movementDuration]
    );

    useEffect(() => {
      if (disabled) return;
      const element = containerRef.current;
      if (!element) return;

      const handlePointerMove = (e: PointerEvent) => handleMove(e);

      // Only listen to the global pointer stream while this instance is on (or near)
      // screen. With several glow borders per page, an offscreen instance reading
      // getBoundingClientRect on every pointer move is pure forced-reflow waste.
      // (The scroll listener was also dropped — the glow only tracks the pointer, so
      // recomputing on scroll added N reflows per scroll tick for no visible change.)
      let attached = false;
      const attach = () => {
        if (attached) return;
        document.body.addEventListener("pointermove", handlePointerMove, {
          passive: true,
        });
        attached = true;
      };
      const detach = () => {
        if (!attached) return;
        document.body.removeEventListener("pointermove", handlePointerMove);
        attached = false;
        element.style.setProperty("--active", "0");
      };

      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) attach();
          else detach();
        },
        { rootMargin: "100px" }
      );
      io.observe(element);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        io.disconnect();
        detach();
      };
    }, [handleMove, disabled]);

    return (
      <>
        <div
          className={cn(
            "pointer-events-none absolute -inset-px hidden border opacity-0 transition-opacity",
            glow && "opacity-100",
            variant === "white" && "border-white",
            disabled && "!block"
          )}
        />
        <div
          ref={containerRef}
          style={
            {
              "--blur": `${blur}px`,
              "--spread": spread,
              "--start": "0",
              "--active": "0",
              "--glowingeffect-border-width": `${borderWidth}px`,
              "--repeating-conic-gradient-times": "5",
              "willChange": "contents",
              "--gradient":
                variant === "white"
                  ? `repeating-conic-gradient(
                      from 236.84deg at 50% 50%,
                      rgba(0,0,0,0),
                      rgba(0,0,0,0) calc(25% / var(--repeating-conic-gradient-times))
                    )`
                  : `repeating-conic-gradient(
                      from 236.84deg at 50% 50%,
                      rgba(255,255,255,0),
                      rgba(210,210,210,0.6) calc(25% / var(--repeating-conic-gradient-times)),
                      rgba(240,240,240,0.8) calc(50% / var(--repeating-conic-gradient-times)),
                      rgba(180,180,180,0.5) calc(75% / var(--repeating-conic-gradient-times)),
                      rgba(255,255,255,0) calc(100% / var(--repeating-conic-gradient-times))
                    )`,
            } as React.CSSProperties
          }
          className={cn(
            "pointer-events-none absolute inset-0 opacity-100 transition-opacity",
            glow && "opacity-100",
            blur > 0 && "blur-[var(--blur)]",
            className,
            disabled && "!hidden"
          )}
        >
          <div
            className={cn(
              "glow",
              'after:content-[""] after:absolute after:inset-[calc(-1*var(--glowingeffect-border-width))]',
              "after:[border:var(--glowingeffect-border-width)_solid_transparent]",
              "after:[background:var(--gradient)] after:[background-attachment:fixed]",
              "after:opacity-[var(--active)] after:transition-opacity after:duration-300",
              "after:[mask-clip:padding-box,border-box]",
              "after:[mask-composite:intersect]",
              "after:[mask-image:linear-gradient(#0000,#0000),conic-gradient(from_calc((var(--start)-var(--spread))*1deg),#00000000_0deg,#fff,#00000000_calc(var(--spread)*2deg))]"
            )}
          />
        </div>
      </>
    );
  }
);
GlowingEffect.displayName = "GlowingEffect";
export { GlowingEffect };
