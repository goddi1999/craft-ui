import { useEffect, useMemo, useState } from 'react'

import {
  DemoAction,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { DeployTimeline, type Deploy } from '@/components/ui/deploy-timeline'

import { HISTORY, RANGE, canaryAt } from './deploy-timeline.data'

const DEFAULTS = {
  threshold: 88,
  canary: true,
  live: true,
  intro: true,
  actions: true,
}

const COMPONENT_DEFAULTS = { title: 'Deployments', live: true, intro: true }

const INTRO_MS = 1900 // the line draws in, then the canary starts moving
const GROW_MS = 5200 // the canary runs from deploy to now

const PROPS: DemoPropDoc[] = [
  {
    name: 'deploys',
    type: 'Deploy[]',
    description:
      'Every prompt and model deploy in the window, in any order. The score steps at each one; a deploy with `rolledBackAfter` dips and comes back, the latest one with `canary` runs as a dashed line beside live.',
  },
  {
    name: 'threshold',
    type: 'number',
    description:
      'Minimum eval score, drawn as a dashed line. Deploys under it count as regressions even without a rollback.',
  },
  {
    name: 'range',
    type: '[Date | string | number, Date | string | number]',
    default: 'around the deploys',
    description: 'Time window of the axis. Day labels thin out to fit the width.',
  },
  {
    name: 'now',
    type: 'Date | string | number',
    default: 'end of range',
    description:
      'Where the score line stops. Move it forward to grow the live and canary lines.',
  },
  {
    name: 'live',
    type: 'boolean',
    default: 'true',
    description: 'Pulses the canary while traffic is still being scored.',
  },
  {
    name: 'title',
    type: 'string',
    default: "'Deployments'",
    description: 'Header title.',
  },
  { name: 'subtitle', type: 'string', description: 'Secondary line under the title.' },
  {
    name: 'stats',
    type: 'DeployStat[]',
    default: 'live, canary, eval, deploys',
    description: 'Chips under the chart. Pass `[]` to hide them.',
  },
  {
    name: 'selectedId',
    type: 'string | null',
    description: 'Controlled selection. Left out, the component keeps its own.',
  },
  {
    name: 'onSelect',
    type: '(deploy: Deploy | null) => void',
    description:
      'Called when a marker (or its segment of the line) is clicked; null when cleared again or with Escape.',
  },
  {
    name: 'onCompare',
    type: '(deploy: Deploy, live: Deploy) => void',
    description:
      'Shows a Compare button for the selected deploy against live. With nothing selected it compares the last good version before live.',
  },
  {
    name: 'onRollback',
    type: '(deploy: Deploy) => void',
    description:
      'Shows a Roll back button to the selected deploy, or the last good version before live. Disabled for live, the canary and regressions.',
  },
  {
    name: 'aside',
    type: 'ReactNode',
    description: 'Extra content in the header, before the buttons.',
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description:
      'Draws the line in from the left on mount, then markers and the regression callout. Skipped with reduced motion.',
  },
  {
    name: 'formatScore',
    type: '(score: number) => string',
    default: 'score.toFixed(3)',
    description: 'Formats scores in the callout, chips and the minimum label.',
  },
  {
    name: 'formatDate',
    type: '(date: Date) => string',
    default: "'Nov 2' in UTC",
    description: 'Formats the day axis and dates in the callout.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Extra classes for the root element.',
  },
]

/** One frame clock: after the intro the canary's progress runs from 0 to 1. */
function useCanaryClock(enabled: boolean, run: number) {
  const [p, setP] = useState(enabled ? 0 : 1)
  useEffect(() => {
    if (!enabled) {
      setP(1)
      return
    }
    setP(0)
    let frame = 0
    let start = 0
    const tick = (now: number) => {
      start ||= now + INTRO_MS
      const next = Math.min(Math.max((now - start) / GROW_MS, 0), 1)
      setP(next)
      if (next < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [enabled, run])
  return p
}

export function DeployTimelinePage() {
  const settings = useDemoSettings(DEFAULTS)
  const { threshold, canary: withCanary, live, intro, actions } = settings.values
  const [run, setRun] = useState(0)
  const [log, setLog] = useState('Select a marker, then compare or roll back')
  const p = useCanaryClock(withCanary && intro, run)

  const { now, canary } = canaryAt(p)
  const deploys = useMemo<Deploy[]>(
    () => (withCanary ? [...HISTORY, canary] : HISTORY),
    [withCanary, canary],
  )

  const usage = toUsageSnippet({
    component: 'DeployTimeline',
    from: '@/components/ui/deploy-timeline',
    props: {
      deploys: { expression: 'releases' },
      threshold: threshold / 100,
      range: { expression: '[daysAgo(14), new Date()]' },
      live,
      intro,
      onCompare: actions
        ? { expression: '(version, live) => openDiff(version, live)' }
        : undefined,
      onRollback: actions
        ? { expression: '(version) => confirmRollback(version)' }
        : undefined,
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / deploy-timeline"
      title="Deploy Timeline"
      description={
        <>
          Prompt and model versions on a rail over the eval score they shipped with.
          Regressions dip under the minimum and come back on rollback, a canary runs as a
          dashed line beside live. Hover or focus a marker for details, click to select,
          Escape clears. Adapted from{' '}
          <a href="https://tuffui.com" target="_blank" rel="noreferrer">
            TuffUI
          </a>{' '}
          (MIT).
        </>
      }
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSlider
            label="Minimum score"
            value={threshold}
            onValueChange={(next) => settings.set('threshold', next)}
            min={86}
            max={92}
            step={0.5}
            unit="%"
          />
          <DemoSwitch
            label="Canary"
            checked={withCanary}
            onCheckedChange={(next) => settings.set('canary', next)}
          />
          <DemoSwitch
            label="Live pulse"
            checked={live}
            onCheckedChange={(next) => settings.set('live', next)}
          />
          <DemoSwitch
            label="Intro"
            checked={intro}
            onCheckedChange={(next) => {
              settings.set('intro', next)
              setRun((r) => r + 1)
            }}
          />
          <DemoSwitch
            label="Compare / Roll back"
            checked={actions}
            onCheckedChange={(next) => settings.set('actions', next)}
          />
          <DemoAction onClick={() => setRun((r) => r + 1)}>Replay</DemoAction>
        </DemoSettings>
      }
      docs={{
        paths: [
          'src/components/ui/deploy-timeline/',
          'src/components/ui/surface/',
          'src/components/ui/rolling-number/',
          'src/components/ui/button.tsx',
        ],
        usage,
        props: PROPS,
      }}
    >
      <div className="flex w-full max-w-2xl flex-col items-center gap-4">
        <DeployTimeline
          // Remount on replay so the intro draws in again.
          key={run}
          title="Deployments"
          subtitle="triage-l · prompt & model versions · 14 days"
          deploys={deploys}
          threshold={threshold / 100}
          range={RANGE}
          now={now}
          live={live}
          intro={intro}
          onSelect={(d) => setLog(d ? `Selected ${d.version}` : 'Selection cleared')}
          onCompare={
            actions
              ? (d, l) => setLog(`Compare ${d.version} with ${l.version}`)
              : undefined
          }
          onRollback={actions ? (d) => setLog(`Rolled back to ${d.version}`) : undefined}
        />
        <p
          role="status"
          aria-live="polite"
          className="min-h-5 font-mono text-xs text-muted-foreground"
        >
          {log}
        </p>
      </div>
    </DemoPage>
  )
}
