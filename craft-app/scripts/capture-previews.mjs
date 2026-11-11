/**
 * Screenshots each gallery demo into `public/previews/<slug>.jpg` (640×400).
 *
 *   npm run previews                       # every example
 *   npm run previews -- rolling-counter    # only the named slugs
 *
 * Needs the dev server running (`npm run dev`) and Google Chrome installed.
 * Set PREVIEW_BASE_URL to capture from another host.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

import { chromium } from 'playwright'

const BASE_URL = process.env.PREVIEW_BASE_URL ?? 'http://localhost:5173'
const WIDTH = 640
const HEIGHT = 400
const SETTLE_MS = 1500

const root = new URL('..', import.meta.url)
const registry = await readFile(
  new URL('src/features/gallery/gallery.examples.ts', root),
  'utf8',
)
const allSlugs = [...registry.matchAll(/slug: '([^']+)'/g)].map((m) => m[1])

const requested = process.argv.slice(2)
const unknown = requested.filter((slug) => !allSlugs.includes(slug))
if (unknown.length > 0) {
  console.error(`Unknown slug(s): ${unknown.join(', ')}`)
  process.exit(1)
}
const slugs = requested.length > 0 ? requested : allSlugs

const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({
  viewport: { width: 1280, height: 900 },
  deviceScaleFactor: 2,
  colorScheme: 'light',
})

/**
 * The largest 16:10 box inside the demo stage: centred across, and pinned to
 * the top of stages taller than the card so headers and tabs stay in frame.
 * Null for pages that do not use `DemoPage`.
 */
async function captureClip() {
  const stage = page.locator('[data-slot="demo-preview"]').first()
  if ((await stage.count()) === 0) return null
  const area = await stage.boundingBox()
  if (!area) return null

  const ratio = WIDTH / HEIGHT
  const width = Math.min(area.width, area.height * ratio)
  const height = width / ratio
  return { x: area.x + (area.width - width) / 2, y: area.y, width, height }
}

/** Scales a PNG down to the card size and re-encodes it as JPEG in the browser. */
async function toPreviewJpeg(png) {
  const dataUrl = await page.evaluate(
    async ({ src, width, height }) => {
      const image = new Image()
      image.src = src
      await image.decode()
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const context = canvas.getContext('2d')
      context.imageSmoothingQuality = 'high'
      context.drawImage(image, 0, 0, width, height)
      return canvas.toDataURL('image/jpeg', 0.86)
    },
    { src: `data:image/png;base64,${png.toString('base64')}`, width: WIDTH, height: HEIGHT },
  )
  return Buffer.from(dataUrl.split(',')[1], 'base64')
}

const failed = []
const skipped = []
for (const slug of slugs) {
  try {
    await page.goto(`${BASE_URL}/examples/${slug}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(SETTLE_MS)
    const clip = await captureClip()
    if (!clip) {
      skipped.push(slug)
      console.log(`– ${slug}: no demo stage, kept the existing preview`)
      continue
    }
    const png = await page.screenshot({ clip })
    const out = fileURLToPath(new URL(`public/previews/${slug}.jpg`, root))
    await writeFile(out, await toPreviewJpeg(png))
    console.log(`✓ ${slug}`)
  } catch (error) {
    failed.push(slug)
    console.error(`✗ ${slug}: ${error.message}`)
  }
}

await browser.close()
if (skipped.length > 0) console.log(`Skipped (no DemoPage): ${skipped.join(', ')}`)
if (failed.length > 0) process.exit(1)
