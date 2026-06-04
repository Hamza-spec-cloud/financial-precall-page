// Deterministic burgundy texture for the script section. Replaces the single
// dominant `BurgundyGlow variant="weak"` ambient wash with 7 small spots
// distributed through the vertical span — script reads as a slow heartbeat
// of burgundy warmth rather than a continuous color bath.
//
// Positions are hard-coded (not RNG) so the layout is stable across reloads.
// Parent must be `position: relative` and not clip overflow.

const SPOTS = [
  { top: "6%",  left: "12%", size: 260, opacity: 0.14, blur: 90  },
  { top: "18%", left: "72%", size: 320, opacity: 0.12, blur: 100 },
  { top: "32%", left: "8%",  size: 220, opacity: 0.10, blur: 80  },
  { top: "46%", left: "78%", size: 300, opacity: 0.16, blur: 110 },
  { top: "60%", left: "18%", size: 280, opacity: 0.11, blur: 95  },
  { top: "76%", left: "70%", size: 260, opacity: 0.13, blur: 90  },
  { top: "90%", left: "14%", size: 220, opacity: 0.10, blur: 80  },
];

export function BurgundySprinkle() {
  return (
    <>
      {SPOTS.map((s, i) => (
        <div
          key={i}
          aria-hidden="true"
          style={{
            position: "absolute",
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(ellipse 50% 50% at 50% 50%, rgba(184,54,90,${s.opacity}) 0%, transparent 70%)`,
            filter: `blur(${s.blur}px)`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      ))}
    </>
  );
}
