import type { CSSProperties, ReactNode } from 'react'

export type FauxPipVideoSize = 'sm' | 'default' | 'lg'

export type FauxPipVideoProps = {
  /** Embed URL (e.g. YouTube embed src). */
  src: string
  title?: string
  children: ReactNode
  /** Slot above the article body, below the sticky video (e.g. page title). */
  header?: ReactNode
  contentWidth?: number
  margin?: number
  gutter?: number
  pipWidth?: number
  duration?: number
  navHeight?: number
  direction?: 'left' | 'right'
  debug?: boolean
  size?: FauxPipVideoSize
  className?: string
  style?: CSSProperties
}

export type FauxPipVideoPlayerProps = {
  src: string
  title: string
  className?: string
  children?: ReactNode
}

export type FauxPipVideoToggleProps = {
  isPipEnabled: boolean
  onToggle: () => void
}
