import { type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

import './carousel-3d.css'

import { carousel3dVariants } from './carousel-3d-variants'
import type { Carousel3DProps } from './carousel-3d.types'

export function Carousel3D({
  children,
  size = 'default',
  speed = 'default',
  depth = 'default',
  paused = false,
  fade = true,
  className,
  style,
  ...props
}: Carousel3DProps & VariantProps<typeof carousel3dVariants>) {
  return (
    <div
      data-slot="carousel-3d"
      data-size={size}
      data-speed={speed}
      data-depth={depth}
      data-paused={paused}
      data-fade={fade}
      className={cn(carousel3dVariants({ size, speed, depth }), className)}
      style={style}
      {...props}
    >
      {children}
    </div>
  )
}
