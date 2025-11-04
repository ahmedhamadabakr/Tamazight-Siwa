import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ROOT = path.resolve(__dirname, '..')
const PUBLIC_DIR = path.join(ROOT, 'public')

const EXTS = new Set(['.jpg', '.jpeg', '.png'])
const SKIP_EXTS = new Set(['.webp', '.avif', '.svg', '.ico'])
const SKIP_NAME_PREFIXES = ['favicon', 'icon-192', 'icon-512', 'apple-touch-icon']

const MAX_WIDTH = 2560 // downscale very large images to this width

async function pathExists(p) {
  try { await fs.access(p); return true } catch { return false }
}

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) {
      yield* walk(full)
    } else {
      yield full
    }
  }
}

function shouldSkip(file) {
  const ext = path.extname(file).toLowerCase()
  if (SKIP_EXTS.has(ext)) return true
  const base = path.basename(file).toLowerCase()
  if (SKIP_NAME_PREFIXES.some(p => base.startsWith(p))) return true
  return false
}

function formatBytes(bytes) {
  const units = ['B','KB','MB','GB']
  let i = 0
  let n = bytes
  while (n >= 1024 && i < units.length - 1) { n /= 1024; i++ }
  return `${n.toFixed(1)} ${units[i]}`
}

async function optimizeFile(file) {
  if (shouldSkip(file)) return { skipped: true }
  const ext = path.extname(file).toLowerCase()
  if (!EXTS.has(ext)) return { skipped: true }

  const original = await fs.readFile(file)
  const origSize = original.length

  const img = sharp(original)
  const meta = await img.metadata()

  // Resize if extremely large
  const needsResize = meta.width && meta.width > MAX_WIDTH
  let pipeline = img.clone()
  if (needsResize) {
    pipeline = pipeline.resize({ width: MAX_WIDTH })
  }

  let optimizedBuffer
  if (ext === '.png') {
    optimizedBuffer = await pipeline.png({ compressionLevel: 9, effort: 7, palette: true }).toBuffer()
  } else {
    optimizedBuffer = await pipeline.jpeg({ quality: 72, mozjpeg: true, progressive: true }).toBuffer()
  }

  const optimizedSize = optimizedBuffer.length
  let wrote = false
  if (optimizedSize < origSize * 0.95) { // only overwrite if we saved at least 5%
    await fs.writeFile(file, optimizedBuffer)
    wrote = true
  }

  const base = file.slice(0, -ext.length)
  const webpPath = `${base}.webp`
  const avifPath = `${base}.avif`

  // Generate WebP
  if (!(await pathExists(webpPath))) {
    const webpBuf = await (needsResize ? img.clone().resize({ width: MAX_WIDTH }) : img.clone()).webp({ quality: 70 }).toBuffer()
    await fs.writeFile(webpPath, webpBuf)
  }
  // Generate AVIF
  if (!(await pathExists(avifPath))) {
    const avifBuf = await (needsResize ? img.clone().resize({ width: MAX_WIDTH }) : img.clone()).avif({ quality: 45 }).toBuffer()
    await fs.writeFile(avifPath, avifBuf)
  }

  return {
    file,
    original: origSize,
    optimized: wrote ? optimizedSize : origSize,
    resized: !!needsResize,
  }
}

async function main() {
  console.log('Scanning for images in', PUBLIC_DIR)
  const results = []
  for await (const f of walk(PUBLIC_DIR)) {
    const r = await optimizeFile(f)
    if (r && !r.skipped) results.push(r)
  }

  let saved = 0
  for (const r of results) {
    saved += Math.max(0, r.original - r.optimized)
    const delta = r.original - r.optimized
    const pct = r.original ? ((delta / r.original) * 100).toFixed(1) : '0.0'
    console.log(`${path.relative(PUBLIC_DIR, r.file)}${r.resized ? ' [resized]' : ''}: ${formatBytes(r.original)} -> ${formatBytes(r.optimized)} (${pct}%)`)
  }
  console.log(`Total saved: ${formatBytes(saved)} across ${results.length} images`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
