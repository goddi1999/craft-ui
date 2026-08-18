import { type VariantProps } from 'class-variance-authority'
import { useRef } from 'react'

import { cn } from '@/lib/utils'

import './product-spotlight.css'

import { productSpotlightVariants } from './product-spotlight-variants'
import type { ProductSpotlightProps } from './product-spotlight.types'
import { useDepthSpotlight } from './use-depth-spotlight'

/** A product photo relit in real time from its depth map. */
export function ProductSpotlight({
  src,
  depth,
  preset = 'default',
  alt = '',
  className,
  style,
  ...props
}: ProductSpotlightProps & VariantProps<typeof productSpotlightVariants>) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useDepthSpotlight(canvasRef, { src, depth, preset })

  return (
    <div
      data-slot="product-spotlight"
      data-preset={preset}
      className={cn(productSpotlightVariants({ preset }), className)}
      style={style}
      {...props}
    >
      <canvas
        ref={canvasRef}
        data-slot="product-spotlight-canvas"
        role={alt ? 'img' : 'presentation'}
        aria-label={alt || undefined}
      />
    </div>
  )
}
