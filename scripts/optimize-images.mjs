/**
 * Shrink the photos in public/ and src/assets/ in place.
 *
 * Client photos come straight off a phone or a stock site — 10 MB, 6000px
 * wide — and nothing on the site ever displays them bigger than a full-width
 * hero. Run this after dropping new images in, before handing the site over.
 *
 *   npm run images          # rewrite anything oversized
 *   npm run images -- --dry # report only, touch nothing
 */
import sharp from "sharp";
import { readdir, stat, rename, unlink } from "node:fs/promises";
import { join, extname } from "node:path";

const DIRS = ["public", "src/assets"];
const MAX_WIDTH = 2000; // widest we ever render is a full-bleed hero
const QUALITY = 80; // mozjpeg at 80 is visually clean on photos
const SKIP_UNDER = 120 * 1024; // already small enough to not be worth touching
const MIN_GAIN = 0.1; // reject re-encodes that save less than this — see below

const dry = process.argv.includes("--dry");
const kb = (b) => `${Math.round(b / 1024)} KB`;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

let before = 0;
let after = 0;
let touched = 0;

for (const dir of DIRS) {
  for await (const file of walk(dir)) {
    const ext = extname(file).toLowerCase();
    if (![".jpg", ".jpeg", ".png"].includes(ext)) continue;

    const { size } = await stat(file);
    before += size;

    const meta = await sharp(file).metadata();
    const tooWide = meta.width > MAX_WIDTH;
    if (size < SKIP_UNDER && !tooWide) {
      after += size;
      continue;
    }

    // Write to a temp file first: sharp cannot read and overwrite the same
    // path in one pass, and a crash mid-write would destroy the original.
    const tmp = `${file}.tmp`;
    const pipeline = sharp(file).rotate(); // honour EXIF orientation before we strip it
    if (tooWide) pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });

    await (
      ext === ".png"
        ? pipeline.png({ compressionLevel: 9, palette: true })
        : pipeline.jpeg({ quality: QUALITY, mozjpeg: true })
    ).toFile(tmp);

    const { size: newSize } = await stat(tmp);

    // Only accept a real win. Re-encoding an already-optimised JPEG shaves a
    // fraction of a percent while losing a little quality every time, so a
    // marginal gain must be rejected or repeated runs degrade the photos.
    const worthIt = tooWide || newSize < size * (1 - MIN_GAIN);
    if (!worthIt) {
      await unlink(tmp);
      after += size;
      continue;
    }

    if (dry) {
      await unlink(tmp);
    } else {
      await rename(tmp, file);
    }

    after += newSize;
    touched++;
    const saved = Math.round((1 - newSize / size) * 100);
    console.log(`${saved.toString().padStart(3)}%  ${kb(size)} -> ${kb(newSize)}  ${file}`);
  }
}

console.log(
  `\n${dry ? "[dry run] " : ""}${touched} file(s): ${kb(before)} -> ${kb(after)} ` +
    `(${Math.round((1 - after / before) * 100)}% smaller)`,
);
