import { cn } from '@/lib/utils'

import './demo-controls.css'

import type { DemoPanelProps } from './demo-controls.types'

/** Frame for a demo page's control cluster. */
export function DemoPanel({ children, className }: DemoPanelProps) {
  return (
    <div
      data-slot="demo-panel"
      className={cn(
        'flex w-full max-w-lg flex-col gap-6 rounded-2xl border border-current/10 p-6 backdrop-blur-sm',
        className,
      )}
    >
      {children}
    </div>
  )
}
