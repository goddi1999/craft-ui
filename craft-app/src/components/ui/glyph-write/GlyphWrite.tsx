import { motion, useReducedMotion } from 'motion/react'
import { useId } from 'react'

import { cn } from '@/lib/utils'

import {
  EASE_OUT,
  EASE_WRITE,
  PEN_DOWN_DELAY,
  TILE_DURATION,
} from './glyph-write.constants'
import type { GlyphWriteProps } from './glyph-write.types'
import { timeStrokes } from './glyph-write.utils'

/**
 * Writes a filled glyph stroke by stroke, in the style of Apple's Hello screen.
 *
 * Same technique as `AppleHelloEffect` (pathLength 0 → 1 with a short fade so the
 * round cap never pops in as a dot), but the strokes draw into a `<mask>` that
 * reveals the filled outline. The finished mark is the exact traced glyph, not a
 * uniform-width line.
 */
export function GlyphWrite({
  glyph,
  variant = 'plain',
  durationScale = 1,
  onAnimationComplete,
  className,
  ...props
}: GlyphWriteProps) {
  const baseId = `glyph-write-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const reduceMotion = useReducedMotion()
  const scale = (seconds: number) => seconds * durationScale
  const tile = variant === 'tile' ? glyph.tile : undefined
  const penDown = tile ? scale(PEN_DOWN_DELAY) : 0

  const timed = timeStrokes(glyph.strokes, penDown, durationScale)
  const lastIndex = timed.length - 1

  return (
    <motion.svg
      data-slot="glyph-write"
      data-variant={variant}
      role="img"
      className={cn('h-32', className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={glyph.viewBox}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      {...props}
    >
      <title>{glyph.title}</title>
      <defs>
        {timed.map((stroke, index) => (
          <g key={index}>
            <mask id={`${baseId}-mask-${index}`} maskUnits="userSpaceOnUse">
              {/* Dash of length 1 with a gap of 2 on a normalised path: sliding
                  the offset 1 → 0 draws the stroke, and no second dash can
                  reach the end of the path (pathLength alone leaves a cap dot there). */}
              <motion.path
                d={stroke.d}
                pathLength={1}
                fill="none"
                stroke="white"
                strokeWidth={stroke.width}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="1 2"
                initial={{ strokeDashoffset: reduceMotion ? 0 : 1, opacity: 0 }}
                animate={{ strokeDashoffset: 0, opacity: 1 }}
                transition={
                  reduceMotion
                    ? { duration: 0.2 }
                    : {
                        strokeDashoffset: {
                          duration: stroke.duration,
                          delay: stroke.delay,
                          ease: EASE_WRITE,
                        },
                        // Hides the round cap so the stroke doesn't start as a dot.
                        opacity: { duration: 0.15, delay: stroke.delay },
                      }
                }
                onAnimationComplete={
                  index === lastIndex ? onAnimationComplete : undefined
                }
              />
            </mask>
            {stroke.clip && (
              <clipPath id={`${baseId}-clip-${index}`}>
                <path d={stroke.clip} />
              </clipPath>
            )}
          </g>
        ))}
      </defs>

      {tile && (
        <motion.rect
          width={tile.width}
          height={tile.height}
          rx={tile.radius}
          className="fill-foreground"
          style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: scale(TILE_DURATION), ease: EASE_OUT }}
        />
      )}

      {/* One copy of the glyph per stroke, so each stroke reveals only its own ink. */}
      <g className={tile ? 'fill-background' : 'fill-current'}>
        {timed.map((stroke, index) => (
          <path
            key={index}
            d={glyph.fill}
            mask={`url(#${baseId}-mask-${index})`}
            clipPath={stroke.clip ? `url(#${baseId}-clip-${index})` : undefined}
          />
        ))}
      </g>
    </motion.svg>
  )
}
