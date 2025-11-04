/* Generate favicons and apple-touch icon from public/logo.png using sharp */
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

async function main() {
  const src = path.join(__dirname, '..', 'public', 'logo.png');
  const out16 = path.join(__dirname, '..', 'public', 'favicon-16.png');
  const out32 = path.join(__dirname, '..', 'public', 'favicon-32.png');
  const outApple = path.join(__dirname, '..', 'public', 'apple-touch-icon.png');

  if (!fs.existsSync(src)) {
    console.error('Source image not found:', src);
    process.exit(1);
  }

  await sharp(src)
    .resize(16, 16, { fit: 'cover' })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(out16);

  await sharp(src)
    .resize(32, 32, { fit: 'cover' })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(out32);

  await sharp(src)
    .resize(180, 180, { fit: 'cover' })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(outApple);

  console.log('Generated:', out16);
  console.log('Generated:', out32);
  console.log('Generated:', outApple);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
