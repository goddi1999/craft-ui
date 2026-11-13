import { DRIFT_X, DRIFT_Y, INK_ALPHA } from './vanish-input.constants'
import type { Grain } from './vanish-input.types'

const between = (min: number, max: number) => min + Math.random() * (max - min)

export type TextSnapshot = {
  /** the text drawn at device resolution, laid out exactly where the input draws it */
  image: HTMLCanvasElement
  width: number
  height: number
  dpr: number
  color: string
  grains: Grain[]
  left: number
  right: number
}

/**
 * Draws the input's text onto a canvas the same size as the input, in the same font
 * and place, then turns every inked pixel into a grain.
 */
export function snapshotText(input: HTMLInputElement, text: string): TextSnapshot | null {
  const style = getComputedStyle(input)
  const width = input.clientWidth
  const height = input.clientHeight
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  if (width === 0 || height === 0) return null

  const image = document.createElement('canvas')
  image.width = Math.ceil(width * dpr)
  image.height = Math.ceil(height * dpr)
  const ctx = image.getContext('2d', { willReadFrequently: true })
  if (!ctx) return null

  ctx.scale(dpr, dpr)
  ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
  if (style.letterSpacing !== 'normal' && 'letterSpacing' in ctx) {
    ctx.letterSpacing = style.letterSpacing
  }
  ctx.fillStyle = style.color
  ctx.textBaseline = 'alphabetic'

  // inputs centre one line of text in their content box
  const metrics = ctx.measureText(text)
  const ascent = metrics.fontBoundingBoxAscent
  const descent = metrics.fontBoundingBoxDescent
  const padTop = parseFloat(style.paddingTop)
  const padBottom = parseFloat(style.paddingBottom)
  const content = height - padTop - padBottom
  const baseline = padTop + (content - (ascent + descent)) / 2 + ascent
  const x = parseFloat(style.paddingLeft) - input.scrollLeft
  ctx.fillText(text, x, baseline)

  const { data } = ctx.getImageData(0, 0, image.width, image.height)
  const grains: Grain[] = []
  // one grain per css pixel keeps the count in the low thousands for a full field
  const step = Math.max(1, Math.round(dpr))
  let left = Infinity
  let right = -Infinity

  for (let py = 0; py < image.height; py += step) {
    for (let px = 0; px < image.width; px += step) {
      const alpha = data[(py * image.width + px) * 4 + 3]
      if (alpha < INK_ALPHA) continue
      const cx = px / dpr
      const cy = py / dpr
      left = Math.min(left, cx)
      right = Math.max(right, cx)
      grains.push({
        home: cx,
        x: cx,
        y: cy,
        vx: between(DRIFT_X[0], DRIFT_X[1]),
        vy: between(-DRIFT_Y, DRIFT_Y),
        alpha: alpha / 255,
        born: 0,
      })
    }
  }

  if (grains.length === 0) return null
  return { image, width, height, dpr, color: style.color, grains, left, right }
}
