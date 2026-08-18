import type { CSSProperties, HTMLAttributes } from 'react'

export type ScrollToTypeTheme = 'system' | 'light' | 'dark'

export type ScrollToTypeSize = 'sm' | 'default' | 'lg'

/** How much scroll distance the typing is spread across. */
export type ScrollToTypeLength = 'compact' | 'default' | 'long'

export type ScrollToTypeProps = {
  /** The line that gets typed out as the reader scrolls. */
  text: string
  theme?: ScrollToTypeTheme
  size?: ScrollToTypeSize
  length?: ScrollToTypeLength
  /** Hue of the blinking cursor block. */
  cursorHue?: number
  className?: string
  style?: CSSProperties
} & Omit<HTMLAttributes<HTMLElement>, 'children'>
