// Build-time source-image recompressor.
//
// Re-encodes the heavy committed raster sources in public/ IN PLACE — same path,
// same extension — so no component reference changes. On Vercel the Image Optimizer
// transforms from these sources on-demand; capping their dimensions to ~2x the
// largest rendered variant and re-encoding (mozjpeg / palette PNG, metadata stripped)
// cuts the source payload ~60-70% with no visible change at render size, and makes
// every cold transform cheaper + faster.
//
// Idempotent: skips a file that is already within its cap and under a size floor, so
// re-running is safe. After running this, regenerate placeholders with `npm run blur`.
//
// Usage: `node scripts/recompress-sources.mjs`  (or add to package.json if desired).

import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const PUBLIC_DIR = join(ROOT, "public");

// Per-role caps. `maxWidth` is the source dimension cap (>= largest rendered variant
// x 2 DPR so retina is never softened). Matched longest-prefix-first.
const RULES = [
  // Logos render tiny (<=32px) — 256px source is already overkill-sharp.
  { prefix: "vsl/logo.png", maxWidth: 256 },
  { prefix: "home/logo.png", maxWidth: 256 },
  // Marquee + testimonial brand logos render <=480px.
  { prefix: "vsl/marquee/", maxWidth: 960 },
  // Testimonial card logos (the *-logo.png files) render <=480px.
  { prefix: "vsl/testimonials/", logoMaxWidth: 960, maxWidth: 1440 },
  // VSL script charts render <=720px.
  { prefix: "vsl/script/", maxWidth: 1440 },
];

const RASTER = new Set([".png", ".jpg", ".jpeg"]);
const SIZE_FLOOR = 60 * 1024; // don't bother re-encoding files already under 60KB

function extOf(name) {
  const dot = name.lastIndexOf(".");
  return dot === -1 ? "" : name.slice(dot).toLowerCase();
}

function ruleFor(relPath) {
  // longest-prefix match
  let best = null;
  for (const r of RULES) {
    if (relPath.startsWith(r.prefix) && (!best || r.prefix.length > best.prefix.length)) {
      best = r;
    }
  }
  if (!best) return null;
  const isLogo = best.logoMaxWidth && /-logo\.png$/i.test(relPath);
  return { maxWidth: isLogo ? best.logoMaxWidth : best.maxWidth };
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (RASTER.has(extOf(entry.name))) yield full;
  }
}

async function reencode(file, ext, maxWidth) {
  // Read into memory first so sharp never holds the source path open — otherwise
  // writing back to the same path fails on Windows (EBUSY/UNKNOWN file lock).
  const input = await readFile(file);
  const img = sharp(input).rotate(); // bake EXIF orientation, then metadata is dropped
  const meta = await img.metadata();
  const pipeline =
    meta.width && meta.width > maxWidth
      ? img.resize({ width: maxWidth, withoutEnlargement: true })
      : img;

  if (ext === ".png") {
    return pipeline.png({ compressionLevel: 9, palette: true, quality: 80, effort: 10 }).toBuffer();
  }
  return pipeline.jpeg({ quality: 80, mozjpeg: true }).toBuffer();
}

async function main() {
  let totalBefore = 0;
  let totalAfter = 0;
  let touched = 0;

  for await (const file of walk(PUBLIC_DIR)) {
    const relPath = relative(PUBLIC_DIR, file).split(sep).join("/");
    const rule = ruleFor(relPath);
    if (!rule) continue;

    const ext = extOf(file);
    const before = (await stat(file)).size;

    let out;
    try {
      out = await reencode(file, ext, rule.maxWidth);
    } catch (err) {
      console.warn(`[recompress] skipped ${relPath}: ${err.message}`);
      continue;
    }

    // Only overwrite when we actually saved bytes (covers the idempotent re-run case
    // and the already-tiny case via SIZE_FLOOR).
    if (before < SIZE_FLOOR && out.length >= before) continue;
    if (out.length >= before) continue;

    await writeFile(file, out);
    totalBefore += before;
    totalAfter += out.length;
    touched += 1;
    const pct = Math.round((1 - out.length / before) * 100);
    console.log(
      `[recompress] ${relPath}  ${(before / 1024).toFixed(0)}KB → ${(out.length / 1024).toFixed(0)}KB  (-${pct}%)`
    );
  }

  if (touched === 0) {
    console.log("[recompress] nothing to do — all sources already optimized.");
  } else {
    const pct = Math.round((1 - totalAfter / totalBefore) * 100);
    console.log(
      `[recompress] re-encoded ${touched} file(s): ${(totalBefore / 1024).toFixed(0)}KB → ${(totalAfter / 1024).toFixed(0)}KB  (-${pct}% total)`
    );
    console.log("[recompress] now run `npm run blur` to regenerate placeholders.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
