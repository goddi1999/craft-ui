import { useState } from 'react'

import {
  DemoAction,
  DemoControlGroup,
  DemoSettings,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'

import { Countdown, type CountdownProps, type CountdownUnit } from './Countdown'

type Variant = NonNullable<CountdownProps['variant']>

const VARIANTS: Variant[] = ['large', 'compact']

const UNIT_SETS = ['all', 'hours', 'minutes'] as const
type UnitSet = (typeof UNIT_SETS)[number]

const UNITS: Record<UnitSet, CountdownUnit[]> = {
  all: ['days', 'hours', 'minutes', 'seconds'],
  hours: ['hours', 'minutes', 'seconds'],
  minutes: ['minutes', 'seconds'],
}

const UNIT_SET_LABELS: Record<UnitSet, string> = {
  all: 'd · h · m · s',
  hours: 'h · m · s',
  minutes: 'm · s',
}

/** Demo-only: how far away the target sits, measured from the last restart. */
const TIME_LEFT = ['10s', '5m', '5h', '3d'] as const
type TimeLeft = (typeof TIME_LEFT)[number]

const TIME_LEFT_MS: Record<TimeLeft, number> = {
  '10s': 10 * 1000,
  '5m': 5 * 60 * 1000,
  '5h': 5 * 60 * 60 * 1000,
  '3d': (3 * 24 + 4) * 60 * 60 * 1000,
}

const DEFAULTS = {
  timeLeft: '3d' as TimeLeft,
  variant: 'large' as Variant,
  unitSet: 'all' as UnitSet,
  completeLabel: 'Live now',
}

/** The component's own defaults, so the snippet only prints real changes. */
const COMPONENT_DEFAULTS = {
  variant: 'large',
  completeLabel: 'Live now',
  label: 'Time remaining',
}

const UNITS_PLACEHOLDER = '__units__'

const PROPS: DemoPropDoc[] = [
  {
    name: 'target',
    type: 'Date | number | string',
    description:
      'The moment to count down to — epoch ms, a Date, or an ISO string. A string without an offset is wall time in `timeZone`.',
  },
  {
    name: 'timeZone',
    type: 'string',
    description: 'IANA zone for a target string without an offset, e.g. "America/Los_Angeles".',
  },
  {
    name: 'units',
    type: 'CountdownUnit[]',
    default: "['days', 'hours', 'minutes', 'seconds']",
    description: 'Units to show, largest first. The largest absorbs the rest, so hours can pass 24.',
  },
  {
    name: 'variant',
    type: "'large' | 'compact'",
    default: "'large'",
    description: 'Large digits with unit labels, or one compact pill for banners and table cells.',
  },
  {
    name: 'completeLabel',
    type: 'ReactNode',
    default: "'Live now'",
    description: 'Shown once the target passes; the digits morph into it.',
  },
  {
    name: 'onComplete',
    type: '() => void',
    description: 'Fires once when the countdown reaches zero while mounted, even in a hidden tab.',
  },
  {
    name: 'label',
    type: 'string',
    default: "'Time remaining'",
    description: 'Accessible name of the timer, e.g. "Keynote starts in".',
  },
  {
    name: 'clock',
    type: '() => number',
    default: 'Date.now',
    description: 'Clock source in epoch ms — pass a server-synced clock when device time is untrusted.',
  },
  {
    name: 'ref',
    type: 'Ref<HTMLDivElement>',
    description: 'Ref to the root timer element.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Classes for the root timer element.',
  },
]

export function CountdownPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { timeLeft, variant, unitSet, completeLabel } = settings.values
  // The target is relative to the last restart so the demo never starts at zero.
  const [startedAt, setStartedAt] = useState(() => Date.now())
  const target = startedAt + TIME_LEFT_MS[timeLeft]
  const units = UNITS[unitSet]

  const usage = toUsageSnippet({
    component: 'Countdown',
    from: '@/components/shared/countdown',
    props: {
      target: '2026-12-01T09:00:00-08:00',
      label: 'Keynote starts in',
      variant,
      units: unitSet === 'all' ? undefined : UNITS_PLACEHOLDER,
      completeLabel: completeLabel || undefined,
    },
    defaults: COMPONENT_DEFAULTS,
  }).replace(
    `units="${UNITS_PLACEHOLDER}"`,
    `units={[${units.map((unit) => `'${unit}'`).join(', ')}]}`,
  )

  const handleRestart = () => setStartedAt(Date.now())

  const handleTimeLeftChange = (value: TimeLeft) => {
    settings.set('timeLeft', value)
    setStartedAt(Date.now())
  }

  return (
    <DemoPage
      eyebrow="shared / countdown"
      title="Countdown"
      description="Rolling digits that count down to a moment in a given time zone, with a compact inline variant. Pick 10s to watch the digits morph into the finished label."
      align="stretch"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Time left"
            options={TIME_LEFT}
            value={timeLeft}
            onChange={handleTimeLeftChange}
          />
          <DemoControlGroup
            title="Variant"
            options={VARIANTS}
            value={variant}
            onChange={(value) => settings.set('variant', value)}
          />
          <DemoControlGroup
            title="Units"
            options={UNIT_SETS}
            value={unitSet}
            onChange={(value) => settings.set('unitSet', value)}
            format={(value) => UNIT_SET_LABELS[value]}
          />
          <DemoTextField
            label="Complete label"
            value={completeLabel}
            onValueChange={(value) => settings.set('completeLabel', value)}
            maxLength={24}
          />
          <DemoAction onClick={handleRestart}>Restart</DemoAction>
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/shared/countdown/'],
        usage,
        props: PROPS,
      }}
    >
      <div className="flex w-full justify-center">
        <Countdown
          key={startedAt}
          target={target}
          units={units}
          variant={variant}
          label="Keynote starts in"
          completeLabel={completeLabel || undefined}
          className={variant === 'large' ? 'w-full' : undefined}
        />
      </div>
    </DemoPage>
  )
}
