/* Generate optimized brand logo WebP for UI from public/logo.png using sharp */
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

async function main() {
  const src = path.join(__dirname, '..', 'public', 'logo.png');
  const out = path.join(__dirname, '..', 'public', 'brand-logo.webp');

  if (!fs.existsSync(src)) {
    console.error('Source image not found:', src);
    process.exit(1);
  }

  // Generate a crisp yet small WebP suitable for nav/footers (retina-friendly)
  await sharp(src)
    .resize(128, 128, { fit: 'contain', withoutEnlargement: true })
    .webp({ quality: 70 })
    .toFile(out);

  console.log('Generated:', out);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
