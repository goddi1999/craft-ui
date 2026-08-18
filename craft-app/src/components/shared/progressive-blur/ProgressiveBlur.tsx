import { type VariantProps } from 'class-variance-authority'
import { type CSSProperties } from 'react'

import { cn } from '@/lib/utils'

import './progressive-blur.css'

import { ProgressiveBlurEdge } from './ProgressiveBlurEdge'
import { progressiveBlurVariants } from './progressive-blur-variants'
import type { ProgressiveBlurProps } from './progressive-blur.types'

export function ProgressiveBlur({
  children,
  size = 'default',
  intensity = 'default',
  edges = 'both',
  layers = 5,
  resizable = false,
  debug = false,
  accentHue,
  className,
  style,
  ...props
}: ProgressiveBlurProps & VariantProps<typeof progressiveBlurVariants>) {
  const cssVars = {
    ...(accentHue === undefined
      ? null
      : { '--progressive-blur-hue': accentHue }),
    ...style,
  } as CSSProperties

  return (
    <div
      data-slot="progressive-blur"
      data-size={size}
      data-intensity={intensity}
      data-edges={edges}
      data-resizable={resizable}
      data-debug={debug}
      className={cn(progressiveBlurVariants({ size, intensity }), className)}
      style={cssVars}
      {...props}
    >
      {edges === 'top' || edges === 'both' ? (
        <ProgressiveBlurEdge edge="top" layers={layers} />
      ) : null}
      {edges === 'bottom' || edges === 'both' ? (
        <ProgressiveBlurEdge edge="bottom" layers={layers} />
      ) : null}
      {children}
    </div>
  )
}
