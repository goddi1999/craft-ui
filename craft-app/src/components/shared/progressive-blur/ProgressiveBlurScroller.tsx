import { cn } from '@/lib/utils'

import type { ProgressiveBlurScrollerProps } from './progressive-blur.types'

/** The scroll container that drives the blur bands. */
export function ProgressiveBlurScroller({
  children,
  className,
  ...props
}: ProgressiveBlurScrollerProps) {
  return (
    <div
      data-slot="progressive-blur-scroller"
      className={cn(className)}
      {...props}
    >
      {children}
    </div>
  )
}
