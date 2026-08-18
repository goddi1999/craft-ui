import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'

export type ProgressiveBlurSize = 'sm' | 'default' | 'lg'

/** How hard the blur bites — drives blur radius, brightness and contrast together. */
export type ProgressiveBlurIntensity = 'subtle' | 'default' | 'strong'

/** Which edges of the scroller get a blur band. */
export type ProgressiveBlurEdges = 'top' | 'bottom' | 'both'

export type ProgressiveBlurProps = {
  children?: ReactNode
  size?: ProgressiveBlurSize
  intensity?: ProgressiveBlurIntensity
  edges?: ProgressiveBlurEdges
  /** Stacked backdrop-filter layers. More layers means a smoother ramp. */
  layers?: number
  /** Let the reader drag the frame to any size. */
  resizable?: boolean
  /** Outline the blur bands so their travel is visible. */
  debug?: boolean
  /** Hue for the scrollbar and selection accent. */
  accentHue?: number
  className?: string
  style?: CSSProperties
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>

export type ProgressiveBlurEdgeProps = {
  edge: 'top' | 'bottom'
  layers?: number
  className?: string
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>

export type ProgressiveBlurScrollerProps = {
  children?: ReactNode
  className?: string
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>
