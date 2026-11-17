import type { ComponentPropsWithRef, CSSProperties } from 'react'

export type BlurLoadImage = {
  src: string
  /** Low-res placeholder shown under a heavy CSS blur while the high-res loads. */
  placeholderSrc: string
  alt: string
}

export type BlurLoadProps = Omit<ComponentPropsWithRef<'div'>, 'children'> & {
  src: string
  placeholderSrc: string
  alt: string
  /**
   * When set, controls the loaded fade instead of listening to the `<img>` load
   * event. Useful for demos that simulate network delay.
   */
  loaded?: boolean
  /** `loading` attribute on the high-res image. @default 'lazy' */
  loading?: 'lazy' | 'eager'
  /** Object-fit for both images. @default 'cover' */
  objectFit?: CSSProperties['objectFit']
  /** Real CSS `filter: blur()` on the placeholder, in px. @default 64 */
  blur?: number
}

export type BlurLoadLayerView = 'exploded' | 'flat'

export type BlurLoadLayerId = 1 | 2 | 3

export type BlurLoadComparisonProps = ComponentPropsWithRef<'div'> & {
  /** Scenes to pick from; all three panels show the selected one. @default BLUR_LOAD_DEMO_IMAGES */
  images?: readonly BlurLoadImage[]
  /** Simulated download duration in ms. @default 2800 */
  durationMs?: number
  /** Placeholder blur in px. @default 64 */
  blur?: number
  /** Starting view of the layer stack. @default 'exploded' */
  defaultView?: BlurLoadLayerView
}
