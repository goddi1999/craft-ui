import type { CSSProperties } from 'react'

export type LinePathAnimationTheme = 'system' | 'light' | 'dark'

export type LinePathAnimationProps = {
  theme?: LinePathAnimationTheme
  title?: string
  steps?: string[]
  className?: string
  style?: CSSProperties
}
