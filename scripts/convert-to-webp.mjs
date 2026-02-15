/**
 * Converts all JPEG/PNG/JPG in public/assets to WebP during build.
 * Run before `vite build` so dist contains .webp files; resolveAsset uses .webp in production.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.resolve(__dirname, '..', 'public', 'assets');
const ext = ['.jpg', '.jpeg', '.png'];

async function convertToWebP() {
  const sharp = (await import('sharp')).default;

  if (!fs.existsSync(assetsDir)) {
    console.log('convert-to-webp: public/assets not found, skipping.');
    return;
  }

  const files = fs.readdirSync(assetsDir);
  const toConvert = files.filter((f) => ext.includes(path.extname(f).toLowerCase()));

  for (const file of toConvert) {
    const src = path.join(assetsDir, file);
    const basename = path.basename(file, path.extname(file));
    const dest = path.join(assetsDir, `${basename}.webp`);

    try {
      await sharp(src)
        .webp({ quality: 80, lossless: false })
        .toFile(dest);
      console.log(`convert-to-webp: ${file} -> ${basename}.webp`);
    } catch (err) {
      console.error(`convert-to-webp: failed ${file}`, err.message);
    }
  }
}

convertToWebP();
