import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const WEBP_EXTENSION = ".webp";
const JPEG_EXTENSION = ".jpg";
const JPEG_QUALITY = 50;

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(fullPath);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(WEBP_EXTENSION)) {
      yield fullPath;
    }
  }
}

async function pathExists(candidate) {
  try {
    await fs.stat(candidate);
    return true;
  } catch (error) {
    if (error && error.code === "ENOENT") return false;
    throw error;
  }
}

async function ensureJpeg(forWebpPath) {
  const { dir, name } = path.parse(forWebpPath);
  const jpegPath = path.join(dir, `${name}${JPEG_EXTENSION}`);

  if (await pathExists(jpegPath)) {
    const [webpStat, jpegStat] = await Promise.all([
      fs.stat(forWebpPath),
      fs.stat(jpegPath),
    ]);
    if (jpegStat.mtimeMs >= webpStat.mtimeMs) {
      return false;
    }
  }

  await sharp(forWebpPath)
    .jpeg({ quality: JPEG_QUALITY, progressive: true, chromaSubsampling: "4:4:4" })
    .toFile(jpegPath);

  return true;
}

async function generate() {
  let processed = 0;
  let skipped = 0;

  for await (const webpPath of walk(PUBLIC_DIR)) {
    const changed = await ensureJpeg(webpPath);
    if (changed) {
      processed += 1;
      const relativeSrc = path.relative(PUBLIC_DIR, webpPath);
      const relativeDest = relativeSrc.replace(/\.webp$/i, JPEG_EXTENSION);
      console.log(`Generated JPEG: ${relativeSrc} → ${relativeDest}`);
    } else {
      skipped += 1;
    }
  }

  console.log(`JPEG generation complete. Processed: ${processed}, up-to-date: ${skipped}.`);
}

try {
  await generate();
} catch (error) {
  console.error("Failed to generate JPEG previews:", error);
  process.exitCode = 1;
}
