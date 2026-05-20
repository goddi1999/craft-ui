import type { CSSProperties } from 'react'

export type PlaybookScrollAnimationSubgridTheme = 'system' | 'light' | 'dark'
export type PlaybookScrollAnimationSubgridStagger = 'range' | 'timing'

export type PlaybookScrollAnimationSubgridProps = {
  theme?: PlaybookScrollAnimationSubgridTheme
  enhanced?: boolean
  stick?: boolean
  center?: boolean
  layers?: boolean
  stagger?: PlaybookScrollAnimationSubgridStagger
  className?: string
  style?: CSSProperties
}

