import { useId } from 'react'

import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

import { DemoControlLabel } from './DemoControlLabel'
import type { DemoSwitchProps } from './demo-controls.types'

/** An on/off setting: label on the left, switch on the right. */
export function DemoSwitch({
  label,
  checked,
  onCheckedChange,
  className,
}: DemoSwitchProps) {
  const id = useId()

  return (
    <div
      data-slot="demo-switch"
      className={cn('flex min-h-8 items-center justify-between gap-4', className)}
    >
      <DemoControlLabel htmlFor={id}>{label}</DemoControlLabel>
      <Switch
        id={id}
        size="lg"
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
    </div>
  )
}
