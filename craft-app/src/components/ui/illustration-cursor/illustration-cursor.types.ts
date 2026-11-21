import type { CSSProperties } from 'react'

export type CursorSide = 'left' | 'right'

export type FloatParams = {
  phaseX: number
  phaseY: number
  speedX: number
  speedY: number
  ampX: number
  ampY: number
}

export type IllustrationCursorProps = {
  name: string
  /** Any CSS colour; fills the arrow and the label pill. */
  color: string
  side: CursorSide
  /** Fade in after `CURSOR_DELAY_MS` instead of at mount. */
  delay?: boolean
  /** Drift gently in place. Off under reduced motion regardless. */
  float?: boolean
  style?: CSSProperties
  className?: string
}
