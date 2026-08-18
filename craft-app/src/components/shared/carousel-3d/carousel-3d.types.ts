import type {
  CSSProperties,
  HTMLAttributes,
  ImgHTMLAttributes,
  ReactNode,
} from 'react'

export type Carousel3DSize = 'sm' | 'default' | 'lg'

/** Rotation speed of the ring. */
export type Carousel3DSpeed = 'slow' | 'default' | 'fast'

/** How pronounced the perspective is — smaller perspective reads as more extreme. */
export type Carousel3DDepth = 'subtle' | 'default' | 'extreme'

export type Carousel3DProps = {
  children?: ReactNode
  size?: Carousel3DSize
  speed?: Carousel3DSpeed
  depth?: Carousel3DDepth
  /** Freeze the rotation. */
  paused?: boolean
  /** Fade the left and right edges so cards dissolve instead of clipping. */
  fade?: boolean
  className?: string
  style?: CSSProperties
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>

export type Carousel3DRingProps = {
  children?: ReactNode
  /** Card count driving the ring geometry. Defaults to the number of children. */
  count?: number
  className?: string
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>

export type Carousel3DCardProps = {
  /** Position on the ring, 0-based. */
  index: number
  src: string
  alt?: string
  className?: string
} & Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>
