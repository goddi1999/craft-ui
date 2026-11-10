import { useId } from 'react'

import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'

import { DemoControlLabel } from './DemoControlLabel'
import type { DemoSliderProps } from './demo-controls.types'

/** A numeric setting: label and live read-out above a slider. */
export function DemoSlider({
  label,
  value,
  onValueChange,
  min,
  max,
  step = 1,
  unit = '',
  className,
}: DemoSliderProps) {
  const labelId = useId()

  return (
    <div data-slot="demo-slider" className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-baseline justify-between gap-4">
        <DemoControlLabel id={labelId}>{label}</DemoControlLabel>
        <output
          aria-live="off"
          className="font-mono text-xs text-muted-foreground tabular-nums"
        >
          {value}
          {unit}
        </output>
      </div>
      <Slider
        aria-labelledby={labelId}
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([next]) => onValueChange(next)}
      />
    </div>
  )
}
