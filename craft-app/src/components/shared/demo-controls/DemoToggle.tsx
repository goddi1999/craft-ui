import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import type { DemoToggleProps, DemoToggleRowProps } from './demo-controls.types'

/** An on/off control rendered as a pressed-state button. */
export function DemoToggle({
  label,
  pressed,
  onPressedChange,
  className,
}: DemoToggleProps) {
  return (
    <Button
      data-slot="demo-toggle"
      size="sm"
      variant={pressed ? 'default' : 'outline'}
      aria-pressed={pressed}
      className={cn(className)}
      onClick={() => onPressedChange(!pressed)}
    >
      {label}
    </Button>
  )
}

/** Groups toggles onto one line. */
export function DemoToggleRow({ children, className }: DemoToggleRowProps) {
  return (
    <div
      data-slot="demo-toggle-row"
      className={cn('flex flex-wrap gap-2', className)}
    >
      {children}
    </div>
  )
}
