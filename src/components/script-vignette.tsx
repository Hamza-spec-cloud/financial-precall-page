// Centered dark column that sits inside the script section between the page-wide
// starfield (z:0, fixed) and the script's reading column (zIndex:1). Near-solid
// graphite over the text width, tapering horizontally at the column edges so the
// starfield resumes in the section margins.
//
// Linear (not radial) so the dark band is uniform top-to-bottom and the falloff
// happens at the LEFT/RIGHT edges of the reading column — matches the user's
// "tapering off near the ends of the width of the text".

export function ScriptVignette() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "50%",
        top: 0,
        transform: "translateX(-50%)",
        width: "min(900px, 95%)",
        height: "100%",
        background:
          "linear-gradient(to right, rgba(18,18,18,0) 0%, rgba(18,18,18,0.98) 12%, rgba(18,18,18,0.98) 88%, rgba(18,18,18,0) 100%)",
        maskImage:
          "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
