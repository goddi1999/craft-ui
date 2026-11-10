import { useId } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { DemoControlLabel } from './DemoControlLabel'
import type {
  DemoControlGroupProps,
  DemoControlValue,
} from './demo-controls.types'

/** A labelled row of mutually exclusive options. */
export function DemoControlGroup<T extends DemoControlValue>({
  title,
  options,
  value,
  onChange,
  format,
  className,
}: DemoControlGroupProps<T>) {
  const labelId = useId()

  return (
    <div
      data-slot="demo-control-group"
      className={cn('flex flex-col gap-2.5', className)}
    >
      <DemoControlLabel id={labelId}>{title}</DemoControlLabel>
      <div className="flex flex-wrap gap-1.5" role="group" aria-labelledby={labelId}>
        {options.map((option) => (
          <Button
            key={option}
            size="sm"
            variant={option === value ? 'default' : 'outline'}
            aria-pressed={option === value}
            className="active:scale-[0.97] transition-[transform,background-color,color] duration-150"
            onClick={() => onChange(option)}
          >
            {format ? format(option) : option}
          </Button>
        ))}
      </div>
    </div>
  )
}
