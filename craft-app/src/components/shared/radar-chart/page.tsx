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
import { RadarChart } from '@/components/ui/radar-chart'

import {
  EVALS,
  MODELS,
  SENIOR_BAR,
  SHIP_BAR,
  SKILLS,
  TEAM,
  average,
} from './radar-chart.data'

const DATASETS = ['Team skills', 'Model eval'] as const

const DEFAULTS = {
  dataset: 'Team skills' as (typeof DATASETS)[number],
  baseline: true,
  members: 4,
  headline: true,
}

const COMPONENT_DEFAULTS = {}

const PROPS: DemoPropDoc[] = [
  { name: 'axes', type: 'string[]', description: 'One label per axis, clockwise from the top. Five to eight read best.' },
  { name: 'max', type: 'number', description: 'Top of the scale, drawn as the outer ring. Up to 10 gets a ring per step, otherwise four.' },
  { name: 'series', type: 'RadarSeries', description: 'The filled polygon, e.g. a team average. Its values label each axis.' },
  { name: 'baseline', type: '{ label: string; values: number[] }', description: 'A dashed polygon to measure against, like the bar for a level.' },
  { name: 'members', type: 'RadarMember[]', default: '[]', description: 'Individual values drawn as dots on each spoke. Hovering an axis lists them all.' },
  { name: 'title', type: 'string', description: 'Header title.' },
  { name: 'subtitle', type: 'string', description: 'Secondary line under the title.' },
  { name: 'headline', type: '{ value: string; caption?: string }', description: 'Number on the right of the header, with a short caption.' },
  { name: 'format', type: '(value: number) => string', default: 'v.toFixed(1)', description: 'Formats every value: axis labels, tooltip and screen reader text.' },
  { name: 'onSelect', type: '(axis: number) => void', description: 'Called when an axis is hovered or reached with the arrow keys.' },
  { name: 'className', type: 'string', description: 'Extra classes for the root.' },
]

export function RadarChartPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { dataset, baseline, members, headline } = settings.values
  const [selected, setSelected] = useState<string | null>(null)

  const evals = dataset === 'Model eval'
  const axes = evals ? EVALS : SKILLS
  const people = (evals ? MODELS : TEAM).slice(0, members)
  const values = average(people.length ? people : evals ? MODELS : TEAM, axes.length)
  const mean = values.reduce((a, b) => a + b, 0) / values.length

  const usage = toUsageSnippet({
    component: 'RadarChart',
    from: '@/components/ui/radar-chart',
    props: {
      title: evals ? 'Model eval' : 'Team skills',
      axes: { expression: evals ? 'EVALS' : 'SKILLS' },
      max: evals ? 100 : 4,
      series: { expression: "{ id: 'avg', label: 'Average', values }" },
      baseline: baseline
        ? { expression: `{ label: '${evals ? 'Ship bar' : 'Senior bar'}', values: bar }` }
        : undefined,
      members: members > 0 ? { expression: 'people' } : undefined,
      onSelect: { expression: '(axis) => openRubric(axis)' },
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / radar-chart"
      title="Radar Chart"
      description={
        <>
          A polygon over a handful of axes on a fixed scale: a filled average,
          an optional dashed bar to beat, and every member as a dot on each
          spoke. Hover or use the arrow keys, Home, End and Escape to read each
          axis. Adapted from{' '}
          <a href="https://tuffui.com" target="_blank" rel="noreferrer">
            TuffUI
          </a>{' '}
          (MIT).
        </>
      }
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Data"
            options={DATASETS}
            value={dataset}
            onChange={(next) => settings.set('dataset', next)}
          />
          <DemoSlider
            label="Members"
            value={members}
            onValueChange={(next) => settings.set('members', next)}
            min={0}
            max={4}
          />
          <DemoSwitch
            label="Baseline"
            checked={baseline}
            onCheckedChange={(next) => settings.set('baseline', next)}
          />
          <DemoSwitch
            label="Headline"
            checked={headline}
            onCheckedChange={(next) => settings.set('headline', next)}
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/ui/radar-chart/', 'src/components/ui/surface/'],
        usage,
        props: PROPS,
      }}
    >
      <div className="flex w-full flex-col items-center gap-3">
        <RadarChart
          key={dataset}
          title={evals ? 'Model eval' : 'Team skills'}
          subtitle={
            evals
              ? 'Support agent · eval suite v14 · 1,200 cases'
              : `Design · Q3 review · ${people.length} people`
          }
          axes={axes}
          max={evals ? 100 : 4}
          series={{ id: 'avg', label: evals ? 'Routed mix' : 'Team average', values }}
          baseline={
            baseline
              ? {
                  label: evals ? 'Ship bar' : 'Senior bar',
                  values: evals ? SHIP_BAR : SENIOR_BAR,
                }
              : undefined
          }
          members={people}
          headline={
            headline
              ? evals
                ? { value: `${Math.round(mean)}`, caption: 'bar 77' }
                : { value: mean.toFixed(1), caption: 'bar 3.1' }
              : undefined
          }
          format={evals ? (v) => `${Math.round(v)}` : undefined}
          onSelect={(axis) => setSelected(axes[axis])}
        />
        <p className="text-xs text-muted-foreground" aria-live="polite">
          {selected ? `Last read: ${selected}` : 'Hover an axis or focus the chart and use the arrow keys.'}
        </p>
      </div>
    </DemoPage>
  )
}
