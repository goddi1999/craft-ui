import { RotateCcw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import type { DemoSettingsProps } from './demo-controls.types'

/**
 * The settings panel every demo shares: a "Settings" header with Reset, then
 * the controls in a responsive grid. DemoPage pins it under the preview.
 */
export function DemoSettings({
  children,
  onReset,
  canReset = false,
  className,
}: DemoSettingsProps) {
  return (
    <section
      data-slot="demo-settings"
      aria-label="Settings"
      className={cn('flex flex-col gap-5', className)}
    >
      <header className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-semibold text-foreground">Settings</h2>
        {onReset ? (
          <Button
            variant="ghost"
            size="sm"
            disabled={!canReset}
            onClick={onReset}
            className="-mr-2 text-muted-foreground active:scale-[0.97] transition-[transform,background-color,color] duration-150"
          >
            <RotateCcw aria-hidden="true" />
            Reset
          </Button>
        ) : null}
      </header>
      <div className="grid gap-x-10 gap-y-6 sm:grid-cols-2">{children}</div>
    </section>
  )
}
