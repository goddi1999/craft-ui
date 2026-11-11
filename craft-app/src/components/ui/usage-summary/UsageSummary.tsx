// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { ArrowDownRight, ArrowUpRight, ChartColumn } from 'lucide-react'
import { MotionConfig } from 'motion/react'
import { useRef, useState } from 'react'

import { cn } from '@/lib/utils'

import { RollingNumber } from '../rolling-number'
import { StatusPill } from '../status-pill'
import { Panel, Shell, ShellHeader } from '../surface'
import {
  UsageBudgetFooter,
  UsageDayBar,
  UsageModelList,
} from './usage-summary-parts'
import type { UsageDay, UsageSummaryProps } from './usage-summary.types'
import {
  PALETTE,
  dayLabel,
  formatMoney,
  formatTokens,
  sum,
} from './usage-summary.utils'

/**
 * Daily cost as stacked bars per model, with a hover/keyboard tooltip, a
 * per-model breakdown, a delta against the previous period and an optional
 * budget meter. Bars are real buttons: arrows, Home and End move between days.
 */
export function UsageSummary({
  data,
  currency = 'USD',
  warnAt = 0.8,
  title = 'Usage',
  onSelectDay,
  className,
}: UsageSummaryProps) {
  const { days, budget, previousCost } = data
  const money = (n: number) => formatMoney(n, currency)
  const models = data.models.map((m, i) => ({
    ...m,
    color: m.color ?? PALETTE[i % PALETTE.length],
  }))
  const [active, setActive] = useState<number | null>(null)
  // Only the first tooltip of a hover session animates; moving between bars or
  // stepping with the keyboard swaps it instantly.
  const [instantTip, setInstantTip] = useState(false)
  const [focusIndex, setFocusIndex] = useState(days.length - 1)
  const bars = useRef<(HTMLButtonElement | null)[]>([])

  const totalCost = days.reduce((n, d) => n + sum(d, 'cost'), 0)
  const totalTokens = days.reduce((n, d) => n + sum(d, 'tokens'), 0)
  const max = Math.max(...days.map((d) => sum(d, 'cost')), 0.0001)
  const delta = previousCost ? (totalCost - previousCost) / previousCost : null
  const dense = days.length > 14

  const perModel = models.map((m) => ({
    ...m,
    tokens: days.reduce((n, d) => n + (d.byModel[m.id]?.tokens ?? 0), 0),
    cost: days.reduce((n, d) => n + (d.byModel[m.id]?.cost ?? 0), 0),
  }))

  const spent = budget ? totalCost / budget.limit : 0
  const overWarn = !!budget && spent >= warnAt
  const over = !!budget && spent >= 1

  // Keep the roving focus index valid if the day count shrinks.
  const focusable = Math.min(focusIndex, days.length - 1)

  const move = (index: number) => {
    const next = Math.max(0, Math.min(days.length - 1, index))
    setFocusIndex(next)
    setInstantTip(true)
    setActive(next)
    bars.current[next]?.focus()
  }

  const describe = (day: UsageDay) =>
    `${dayLabel(day.date, true)}: ${money(sum(day, 'cost'))}, ${formatTokens(sum(day, 'tokens'))} tokens. ` +
    models
      .filter((m) => day.byModel[m.id])
      .map((m) => `${m.name} ${money(day.byModel[m.id].cost)}`)
      .join(', ')

  return (
    <MotionConfig reducedMotion="user">
      <Shell
        data-slot="usage-summary"
        aria-label={title}
        // Local colour tokens keep the folder portable: no theme setup needed.
        className={cn(
          'max-w-lg [--negative:oklch(0.55_0.22_27)] [--warning:oklch(0.56_0.14_65)] dark:[--negative:oklch(0.72_0.18_25)] dark:[--warning:oklch(0.83_0.15_82)]',
          className,
        )}
      >
        <ShellHeader
          icon={ChartColumn}
          title={title}
          subtitle={
            <>
              Last {days.length} days · <RollingNumber value={formatTokens(totalTokens)} />{' '}
              tokens
            </>
          }
          aside={
            <div className="text-right">
              <p className="text-2xl font-medium tracking-tight tabular-nums">
                <RollingNumber value={money(totalCost)} />
              </p>
              {delta !== null && (
                <StatusPill
                  size="sm"
                  tone={delta > 0 ? 'warning' : 'positive'}
                  icon={delta > 0 ? ArrowUpRight : ArrowDownRight}
                  iconWeight="bold"
                  className="mt-0.5 h-auto gap-0.5 px-1.5 text-xs tabular-nums"
                >
                  <span className="sr-only">{delta > 0 ? 'Up' : 'Down'}</span>
                  <RollingNumber value={`${Math.abs(Math.round(delta * 100))}%`} /> vs
                  previous
                </StatusPill>
              )}
            </div>
          }
        />

        <Panel>
          <div
            role="group"
            aria-label="Daily cost by model. Use arrow keys to move between days."
            className={cn(
              'relative flex h-44 items-end px-4 pt-14 pb-2',
              dense ? 'gap-[3px]' : 'gap-2',
            )}
            onMouseLeave={() => setActive(null)}
          >
            {days.map((day, i) => (
              <UsageDayBar
                key={day.date}
                day={day}
                index={i}
                count={days.length}
                max={max}
                models={models}
                money={money}
                dense={dense}
                active={active}
                instantTip={instantTip}
                focusable={i === focusable}
                buttonRef={(el) => {
                  bars.current[i] = el
                }}
                label={describe(day)}
                onEnter={() => {
                  setInstantTip(active !== null)
                  setActive(i)
                }}
                onFocus={() => {
                  setActive(i)
                  setFocusIndex(i)
                }}
                onBlur={() => setActive(null)}
                onSelect={() => onSelectDay?.(day)}
                onKeyDown={(e) => {
                  const keys: Record<string, number> = {
                    ArrowLeft: i - 1,
                    ArrowRight: i + 1,
                    Home: 0,
                    End: days.length - 1,
                  }
                  if (e.key in keys) {
                    e.preventDefault()
                    move(keys[e.key])
                  }
                }}
              />
            ))}
          </div>
          <div
            aria-hidden="true"
            className="flex justify-between px-4 pb-3 font-mono text-[0.6875rem] text-muted-foreground"
          >
            {days
              .filter((_, i) => !dense || i % 5 === 0 || i === days.length - 1)
              .map((d) => (
                <span key={d.date} className={cn(!dense && 'flex-1 text-center')}>
                  {dense
                    ? dayLabel(d.date, true).split(', ')[1]
                    : dayLabel(d.date, true).split(',')[0]}
                </span>
              ))}
          </div>

          <UsageModelList models={perModel} money={money} />
        </Panel>

        {budget && (
          <UsageBudgetFooter
            budget={budget}
            totalCost={totalCost}
            spent={spent}
            overWarn={overWarn}
            over={over}
            money={money}
          />
        )}
        <p role="status" aria-live="polite" className="sr-only">
          {over
            ? 'Over budget'
            : overWarn
              ? `${Math.round(spent * 100)}% of the budget used`
              : ''}
        </p>
      </Shell>
    </MotionConfig>
  )
}
