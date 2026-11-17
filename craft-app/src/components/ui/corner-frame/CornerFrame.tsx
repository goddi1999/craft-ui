import type { ComponentPropsWithRef, CSSProperties } from 'react'

import { cn } from '@/lib/utils'

import {
  CORNER_FRAME_DEFAULTS,
  CORNER_FRAME_SIZES,
  type CornerFrameSize,
} from './corner-frame.constants'
import { cornerFramePath } from './corner-frame.utils'
import { cornerFrameVariants } from './corner-frame.variants'

const CORNERS = [
  'top-0 left-0',
  'top-0 right-0 rotate-90',
  'right-0 bottom-0 rotate-180',
  'bottom-0 left-0 -rotate-90',
] as const

export type CornerFrameProps = Omit<ComponentPropsWithRef<'span'>, 'children'> & {
  /**
   * Preset for length / width / height.
   * Explicit `length` / `width` / `height` override the preset.
   * @default 'default'
   */
  size?: CornerFrameSize
  /** Arm length along each edge, in px. */
  length?: number
  /** Stroke thickness of the bracket, in px. */
  width?: number
  /** Bend radius of the corner, in px (match the parent’s rounded corner). */
  height?: number
}

/**
 * Four thick rounded L-brackets on a positioned parent — frame corners only,
 * no continuous edges. Size with `length` / `width` / `height`, or a `size` preset.
 */
export function CornerFrame({
  size = 'default',
  length,
  width,
  height,
  className,
  ref,
  ...props
}: CornerFrameProps) {
  const preset = CORNER_FRAME_SIZES[size]
  const metrics = {
    length: length ?? preset.length,
    width: width ?? preset.width,
    height: height ?? preset.height,
  }
  const { path, size: box, stroke } = cornerFramePath(metrics)

  return (
    <span
      ref={ref}
      data-slot="corner-frame"
      data-size={size}
      aria-hidden
      className={cn(cornerFrameVariants({ size }), className)}
      style={
        {
          '--corner-frame-length': `${metrics.length}px`,
          '--corner-frame-width': `${metrics.width}px`,
          '--corner-frame-height': `${metrics.height}px`,
        } as CSSProperties
      }
      {...props}
    >
      {CORNERS.map((position) => (
        <svg
          key={position}
          width={box}
          height={box}
          viewBox={`0 0 ${box} ${box}`}
          fill="none"
          className={`absolute ${position}`}
        >
          <path
            d={path}
            stroke="currentColor"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </span>
  )
}

export { CORNER_FRAME_DEFAULTS }
