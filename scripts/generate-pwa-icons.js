/* Generate PWA icons from public/logo.png using sharp */
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

async function main() {
  const src = path.join(__dirname, '..', 'public', 'logo.png');
  const out192 = path.join(__dirname, '..', 'public', 'icon-192.png');
  const out512 = path.join(__dirname, '..', 'public', 'icon-512.png');

  if (!fs.existsSync(src)) {
    console.error('Source image not found:', src);
    process.exit(1);
  }

  // Create 192x192 and 512x512 icons. PNG ensures maskable compatibility.
  await sharp(src)
    .resize(192, 192, { fit: 'cover' })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(out192);

  await sharp(src)
    .resize(512, 512, { fit: 'cover' })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(out512);

  console.log('Generated:', out192);
  console.log('Generated:', out512);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
