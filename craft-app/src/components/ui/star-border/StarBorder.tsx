import { useRef, type CSSProperties, type ElementType } from 'react'

import { cn } from '@/lib/utils'

import { CANVAS, ROOT, THEMES } from './star-border.constants'
import type { StarBorderProps, StarBorderSettings } from './star-border.types'
import { clamp } from './star-border.utils'
import { useStarBorderCanvas } from './use-star-border-canvas'

/**
 * A button (or any element via `as`) with a star of light running around its border.
 * Hover can send it on a quick lap, brighten it, or reveal it from where the pointer
 * came in; a press sends a pulse both ways from the press point.
 */
export function StarBorder<T extends ElementType = 'button'>({
  as,
  children,
  className,
  style,
  color,
  trailColor,
  duration = 4,
  thickness = 1,
  radius = 12,
  trailLength = 0.3,
  stars = 1,
  glow = 0.6,
  sparkle = false,
  direction = 'clockwise',
  hover = 'lap',
  clickPulse = true,
  theme = 'dark',
  backgroundColor,
  textColor,
  borderColor,
  ...rest
}: StarBorderProps<T>) {
  const tag: ElementType = as ?? 'button'
  const rootRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const palette = THEMES[theme]
  const head = color ?? palette.light

  const settings: StarBorderSettings = {
    light: theme === 'light',
    color: head,
    trailColor: trailColor ?? head,
    duration: Math.max(0.3, duration),
    thickness: Math.max(0.5, thickness),
    radius: Math.max(0, radius),
    trailLength: clamp(trailLength, 0, 1),
    stars: clamp(Math.round(stars), 1, 6),
    glow: clamp(glow, 0, 1),
    sparkle,
    direction: direction === 'counterclockwise' ? -1 : 1,
    hover,
    clickPulse,
  }
  useStarBorderCanvas(rootRef, canvasRef, settings)

  const Component = tag
  const isButton = tag === 'button'

  return (
    <Component
      ref={rootRef}
      data-slot="star-border"
      className={cn(ROOT, (isButton || tag === 'a') && 'cursor-pointer', className)}
      style={
        {
          '--star-border-radius': `${settings.radius}px`,
          '--star-border-thickness': `${settings.thickness}px`,
          '--star-border-surface': backgroundColor ?? palette.surface,
          '--star-border-text': textColor ?? palette.text,
          '--star-border-track': borderColor ?? palette.track,
          ...style,
        } as CSSProperties
      }
      {...(isButton ? { type: 'button' } : null)}
      {...rest}
    >
      <canvas ref={canvasRef} className={CANVAS} aria-hidden="true" />
      {children}
    </Component>
  )
}
