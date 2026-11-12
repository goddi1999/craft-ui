import type { KeyboardEvent } from 'react'

import type { ColorFormat, ContrastGrade, Hsva, Rgba } from './color-picker.types'

export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))

export const round = (value: number, digits = 0) => {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

const byte = (channel: number) => Math.round(clamp(channel) * 255)
const hex2 = (channel: number) => byte(channel).toString(16).padStart(2, '0').toUpperCase()

export function hsvToRgb({ h, s, v, a }: Hsva): Rgba {
  const f = (n: number) => {
    const k = (n + h / 60) % 6
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1))
  }
  return { r: f(5), g: f(3), b: f(1), a }
}

// greys have no hue, so they keep the one passed in and the hue thumb stays put
function rgbToHsv({ r, g, b, a }: Rgba, hue = 0): Hsva {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  let h = hue
  if (d > 1e-6) {
    if (max === r) h = 60 * (((g - b) / d) % 6)
    else if (max === g) h = 60 * ((b - r) / d + 2)
    else h = 60 * ((r - g) / d + 4)
    if (h < 0) h += 360
  }
  return { h, s: max === 0 ? 0 : d / max, v: max, a }
}

function hslToRgb(h: number, s: number, l: number, a: number): Rgba {
  const k = (n: number) => (n + h / 30) % 12
  const c = s * Math.min(l, 1 - l)
  const f = (n: number) => l - c * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1))
  return { r: f(0), g: f(8), b: f(4), a }
}

function rgbToHsl({ r, g, b }: Rgba, hue: number) {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  const d = max - min
  const s = d < 1e-6 ? 0 : d / (1 - Math.abs(2 * l - 1))
  return { h: d < 1e-6 ? hue : rgbToHsv({ r, g, b, a: 1 }).h, s, l }
}

const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
const fromLinear = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055)

function rgbToOklch({ r, g, b }: Rgba, hue: number) {
  const lr = toLinear(r)
  const lg = toLinear(g)
  const lb = toLinear(b)
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb)
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb)
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb)
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  const C = Math.hypot(A, B)
  let H = (Math.atan2(B, A) * 180) / Math.PI
  if (H < 0) H += 360
  return { l: L, c: C, h: C < 0.0005 ? hue : H }
}

function oklchToRgb(L: number, C: number, H: number, a: number): Rgba {
  const A = C * Math.cos((H * Math.PI) / 180)
  const B = C * Math.sin((H * Math.PI) / 180)
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3
  return {
    r: clamp(fromLinear(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s)),
    g: clamp(fromLinear(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s)),
    b: clamp(fromLinear(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s)),
    a,
  }
}

/** Hex, with two alpha digits only when the colour is not opaque. */
export function toHex(hsva: Hsva) {
  const { r, g, b, a } = hsvToRgb(hsva)
  return `#${hex2(r)}${hex2(g)}${hex2(b)}${a < 0.999 ? hex2(a) : ''}`
}

/** An `rgb()` string for CSS; `opaque` leaves the alpha out. */
export function toCss(hsva: Hsva, opaque = false) {
  const { r, g, b } = hsvToRgb(hsva)
  const rgb = `${byte(r)} ${byte(g)} ${byte(b)}`
  return opaque ? `rgb(${rgb})` : `rgb(${rgb} / ${round(hsva.a, 3)})`
}

export function formatColor(hsva: Hsva, kind: ColorFormat) {
  if (kind === 'hex') return toHex(hsva)
  const rgb = hsvToRgb(hsva)
  const alpha = hsva.a < 0.999 ? ` / ${Math.round(hsva.a * 100)}%` : ''
  if (kind === 'rgb') return `rgb(${byte(rgb.r)} ${byte(rgb.g)} ${byte(rgb.b)}${alpha})`
  if (kind === 'hsl') {
    const { h, s, l } = rgbToHsl(rgb, hsva.h)
    return `hsl(${Math.round(h) % 360} ${Math.round(s * 100)}% ${Math.round(l * 100)}%${alpha})`
  }
  const { l, c, h } = rgbToOklch(rgb, hsva.h)
  return `oklch(${round(l * 100, 1)}% ${round(c, 3)} ${round(h, 1) % 360}${alpha})`
}

const readAlpha = (text?: string) => {
  if (text === undefined) return 1
  return text.endsWith('%') ? clamp(parseFloat(text) / 100) : clamp(parseFloat(text))
}

