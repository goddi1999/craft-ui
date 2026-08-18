import { Children, type CSSProperties } from 'react'

import { cn } from '@/lib/utils'

import type { Carousel3DRingProps } from './carousel-3d.types'

export function Carousel3DRing({
  children,
  count,
  className,
  style,
  ...props
}: Carousel3DRingProps) {
  // The ring geometry needs the total up front — every card divides a full
  // turn by it — so fall back to counting children when it is not given.
  const resolvedCount = count ?? Children.count(children)

  return (
    <div
      data-slot="carousel-3d-ring"
      className={cn(className)}
      style={
        {
          '--carousel-3d-count': Math.max(resolvedCount, 1),
          ...style,
        } as CSSProperties
      }
      {...props}
    >
      {children}
    </div>
  )
}
