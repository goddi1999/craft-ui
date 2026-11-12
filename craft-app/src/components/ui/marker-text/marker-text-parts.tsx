import { useContext, useId, useLayoutEffect, useRef } from 'react'

import { cn } from '@/lib/utils'

import { DEFAULT_INK, MASK_SPAN, PEN_EASE } from './marker-text.constants'
import { MarkerContext } from './marker-text.context'
import type { MarkProps, Stroke } from './marker-text.types'

/**
 * A phrase to mark inside `MarkerText`. Highlights render as `<mark>` and
 * strikes as `<s>`, so the meaning survives without the drawing.
 */
export function Mark({
  children,
  type = 'highlight',
  color,
  strokeWidth,
  className,
  ...props
}: MarkProps) {
  const registry = useContext(MarkerContext)
  const ref = useRef<HTMLElement>(null)
  const id = useId()

  useLayoutEffect(() => {
    if (!(registry && ref.current)) return
    return registry.add(id, { el: ref.current, type, color, strokeWidth })
  }, [registry, id, type, color, strokeWidth])

  const Tag = type === 'highlight' ? 'mark' : type === 'strike' ? 's' : 'span'

  return (
    <Tag
      ref={ref}
      data-mark={type}
      className={cn(
        'bg-transparent text-inherit no-underline',
        // a circle or box round a wrapped phrase would split in two
        (type === 'circle' || type === 'box') && 'whitespace-nowrap',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

/**
 * One svg layer of ink, behind the text for highlights or over it for pens.
 * Each stroke is a filled shape uncovered by a pen-path mask whose dash offset
 * runs to zero, so it draws in the direction the hand moved.
 */
export function StrokeLayer({
  strokes,
  under,
  armed,
  reduced,
  maskId,
}: {
  strokes: Stroke[]
  under: boolean
  armed: boolean
  reduced: boolean
  maskId: string
}) {
  return (
    <svg
      aria-hidden
      width="1"
      height="1"
      className={cn(
        'pointer-events-none absolute top-0 left-0 overflow-visible',
        under ? '-z-10' : 'z-10',
      )}
    >
      {strokes
        .filter((stroke) => stroke.under === under)
        .map((stroke) => {
          const id = `${maskId}-${stroke.key}`
          return (
            <g key={stroke.key}>
              <mask
                id={id}
                maskUnits="userSpaceOnUse"
                x={-MASK_SPAN / 2}
                y={-MASK_SPAN / 2}
                width={MASK_SPAN}
                height={MASK_SPAN}
              >
                <path
                  d={stroke.pen}
                  fill="none"
                  stroke="white"
                  strokeDasharray={stroke.length + 1}
                  strokeDashoffset={armed ? 0 : stroke.length + 1}
                  strokeLinecap={under ? 'butt' : 'round'}
                  strokeLinejoin="round"
                  strokeWidth={stroke.penWidth}
                  style={{
                    transition:
                      armed && !reduced
                        ? `stroke-dashoffset ${stroke.duration}ms ${PEN_EASE} ${stroke.delay}ms`
                        : 'none',
                  }}
                />
              </mask>
              <path
                d={stroke.shape}
                // a custom colour is a fill attribute; without one the type's ink class applies
                fill={stroke.color}
                className={stroke.color === undefined ? DEFAULT_INK[stroke.type] : undefined}
                fillOpacity={stroke.alpha}
                mask={`url(#${id})`}
              />
            </g>
          )
        })}
    </svg>
  )
}
