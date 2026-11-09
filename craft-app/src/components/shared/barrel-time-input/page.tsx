import { useState } from 'react'

import {
  DemoPanel,
  DemoToggle,
  DemoToggleRow,
} from '@/components/shared/demo-controls'
import { DemoPage } from '@/components/shared/demo-page'
import {
  BarrelTimeInput,
  toTimeString,
  type BarrelTimeValue,
} from '@/components/ui/barrel-time-input'
import { Input } from '@/components/ui/input'

const fromNativeTime = (time: string): BarrelTimeValue | null => {
  const [hour24, minutes] = time.split(':').map(Number)
  if (Number.isNaN(hour24) || Number.isNaN(minutes)) return null
  return {
    hours: hour24 % 12 || 12,
    minutes,
    period: hour24 >= 12 ? 'PM' : 'AM',
  }
}

export function BarrelTimeInputPage() {
  const [time, setTime] = useState<BarrelTimeValue>({
    hours: 7,
    minutes: 30,
    period: 'AM',
  })
  const [reveal, setReveal] = useState(false)

  const handleNativeChange = (next: string) => {
    const parsed = fromNativeTime(next)
    if (parsed) setTime(parsed)
  }

  return (
    <DemoPage
      eyebrow="ui / barrel-time-input"
      title="iOS Alarm Barrel Time Input"
      description="Three 3D barrels for hours, minutes and AM/PM — drag with inertia, scroll, tap a row or use the arrow keys. Rolling past 11 ↔ 12 flips the period."
      align="start"
    >
      <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-10">
        <BarrelTimeInput
          value={time}
          onChange={setTime}
          reveal={reveal}
          label="Alarm time"
        />

        <DemoPanel>
          <label className="flex flex-col gap-1.5 text-xs">
            <span className="font-medium tracking-[0.12em] text-muted-foreground uppercase">
              Native time · two-way bound
            </span>
            <Input
              type="time"
              value={toTimeString(time)}
              onChange={(event) => handleNativeChange(event.target.value)}
            />
          </label>
          <DemoToggleRow>
            <DemoToggle
              label="Reveal barrels"
              pressed={reveal}
              onPressedChange={setReveal}
            />
          </DemoToggleRow>
        </DemoPanel>
      </div>
    </DemoPage>
  )
}
