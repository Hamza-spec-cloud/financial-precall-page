// Macro-band whitespace per §4 — default 20vh between sections.
// Transparent so cross-section burgundy glow bleed shows through (body bg #121212 is the floor).

export function Spacer({ h = "20vh" }: { h?: string }) {
  return <div className="w-full" style={{ height: h }} />;
}
