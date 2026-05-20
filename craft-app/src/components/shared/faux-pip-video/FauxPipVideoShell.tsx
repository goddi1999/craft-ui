import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type FauxPipVideoShellProps = {
  children: ReactNode
  className?: string
}

export function FauxPipVideoShell({ children, className }: FauxPipVideoShellProps) {
  return (
    <div data-slot="faux-pip-video-shell" className={cn(className)}>
      {children}
    </div>
  )
}
