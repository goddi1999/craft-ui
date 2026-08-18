import { type CSSProperties } from 'react'

import { cn } from '@/lib/utils'

import type { ProgressiveBlurEdgeProps } from './progressive-blur.types'

/** One blur band: a stack of backdrop-filter layers with staggered masks. */
export function ProgressiveBlurEdge({
  edge,
  layers = 5,
  className,
  style,
  ...props
}: ProgressiveBlurEdgeProps) {
  const count = Math.max(1, Math.round(layers))

  return (
    <div
      data-slot="progressive-blur-edge"
      data-edge={edge}
      aria-hidden="true"
      className={cn(className)}
      style={
        { '--progressive-blur-layers': count, ...style } as CSSProperties
      }
      {...props}
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          data-slot="progressive-blur-layer"
          style={
            { '--progressive-blur-layer-index': index + 1 } as CSSProperties
          }
        />
      ))}
    </div>
  )
}
