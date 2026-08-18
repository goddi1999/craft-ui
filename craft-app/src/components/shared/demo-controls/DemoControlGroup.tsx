import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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
  return (
    <div data-slot="demo-control-group" className={cn(className)}>
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] opacity-60">
        {title}
      </p>
      <div className="flex flex-wrap gap-2" role="group" aria-label={title}>
        {options.map((option) => (
          <Button
            key={option}
            size="sm"
            variant={option === value ? 'default' : 'outline'}
            aria-pressed={option === value}
            onClick={() => onChange(option)}
          >
            {format ? format(option) : option}
          </Button>
        ))}
      </div>
    </div>
  )
}
