import { type CSSProperties } from 'react'

import { cn } from '@/lib/utils'

import type { Carousel3DCardProps } from './carousel-3d.types'

export function Carousel3DCard({
  index,
  src,
  alt = '',
  className,
  style,
  ...props
}: Carousel3DCardProps) {
  return (
    <img
      data-slot="carousel-3d-card"
      src={src}
      alt={alt}
      className={cn(className)}
      style={{ '--carousel-3d-index': index, ...style } as CSSProperties}
      {...props}
    />
  )
}
