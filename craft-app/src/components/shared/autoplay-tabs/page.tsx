import { useState } from 'react'

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
  AutoplayTabsList,
  AutoplayTabsPlayButton,
  AutoplayTabsRoot,
  AutoplayTabsTab,
} from '@/components/ui/autoplay-tabs'

const SIZES = ['default', 'sm'] as const
type Size = (typeof SIZES)[number]

const SIZE_LABELS: Record<Size, string> = { default: 'Default', sm: 'Small' }

const DEFAULTS = { size: 'default' as Size, duration: 3.6, autoPlay: true, loop: true }

const COMPONENT_DEFAULTS = { duration: 5000, loop: true, autoPlay: true, size: 'default' }

const STEPS = ['Quang Ninh', 'An Giang', 'Ninh Binh', 'Hue', 'Da Nang']

const PROPS: DemoPropDoc[] = [
  {
    name: 'count',
    type: 'number',
    description: 'Number of tabs autoplay steps through.',
  },
  {
    name: 'value / defaultValue',
    type: 'number',
    default: '0',
    description: 'Active index, controlled or uncontrolled.',
  },
  {
    name: 'onValueChange',
    type: '(value: number) => void',
    description: 'Fires on click, arrow keys and each autoplay step.',
  },
  {
    name: 'duration',
    type: 'number',
    default: '5000',
    description: 'Time each tab stays active during autoplay, in ms.',
  },
  {
    name: 'loop',
    type: 'boolean',
    default: 'true',
    description: 'Wrap the last tab to the first. Off, autoplay stops on the last tab.',
  },
  {
    name: 'autoPlay',
    type: 'boolean',
    default: 'true',
    description: 'Start playing on mount. Read once; the play button takes over.',
  },
  {
    name: 'size',
    type: "'default' | 'sm'",
    default: "'default'",
    description: 'Size of the tab list and play button.',
  },
]

export function AutoplayTabsPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { size, duration, autoPlay, loop } = settings.values
  const [value, setValue] = useState(0)

  const usage = toUsageSnippet({
    component: 'AutoplayTabsRoot',
    from: '@/components/ui/autoplay-tabs',
    imports: ['AutoplayTabsList', 'AutoplayTabsTab', 'AutoplayTabsPlayButton'],
    props: {
      count: { expression: 'steps.length' },
      value: { expression: 'value' },
      onValueChange: { expression: 'setValue' },
      duration: duration * 1000,
      loop,
      autoPlay,
      size,
    },
    defaults: COMPONENT_DEFAULTS,
    children: `<AutoplayTabsList aria-label="Steps">
  {steps.map((step) => (
    <AutoplayTabsTab key={step}>{step}</AutoplayTabsTab>
  ))}
</AutoplayTabsList>
<AutoplayTabsPlayButton />`,
  })

  return (
    <DemoPage
      eyebrow="ui / autoplay-tabs"
      title="Autoplay Tabs"
      description="The tab dots and play button from the Apple Carousel, on their own. The active dot stretches into a progress bar that doubles as the autoplay timer; wire its value to anything — slides, steps, a story."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Size"
            options={SIZES}
            value={size}
            onChange={(next) => settings.set('size', next)}
            format={(option) => SIZE_LABELS[option]}
          />
          <DemoSlider
            label="Duration"
            value={duration}
            onValueChange={(next) => settings.set('duration', next)}
            min={1}
            max={8}
            step={0.2}
            unit="s"
          />
          <DemoSwitch
            label="Loop"
            checked={loop}
            onCheckedChange={(next) => settings.set('loop', next)}
          />
          <DemoSwitch
            label="Autoplay"
            checked={autoPlay}
            onCheckedChange={(next) => settings.set('autoPlay', next)}
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/autoplay-tabs/'], usage, props: PROPS }}
    >
      <div className="flex flex-col items-center gap-6">
        <p aria-live="polite" className="text-sm text-muted-foreground tabular-nums">
          {value + 1} / {STEPS.length} · {STEPS[value]}
        </p>
        {/* autoPlay is read on mount, so flipping it remounts. */}
        <AutoplayTabsRoot
          key={String(autoPlay)}
          count={STEPS.length}
          value={value}
          onValueChange={setValue}
          duration={duration * 1000}
          loop={loop}
          autoPlay={autoPlay}
          size={size}
        >
          <AutoplayTabsList aria-label="Places">
            {STEPS.map((step) => (
              <AutoplayTabsTab key={step}>{step}</AutoplayTabsTab>
            ))}
          </AutoplayTabsList>
          <AutoplayTabsPlayButton />
        </AutoplayTabsRoot>
      </div>
    </DemoPage>
  )
}
