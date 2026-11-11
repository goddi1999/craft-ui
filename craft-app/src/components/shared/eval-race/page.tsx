import { useEffect, useState } from 'react'

import {
  DemoAction,
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { EvalRace, type EvalRaceLayout } from '@/components/ui/eval-race'

import { RACE, STANDINGS } from './eval-race.data'

const LAYOUTS: EvalRaceLayout[] = ['race', 'standings']
const DEFAULTS = { layout: 'race' as EvalRaceLayout, tickMs: 250 }
const COMPONENT_DEFAULTS = { title: 'Eval race', layout: 'race' }

const PROPS: DemoPropDoc[] = [
  {
    name: 'racers',
    type: 'EvalRacer[]',
    description:
      'One per model: id, label, scored and optional laps (seconds per completed lap) and name. Ranked by cases scored, ties broken by total lap time.',
  },
  { name: 'total', type: 'number', description: 'Cases in the eval set. A racer that reaches it has finished.' },
  { name: 'perLap', type: 'number', description: 'Cases per lap of the track. A racer a full lap behind shows +1 lap.' },
  { name: 'title', type: 'string', default: "'Eval race'", description: 'Header title.' },
  { name: 'subtitle', type: 'string', description: 'Secondary line under the title. Defaults to the model and case counts.' },
  { name: 'layout', type: "'race' | 'standings'", default: "'race'", description: 'The full track first, or the table first with a small track beside the headline.' },
  { name: 'status', type: "'live' | 'final'", description: 'Overrides the header state. Final once every racer has scored total by default.' },
  { name: 'formatTime', type: '(seconds: number) => string', default: "s => s.toFixed(1) + 's'", description: 'Formats lap times and time gaps.' },
  { name: 'onSelect', type: '(id: string | null) => void', description: 'Called when a racer is hovered or reached with the arrow keys.' },
  { name: 'className', type: 'string', description: 'Extra classes for the root.' },
]

export function EvalRacePage() {
  const settings = useDemoSettings(DEFAULTS)
  const { layout, tickMs } = settings.values
  const data = layout === 'standings' ? STANDINGS : RACE
  const last = data.frames.length - 1

  // `run` bumps on Start / Restart so the interval restarts from frame 0.
  const [run, setRun] = useState(0)
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    setFrame(0)
    const timer = setInterval(() => {
      setFrame((f) => {
        if (f >= last) {
          clearInterval(timer)
          return f
        }
        return f + 1
      })
    }, tickMs)
    return () => clearInterval(timer)
  }, [run, last, tickMs])

  const racers = data.frames[Math.min(frame, last)]
  const finished = frame >= last

  const usage = toUsageSnippet({
    component: 'EvalRace',
    from: '@/components/ui/eval-race',
    props: {
      racers: { expression: 'racers' },
      total: data.total,
      perLap: data.perLap,
      title: data.title,
      subtitle: data.subtitle,
      layout,
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / eval-race"
      title="Eval Race"
      description={
        <>
          Several models scoring the same eval set, drawn as a race around a
          stadium track, with standings, gaps and the fastest lap. Hover or use
          the arrow keys on the standings. Adapted from{' '}
          <a href="https://tuffui.com" target="_blank" rel="noreferrer">
            TuffUI
          </a>{' '}
          (MIT).
        </>
      }
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Layout"
            options={LAYOUTS}
            value={layout}
            onChange={(next) => settings.set('layout', next)}
          />
          <DemoSlider
            label="Tick"
            value={tickMs}
            onValueChange={(next) => settings.set('tickMs', next)}
            min={100}
            max={600}
            step={50}
            unit="ms"
          />
          <DemoAction onClick={() => setRun((n) => n + 1)}>
            {finished ? 'Restart race' : 'Restart'}
          </DemoAction>
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/ui/eval-race/', 'src/components/ui/surface/'],
        usage,
        props: PROPS,
      }}
    >
      <EvalRace
        racers={racers}
        total={data.total}
        perLap={data.perLap}
        title={data.title}
        subtitle={data.subtitle}
        layout={layout}
      />
    </DemoPage>
  )
}
