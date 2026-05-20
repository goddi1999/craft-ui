import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

import { FauxPipVideoSentinel } from './FauxPipVideoSentinel'

type FauxPipVideoBackdropProps = {
  className?: string
  children?: ReactNode
}

export function FauxPipVideoBackdrop({
  className,
  children,
}: FauxPipVideoBackdropProps) {
  return (
    <div data-slot="faux-pip-video-backdrop" className={cn(className)}>
      <FauxPipVideoSentinel />
      {children}
    </div>
  )
}
