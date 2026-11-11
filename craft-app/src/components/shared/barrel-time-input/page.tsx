import {
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import {
  BarrelTimeInput,
  type BarrelTimePeriod,
  type BarrelTimeValue,
} from '@/components/ui/barrel-time-input'

const PERIODS: BarrelTimePeriod[] = ['AM', 'PM']

const DEFAULTS = {
  hours: 7,
  minutes: 30,
  period: 'AM' as BarrelTimePeriod,
  reveal: false,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'value',
    type: "{ hours: number; minutes: number; period: 'AM' | 'PM' }",
    description: 'Controlled time — hours 1–12, minutes 0–59.',
  },
  {
    name: 'defaultValue',
    type: 'BarrelTimeValue',
    default: "{ hours: 7, minutes: 30, period: 'AM' }",
    description: 'Initial time when uncontrolled.',
  },
  {
    name: 'onChange',
    type: '(value: BarrelTimeValue) => void',
    description: 'Called whenever a barrel lands on a new row.',
  },
  {
    name: 'label',
    type: 'string',
    default: "'Time'",
    description: 'Accessible name for the group.',
  },
  {
    name: 'name',
    type: 'string',
    description: 'Submits a hidden HH:MM (24-hour) field under this name.',
  },
  {
    name: 'reveal',
    type: 'boolean',
    default: 'false',
    description: 'Tilt the barrels and outline the hours ring to show how it is built.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Extra classes for the root element.',
  },
]

export function BarrelTimeInputPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { hours, minutes, period, reveal } = settings.values

  const handleChange = (next: BarrelTimeValue) => {
    settings.set('hours', next.hours)
    settings.set('minutes', next.minutes)
    settings.set('period', next.period)
  }

  const usage = toUsageSnippet({
    component: 'BarrelTimeInput',
    from: '@/components/ui/barrel-time-input',
    props: {
      value: '{time}',
      onChange: '{setTime}',
      label: 'Alarm time',
      reveal,
    },
    defaults: { reveal: false },
  }).replace(/"\{(\w+)\}"/g, '{$1}')

  return (
    <DemoPage
      eyebrow="ui / barrel-time-input"
      title="iOS Alarm Barrel Time Input"
      description="Three 3D barrels for hours, minutes and AM/PM — drag with inertia, scroll, tap a row or use the arrow keys. Rolling past 11 ↔ 12 flips the period."
      // Room for the tilted hours ring when Reveal is on.
      previewClassName="min-h-[30rem]"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSlider
            label="Hours"
            value={hours}
            onValueChange={(value) => settings.set('hours', value)}
            min={1}
            max={12}
          />
          <DemoSlider
            label="Minutes"
            value={minutes}
            onValueChange={(value) => settings.set('minutes', value)}
            min={0}
            max={59}
          />
          <DemoControlGroup
            title="Period"
            options={PERIODS}
            value={period}
            onChange={(value) => settings.set('period', value)}
          />
          <DemoSwitch
            label="Reveal barrels"
            checked={reveal}
            onCheckedChange={(value) => settings.set('reveal', value)}
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/ui/barrel-time-input/'],
        usage,
        props: PROPS,
      }}
    >
      <BarrelTimeInput
        value={{ hours, minutes, period }}
        onChange={handleChange}
        reveal={reveal}
        label="Alarm time"
      />
    </DemoPage>
  )
}
