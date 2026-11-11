import { useEffect, useRef, useState } from 'react'

import {
  DemoAction,
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { LapTimer, type LapSector } from '@/components/ui/lap-timer'
import { StatusPill } from '@/components/ui/status-pill'

const DIAL_OPTIONS = ['auto', 30, 60] as const

type Stage = Omit<LapSector, 'split'> & { time: number }

const BEST_LAP = 44.1

/** Stage times of a run that beats the best lap and of one that misses it. */
const RUNS: Record<'beat' | 'miss', Stage[]> = {
  beat: [
    { id: 'retrieve', label: 'retrieve', best: 13.9, time: 13.1 },
    { id: 'generate', label: 'generate', best: 19.2, time: 19.6 },
    { id: 'score', label: 'score', best: 10.7, time: 8.8 },
  ],
  miss: [
    { id: 'retrieve', label: 'retrieve', best: 13.9, time: 14.6 },
    { id: 'generate', label: 'generate', best: 19.2, time: 20.4 },
    { id: 'score', label: 'score', best: 10.7, time: 9.9 },
  ],
}

const DEFAULTS = {
  speed: 4,
  dial: 'auto' as (typeof DIAL_OPTIONS)[number],
  miss: false,
  pill: true,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'sectors',
    type: 'LapSector[]',
    description:
      'Stages in order. Each one paints its arc on the dial; the first one without a split is the running one.',
  },
  {
    name: 'elapsed',
    type: 'number',
    description: 'Seconds since the lap started. Drives the hand and the clock.',
  },
  {
    name: 'best',
    type: 'number',
    default: 'sum of sector bests',
    description:
      'Best full lap in seconds. Marked on the dial and used for the delta next to the clock.',
  },
  {
    name: 'running',
    type: 'boolean',
    default: 'true',
    description:
      'Whether the lap is still going. When false, the last split ends the lap.',
  },
  {
    name: 'dial',
    type: 'number',
    default: 'auto',
    description:
      'Seconds per turn of the dial. Left out, it picks the smallest of 10 s, 15 s, 20 s, 30 s, 1 min… that fits the best lap.',
  },
  { name: 'title', type: 'string', description: 'Header title.' },
  { name: 'subtitle', type: 'string', description: 'Secondary line under the title.' },
  {
    name: 'lap',
    type: 'string',
    description: 'Label above the dial next to the sector count, e.g. "Lap 3".',
  },
  {
    name: 'aside',
    type: 'ReactNode',
    description: 'Extra content on the right of the header, e.g. a status pill.',
  },
  {
    name: 'format',
    type: '(seconds: number) => string',
    default: "s.toFixed(1) + ' s'",
    description: 'Formats split times and the best lap. The clock is always mm:ss.t.',
  },
  { name: 'className', type: 'string', description: 'Extra classes for the card.' },
]

/**
 * Ticks `elapsed` on a frame clock while playing, `speed` simulated seconds per
 * real second, and stops at `total`.
 */
function useLapClock(total: number, speed: number) {
  const [elapsed, setElapsed] = useState(0)
  const [playing, setPlaying] = useState(true)
  const last = useRef<number | null>(null)
  // Mirrors `elapsed` so the frame loop can read it without waiting for a render.
  const time = useRef(0)

  useEffect(() => {
    if (!playing) return
    let frame = 0
    const tick = (now: number) => {
      const dt = last.current === null ? 0 : (now - last.current) / 1000
      last.current = now
      time.current = Math.min(time.current + dt * speed, total)
      setElapsed(time.current)
      if (time.current >= total) setPlaying(false)
      else frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      last.current = null
    }
  }, [playing, speed, total])

  const start = () => {
    // Starting after the finish begins a new lap.
    if (time.current >= total) {
      time.current = 0
      setElapsed(0)
    }
    setPlaying(true)
  }
  const pause = () => setPlaying(false)
  const reset = () => {
    time.current = 0
    setElapsed(0)
    setPlaying(false)
  }
  return { elapsed, playing, start, pause, reset }
}

export function LapTimerPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { speed, dial, miss, pill } = settings.values

  const stages = RUNS[miss ? 'miss' : 'beat']
  const total = stages.reduce((a, s) => a + s.time, 0)
  const { elapsed, playing, start, pause, reset } = useLapClock(total, speed)

  // A sector resolves once the clock passes its end.
  const sectors: LapSector[] = stages.map(({ time, ...s }, i) => {
    const edge = stages.slice(0, i + 1).reduce((a, x) => a + x.time, 0)
    return elapsed >= edge - 1e-6 ? { ...s, split: time } : s
  })
  const running = elapsed < total
  const idle = !playing && elapsed === 0
  const newBest = total < BEST_LAP

  const usage = toUsageSnippet({
    component: 'LapTimer',
    from: '@/components/ui/lap-timer',
    props: {
      title: 'Pipeline lap',
      lap: 'Lap 3',
      sectors: { expression: 'stages' },
      elapsed: { expression: 'elapsed' },
      best: BEST_LAP,
      running: { expression: '!run.finishedAt' },
      dial: dial === 'auto' ? undefined : dial,
    },
    defaults: { running: true },
  })

  return (
    <DemoPage
      eyebrow="ui / lap-timer"
      title="Lap Timer"
      description={
        <>
          A run as a stopwatch. The hand sweeps the dial while each stage paints its
          sector, green when it beat its best split and grey when it did not, and the
          clock carries the live delta against the best lap. Start, pause and reset the
          lap in the settings. Adapted from{' '}
          <a href="https://tuffui.com" target="_blank" rel="noreferrer">
            TuffUI
          </a>{' '}
          (MIT).
        </>
      }
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSlider
            label="Speed"
            value={speed}
            onValueChange={(next) => settings.set('speed', next)}
            min={1}
            max={8}
            unit="x"
          />
          <DemoControlGroup
            title="Dial (s per turn)"
            options={DIAL_OPTIONS}
            value={dial}
            onChange={(next) => settings.set('dial', next)}
          />
          <DemoSwitch
            label="Miss the best lap"
            checked={miss}
            onCheckedChange={(next) => {
              settings.set('miss', next)
              reset()
            }}
          />
          <DemoSwitch
            label="Status pill"
            checked={pill}
            onCheckedChange={(next) => settings.set('pill', next)}
          />
          <DemoAction onClick={playing ? pause : start}>
            {playing
              ? 'Pause'
              : elapsed >= total
                ? 'Run again'
                : elapsed > 0
                  ? 'Resume'
                  : 'Start'}
          </DemoAction>
          <DemoAction onClick={reset} disabled={idle}>
            Reset
          </DemoAction>
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/ui/lap-timer/', 'src/components/ui/surface/'],
        usage,
        props: PROPS,
      }}
    >
      <div className="flex w-full max-w-md flex-col items-center gap-4">
        <LapTimer
          title="Pipeline lap"
          subtitle="eval run 418 · support-qa"
          lap="Lap 3"
          sectors={sectors}
          elapsed={elapsed}
          best={BEST_LAP}
          running={running}
          dial={dial === 'auto' ? undefined : dial}
          aside={
            pill &&
            (playing ? (
              <StatusPill tone="brand" size="sm">
                Live
              </StatusPill>
            ) : running ? (
              <StatusPill tone="neutral" size="sm">
                {idle ? 'Ready' : 'Paused'}
              </StatusPill>
            ) : (
              <StatusPill tone={newBest ? 'positive' : 'neutral'} size="sm">
                {newBest ? 'New best' : 'Finished'}
              </StatusPill>
            ))
          }
        />
      </div>
    </DemoPage>
  )
}
