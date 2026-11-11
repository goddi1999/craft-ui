import type { CSSProperties } from 'react'

export type PlaybookScrollAnimationSubgridTheme = 'system' | 'light' | 'dark'
export type PlaybookScrollAnimationSubgridStagger = 'range' | 'timing'

export type PlaybookScrollAnimationSubgridImage = {
  src: string
  alt: string
}

export type PlaybookScrollAnimationSubgridProps = {
  /** `system` follows the page's `.dark` class. */
  theme?: PlaybookScrollAnimationSubgridTheme
  /** Run the scroll-linked animation; off shows the static end state. */
  enhanced?: boolean
  /** Pin the photo grid while its section scrolls past. */
  stick?: boolean
  /** Scale the centre photo down from full-viewport size. */
  center?: boolean
  /** Fade and scale the surrounding photo layers in. */
  layers?: boolean
  /** Stagger the layers by animation range or by easing curve. */
  stagger?: PlaybookScrollAnimationSubgridStagger
  /** 15 photos: 6 outer, 6 middle, 2 inner, then the centre one. Short lists repeat. */
  images?: PlaybookScrollAnimationSubgridImage[]
  className?: string
  style?: CSSProperties
}

