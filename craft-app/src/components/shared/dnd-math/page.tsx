import { useRef, useState } from 'react'

import {
  DemoAction,
  DemoControlGroup,
  DemoSettings,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { DnDMath, type DnDMathHandle, type DnDMathScore } from '@/components/ui/dnd-math'

// word problems with a model solution, one equation per step
const TASKS = {
  shop: {
    question:
      'A bike shop buys 40 helmets at 8,50 € each and pays 19 % VAT on top. What does it pay in total?',
    solution: ['40 × 8,50 €', '340 € × 19 %', '340 € + 64,60 €'],
  },
  energy: {
    question: 'A 25,5 kW heater runs for 11 h. Power costs 0,26 €/kWh. What does the run cost?',
    solution: ['25,5 kW × 11 h', '280,5 kWh × 0,26 €/kWh'],
  },
  garden: {
    question:
      'Two beds: one 4 m × 3 m, one 2 m × 5 m. Soil costs 6 €/m². What does soil for both cost?',
    solution: ['4 m × 3 m', '2 m × 5 m', '12 m² + 10 m²', '22 m² × 6 €/m²'],
  },
} as const

type Task = keyof typeof TASKS
const WEIGHTINGS = ['full', 'result'] as const
const MODES = ['carry', 'strict'] as const
const LOCALES = ['de-DE', 'en-US'] as const

const DEFAULTS = {
  task: 'shop' as Task,
  weighting: 'full' as (typeof WEIGHTINGS)[number],
  mode: 'carry' as (typeof MODES)[number],
  locale: 'de-DE' as (typeof LOCALES)[number],
  graceful: false,
  prefill: false,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'solution',
    type: 'string[]',
    description:
      'The model answer, one equation per step. Check scores the canvas against it with PSCA.',
  },
  { name: 'points', type: 'number', default: '10', description: 'Points for a perfect answer.' },
  {
    name: 'weighting',
    type: "'full' | 'result'",
    default: "'full'",
    description:
      'full: 50 % result, 30 % steps, 15 % method, 5 % units and notation. result: only the final answer.',
  },
  {
    name: 'mode',
    type: "'carry' | 'strict'",
    default: "'carry'",
    description:
      'carry: a step built on an earlier wrong result is judged on its own working. strict: against the model values.',
  },
  {
    name: 'graceful',
    type: 'boolean',
    default: 'false',
    description: 'A wrong final answer earns partial credit by how close it is.',
  },
  {
    name: 'locale',
    type: 'string',
    default: "'de-DE'",
    description: 'How numbers are shown, and the decimal mark carried values are typed with.',
  },
  {
    name: 'defaultRows',
    type: 'string[]',
    description: 'Equations already on the canvas, worked out on mount.',
  },
  {
    name: 'onCheck',
    type: '(score: DnDMathScore) => void',
    description:
      'Points, the four PSCA parts (0–1), a mark per row and how many steps are missing.',
  },
  { name: 'onRowsChange', type: '(rows) => void', description: 'Every change to the canvas.' },
  {
    name: 'ref',
    type: '{ check(), reset() }',
    description: 'Check from your own button, or clear the canvas.',
  },
  {
    name: 'showCheck',
    type: 'boolean',
    default: 'true',
    description: 'The built-in Check button.',
  },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Freeze the canvas.' },
]

const percent = (value: number) => `${Math.round(value * 100)} %`

export function DnDMathPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { task, weighting, mode, locale, graceful, prefill } = settings.values
  const { question, solution } = TASKS[task]
  const canvas = useRef<DnDMathHandle>(null)
  const [round, setRound] = useState(0)
  const [last, setLast] = useState<DnDMathScore | null>(null)

  const restart = () => {
    setLast(null)
    setRound((value) => value + 1)
  }
  const change = <K extends keyof typeof DEFAULTS>(key: K, value: (typeof DEFAULTS)[K]) => {
    settings.set(key, value)
    restart()
  }

  const usage = toUsageSnippet({
    component: 'DnDMath',
    from: '@/components/ui/dnd-math',
    props: {
      solution: { expression: JSON.stringify(solution) },
      weighting,
      mode,
      graceful,
      locale,
      onCheck: { expression: '(score) => save(score.points)' },
    },
    defaults: { weighting: 'full', mode: 'carry', graceful: false, locale: 'de-DE' },
  })

  return (
    <DemoPage
      eyebrow="ui / dnd-math"
      title="Drag & Drop Math"
      description="Work a word problem out step by step. Drag an Equation block in and type a step with its units; Enter works it out and blocks combinations that make no sense, like € + kg. Drag a result into the next step or into a Σ row to add results up. Check scores every step with PSCA: result, steps, method and units, each with partial credit."
      previewClassName="min-h-[480px]"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Task"
            options={Object.keys(TASKS) as Task[]}
            value={task}
            onChange={(next) => change('task', next)}
          />
          <DemoControlGroup
            title="Weighting"
            options={WEIGHTINGS}
            value={weighting}
            onChange={(next) => change('weighting', next)}
          />
          <DemoControlGroup
            title="Mode"
            options={MODES}
            value={mode}
            onChange={(next) => change('mode', next)}
          />
          <DemoControlGroup
            title="Locale"
            options={LOCALES}
            value={locale}
            onChange={(next) => change('locale', next)}
          />
          <DemoSwitch
            label="Partial credit when close"
            checked={graceful}
            onCheckedChange={(next) => change('graceful', next)}
          />
          <DemoSwitch
            label="Start with step one"
            checked={prefill}
            onCheckedChange={(next) => change('prefill', next)}
          />
          <DemoAction onClick={restart}>Start over</DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/dnd-math/'], usage, props: PROPS }}
    >
      <div className="flex w-full max-w-2xl flex-col gap-4 py-4">
        <p className="text-base font-medium text-balance">{question}</p>
        <DnDMath
          key={round}
          ref={canvas}
          solution={solution}
          weighting={weighting}
          mode={mode}
          graceful={graceful}
          locale={locale}
          defaultRows={prefill ? solution.slice(0, 1) : undefined}
          onCheck={setLast}
          onRowsChange={() => setLast(null)}
        />
        <p className="text-xs text-muted-foreground tabular-nums">
          {last
            ? `${last.points} / ${last.maxPoints} points · result ${percent(last.result)} · steps ${percent(last.steps)} · method ${percent(last.method)} · error-free ${percent(last.errorFree)}`
            : 'Type a step like 40 × 8,50 € and press Enter. Tap a result to carry it into a new step.'}
        </p>
      </div>
    </DemoPage>
  )
}
