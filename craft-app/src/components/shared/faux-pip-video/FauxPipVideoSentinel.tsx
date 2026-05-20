import { forwardRef } from 'react'

import { cn } from '@/lib/utils'

type FauxPipVideoSentinelProps = {
  className?: string
}

export const FauxPipVideoSentinel = forwardRef<
  HTMLDivElement,
  FauxPipVideoSentinelProps
>(function FauxPipVideoSentinel({ className }, ref) {
  return (
    <div
      ref={ref}
      data-slot="faux-pip-video-sentinel"
      className={cn(className)}
      aria-hidden="true"
    />
  )
})
