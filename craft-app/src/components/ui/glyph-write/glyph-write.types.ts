import type { ComponentProps } from 'react'
import type { motion } from 'motion/react'

/** One hand stroke: a centre-line drawn through the filled glyph. */
export type GlyphStroke = {
  /** Centre-line path, in the glyph's viewBox units, in writing direction. */
  d: string
  /** Mask stroke width; wide enough to cover the glyph's thickest point on this stroke. */
  width: number
  /** Seconds to draw this stroke (before `durationScale`). */
  duration: number
  /** Seconds after the previous stroke *starts* (before `durationScale`). Defaults to the previous stroke's duration. */
  gap?: number
  /** Optional region (path) this stroke may reveal, so a wide mask can't uncover a crossing stroke early. */
  clip?: string
}

/** A filled glyph plus the strokes that write it. */
export type GlyphDefinition = {
  title: string
  viewBox: string
  /** Filled outline of the finished glyph. */
  fill: string
  /** Strokes in stroke order. */
  strokes: GlyphStroke[]
  /** Optional rounded tile behind the glyph (app-icon style). */
  tile?: { width: number; height: number; radius: number }
}

export type GlyphWriteProps = Omit<
  ComponentProps<typeof motion.svg>,
  'onAnimationComplete'
> & {
  glyph: GlyphDefinition
  /** `tile` draws the app-icon tile (foreground) with the glyph knocked out in background colour. */
  variant?: 'plain' | 'tile'
  /** Scales every duration and delay. Below 1 is faster, above 1 slower. */
  durationScale?: number
  /** Called once the last stroke has finished writing. */
  onAnimationComplete?: () => void
}
