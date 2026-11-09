import { useMemo, type CSSProperties } from 'react'

import { cn } from '@/lib/utils'

import { createSquares } from './floating-squares-3d.utils'

import './floating-squares-3d.css'

export type FloatingSquares3DProps = {
  /** Number of squares drifting across the plane. @default 20 */
  count?: number
  /** Edge length of each square in px. @default 40 */
  size?: number
  /** How far the plane swings away around its right edge, in degrees. @default 40 */
  rotate?: number
  /** Perspective depth as a fraction of the component width. @default 0.8 */
  perspective?: number
  /** Seed for the random layout — change it to reshuffle. @default 1 */
  seed?: number
  /** Show the dashed outline of the tilted plane. @default false */
  showGuides?: boolean
  /** Extra classes for the root element. */
  className?: string
}

export function FloatingSquares3D({
  count = 20,
  size = 40,
  rotate = 40,
  perspective = 0.8,
  seed = 1,
  showGuides = false,
  className,
}: FloatingSquares3DProps) {
  const squares = useMemo(() => createSquares(count, seed), [count, seed])

  const rootStyle = {
    '--floating-squares-size': `${size}px`,
    '--floating-squares-rotate': `${rotate}deg`,
    '--floating-squares-perspective': `${perspective * 100}cqi`,
  } as CSSProperties

  return (
    <div
      data-slot="floating-squares-3d"
      data-guides={showGuides || undefined}
      aria-hidden="true"
      className={cn(className)}
      style={rootStyle}
    >
      <div data-floating-squares-stage="">
        <div data-floating-squares-plane="">
          {squares.map((square, index) => (
            <span
              key={index}
              style={
                {
                  '--y': square.y,
                  '--d': square.delay,
                  '--a': square.duration,
                  '--hue': square.hue,
                } as CSSProperties
              }
            />
          ))}
        </div>
      </div>
    </div>
  )
}