const HEX = /^#?([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/
const RGB = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:\s*[/,]\s*([\d.]+%?))?\s*\)$/
const HSL =
  /^hsla?\(\s*([\d.]+)(?:deg)?[\s,]+([\d.]+)%?[\s,]+([\d.]+)%?(?:\s*[/,]\s*([\d.]+%?))?\s*\)$/
const OKLCH =
  /^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)(?:deg)?(?:\s*\/\s*([\d.]+%?))?\s*\)$/

/**
 * Reads hex, rgb(), hsl() and oklch() in modern or comma syntax; null for anything else.
 * `hue` is kept for greys, which have none.
 */
export function parseColor(input: string, hue = 0): Hsva | null {
  const text = input.trim().toLowerCase()

  let match = HEX.exec(text)
  if (match) {
    let digits = match[1]
    if (digits.length <= 4) digits = [...digits].map((d) => d + d).join('')
    const n = (i: number) => parseInt(digits.slice(i, i + 2), 16) / 255
    return rgbToHsv({ r: n(0), g: n(2), b: n(4), a: digits.length === 8 ? n(6) : 1 }, hue)
  }

  match = RGB.exec(text)
  if (match) {
    const [, r, g, b, a] = match
    return rgbToHsv(
      { r: clamp(+r / 255), g: clamp(+g / 255), b: clamp(+b / 255), a: readAlpha(a) },
      hue,
    )
  }

  match = HSL.exec(text)
  if (match) {
    const h = +match[1] % 360
    const rgb = hslToRgb(h, clamp(+match[2] / 100), clamp(+match[3] / 100), readAlpha(match[4]))
    return { ...rgbToHsv(rgb, h), h }
  }

  match = OKLCH.exec(text)
  if (match) {
    const L = match[2] ? +match[1] / 100 : +match[1]
    return rgbToHsv(oklchToRgb(clamp(L), +match[3], +match[4], readAlpha(match[5])), hue)
  }

  return null
}

/** WCAG contrast of the colour, composited over the background, against that background. */
export function contrastRatio(hsva: Hsva, background: Rgba) {
  const fg = hsvToRgb(hsva)
  const mix = (c: number, bg: number) => c * fg.a + bg * (1 - fg.a)
  const lum = (r: number, g: number, b: number) =>
    0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
  const a = lum(mix(fg.r, background.r), mix(fg.g, background.g), mix(fg.b, background.b))
  const b = lum(background.r, background.g, background.b)
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}

export const gradeFor = (ratio: number): ContrastGrade =>
  ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'AA large' : 'Fails'

/**
 * Arrow keys step by 1, Shift or the Page keys by 10. A 2D pad reads Up and Down on its own
 * axis; a slider treats them like Right and Left. Null for any other key.
 */
export function stepFor(event: KeyboardEvent, axis: 'x' | 'both'): [number, number] | null {
  const size = event.shiftKey || event.key.startsWith('Page') ? 10 : 1
  const steps: Record<string, [number, number]> = {
    ArrowRight: [size, 0],
    ArrowLeft: [-size, 0],
    ArrowUp: axis === 'both' ? [0, size] : [size, 0],
    ArrowDown: axis === 'both' ? [0, -size] : [-size, 0],
    PageUp: [10, 0],
    PageDown: [-10, 0],
  }
  return steps[event.key] ?? null
}

let swatchCount = 0
export const newSwatchId = () => `swatch-${Date.now().toString(36)}-${swatchCount++}`

/** Letters match by character and occurrence, so the second "i" pairs with the next second "i". */
export function toGlyphs(text: string) {
  const seen = new Map<string, number>()
  return Array.from(text).map((char) => {
    const count = seen.get(char) ?? 0
    seen.set(char, count + 1)
    return { char, key: `${char}-${count}` }
  })
}

/** Stagger order for letters that are new; letters that stay get 0. */
export function enterOrder(glyphs: { key: string }[], kept: Set<string>) {
  let entering = 0
  return glyphs.map((glyph) => (kept.has(glyph.key) ? 0 : entering++))
}

type EyeDropperConstructor = new () => { open: () => Promise<{ sRGBHex: string }> }

export const supportsEyeDropper = () => typeof window !== 'undefined' && 'EyeDropper' in window

/** Opens the browser's eyedropper; rejects when the user cancels. */
export function pickScreenColor() {
  const { EyeDropper } = window as unknown as { EyeDropper: EyeDropperConstructor }
  return new EyeDropper().open().then((result) => result.sRGBHex)
}
