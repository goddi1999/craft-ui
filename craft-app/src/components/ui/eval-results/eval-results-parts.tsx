// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { ArrowDown } from 'lucide-react'

import { cn } from '@/lib/utils'

import { ProgressBar } from '../progress-bar'
import { StatusPill } from '../status-pill'
import { Inset } from '../surface'
import { TEXT_WARNING, statuses } from './eval-results.constants'
import type { EvalCase, EvalMetric } from './eval-results.types'
import { formatCount } from './eval-results.utils'

/** The selected case: status, score and the input, expected and actual text. */
function CaseDetail({ selected }: { selected: EvalCase }) {
  return (
    <Inset className="p-3">
      <div className="mb-2 flex items-center gap-2">
        <p className="min-w-0 flex-1 truncate font-mono text-[0.8125rem]">
          {selected.name}
        </p>
        <StatusPill size="sm" tone={statuses[selected.status].tone} className="text-xs">
          {statuses[selected.status].label}
        </StatusPill>
        {selected.score !== undefined && (
          <span className="font-mono text-xs text-muted-foreground tabular-nums">
            score {selected.score.toFixed(2)}
          </span>
        )}
      </div>
      <dl className="grid gap-2 @lg:grid-cols-3">
        {(
          [
            ['Input', selected.input],
            ['Expected', selected.expected],
            ['Actual', selected.actual],
          ] as const
        ).map(([label, value]) => (
          <div key={label} className="min-w-0 rounded-lg bg-card p-2">
            <dt className="mb-1 text-xs text-muted-foreground">{label}</dt>
            <dd className="font-mono text-xs break-words whitespace-pre-wrap">
              {value ?? '—'}
            </dd>
          </div>
        ))}
      </dl>
      {selected.reason && (
        <p className="mt-2 text-[0.8125rem] text-muted-foreground">{selected.reason}</p>
      )}
    </Inset>
  )
}

type CompareProps = {
  metrics: EvalMetric[]
  regressed: EvalCase[]
  onSelect: (c: EvalCase, viaKeyboard: boolean) => void
}

/** Baseline against candidate per metric, then the cases that regressed. */
function Compare({ metrics, regressed, onSelect }: CompareProps) {
  return (
    <div>
      <ul className="space-y-3">
        {metrics.map((m) => {
          const max = Math.max(m.baseline, m.candidate, Number.EPSILON)
          const fmt = m.format ?? formatCount
          const diff = m.candidate - m.baseline
          const improved = m.better === 'higher' ? diff > 0 : diff < 0
          const same = Math.abs(diff) < Number.EPSILON
          return (
            <li key={m.id}>
              <div className="mb-1.5 flex items-baseline justify-between gap-2 text-[0.8125rem]">
                <span>{m.label}</span>
                <StatusPill
                  size="sm"
                  tone={same ? 'neutral' : improved ? 'positive' : 'negative'}
                  className="text-xs"
                >
                  {same
                    ? 'No change'
                    : `${improved ? 'Better' : 'Worse'} · ${fmt(Math.abs(diff))}`}
                </StatusPill>
              </div>
              {(
                [
                  ['Baseline', m.baseline, 'neutral'],
                  ['Candidate', m.candidate, 'brand'],
                ] as const
              ).map(([label, value, tone]) => (
                <div key={label} className="flex items-center gap-2 py-0.5">
                  <span className="w-16 shrink-0 text-xs text-muted-foreground">
                    {label}
                  </span>
                  <ProgressBar
                    kind="meter"
                    striped
                    tone={tone}
                    value={value}
                    max={max}
                    label={`${m.label}, ${label.toLowerCase()}`}
                    valueText={fmt(value)}
                    className="flex-1"
                  />
                  <span className="w-16 shrink-0 text-right font-mono text-xs tabular-nums">
                    {fmt(value)}
                  </span>
                </div>
              ))}
            </li>
          )
        })}
      </ul>
      <h4 className="mt-4 mb-1 text-[0.8125rem] text-muted-foreground">
        Regressed cases · {regressed.length}
      </h4>
      {regressed.length === 0 ? (
        <p className="py-2 text-[0.8125rem] text-muted-foreground">Nothing regressed.</p>
      ) : (
        <ul>
          {regressed.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={(e) => onSelect(c, e.detail === 0)}
                className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left transition-[background-color,scale] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-foreground/[0.04] active:scale-[0.99]"
              >
                <ArrowDown
                  strokeWidth={2.5}
                  className={cn('size-3.5 shrink-0', TEXT_WARNING)}
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1 truncate font-mono text-[0.8125rem]">
                  {c.name}
                </span>
                {c.score !== undefined && (
                  <span className="font-mono text-xs text-muted-foreground tabular-nums">
                    {c.score.toFixed(2)}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export { CaseDetail, Compare }
