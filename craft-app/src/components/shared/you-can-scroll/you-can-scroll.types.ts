import type { CSSProperties } from 'react'

export type YouCanScrollTheme = 'system' | 'light' | 'dark'

export type YouCanScrollProps = {
  words?: string[]
  theme?: YouCanScrollTheme
  animate?: boolean
  snap?: boolean
  syncScrollbar?: boolean
  debug?: boolean
  hueStart?: number
  hueEnd?: number
  title?: string
  endTitle?: string
  className?: string
  style?: CSSProperties
}
