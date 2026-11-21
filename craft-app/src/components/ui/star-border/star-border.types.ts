import type { ComponentPropsWithoutRef, CSSProperties, ElementType, ReactNode } from 'react'

export type StarBorderTheme = 'dark' | 'light'

export type StarBorderHover = 'lap' | 'brighten' | 'reveal' | 'none'

export type StarBorderDirection = 'clockwise' | 'counterclockwise'

type StarBorderOwnProps = {
  children?: ReactNode
  className?: string
  style?: CSSProperties
  /** Colour of the star head. Defaults to the theme's light. */
  color?: string
  /** Colour the trail fades into. Defaults to `color`. */
  trailColor?: string
  /** Seconds per lap. */
  duration?: number
  thickness?: number
  radius?: number
  /** Trail length as a share of one lap, 0–1. */
  trailLength?: number
  /** Stars spread evenly around the border, 1–6. */
  stars?: number
  glow?: number
  sparkle?: boolean
  direction?: StarBorderDirection
  hover?: StarBorderHover
  clickPulse?: boolean
  theme?: StarBorderTheme
  backgroundColor?: string
  textColor?: string
  borderColor?: string
}

export type StarBorderProps<T extends ElementType = 'button'> = StarBorderOwnProps & {
  as?: T
} & Omit<ComponentPropsWithoutRef<T>, keyof StarBorderOwnProps | 'as'>

export type Palette = { surface: string; text: string; track: string; light: string }

export type Rgb = [number, number, number]

export type Segment = {
  length: number
  x: number
  y: number
  dx: number
  dy: number
  angle: number | null
}

export type Shape = { r: number; segments: Segment[]; total: number }

export type Point = { x: number; y: number; nx: number; ny: number }

export type Pulse = { origin: number; age: number }

export type Mote = {
  x: number
  y: number
  vx: number
  vy: number
  age: number
  life: number
  size: number
  seed: number
}

/** Props after clamping, read by the canvas loop every frame. */
export type StarBorderSettings = {
  light: boolean
  color: string
  trailColor: string
  duration: number
  thickness: number
  radius: number
  trailLength: number
  stars: number
  glow: number
  sparkle: boolean
  direction: number
  hover: StarBorderHover
  clickPulse: boolean
}
