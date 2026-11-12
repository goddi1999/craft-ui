export type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'oklch'

export type ColorSwatch = { id: string; color: string }

/** Hue in degrees (0–360); saturation, brightness and alpha from 0 to 1. */
export type Hsva = { h: number; s: number; v: number; a: number }

/** sRGB channels and alpha, each from 0 to 1. */
export type Rgba = { r: number; g: number; b: number; a: number }

export type ContrastGrade = 'AAA' | 'AA' | 'AA large' | 'Fails'

/** Which thumb is under a pointer right now. */
export type ActiveThumb = 'area' | 'hue' | 'alpha' | null

/**
 * A colour field whose swatch grows into a full picker. Pick saturation and brightness on the
 * area, hue and opacity on the sliders, or type hex, RGB, HSL or OKLCH; the format button morphs
 * the text between them. Saved swatches can be added, applied, dragged, moved with Alt and the
 * arrow keys, and removed with Delete. Escape closes the panel.
 */
export type ColorPickerProps = {
  /** Any colour the picker can read: hex, rgb(), hsl() or oklch(). */
  value?: string
  /** The starting colour, when uncontrolled. @default '#2F6BFF' */
  defaultValue?: string
  /** Receives the colour as hex, with two alpha digits when it is not opaque. */
  onValueChange?: (hex: string) => void
  /** The background the colour will sit on, for the contrast readout. @default '#FFFFFF' */
  background?: string
  /** Name shown on the swatch, such as "Accent". @default 'Color' */
  label?: string
  /** Saved swatches, when controlled. */
  swatches?: ColorSwatch[]
  /** The starting swatches, when uncontrolled. @default [] */
  defaultSwatches?: ColorSwatch[]
  onSwatchesChange?: (swatches: ColorSwatch[]) => void
  /** Most saved swatches. Saving past it drops the oldest. @default 7 */
  maxSwatches?: number
  /** Format the text field starts in. @default 'hex' */
  defaultFormat?: ColorFormat
  className?: string
}
