// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { TriangleAlert } from 'lucide-react'
import { motion } from 'motion/react'

import { cn } from '@/lib/utils'

import { ProgressBar } from '../progress-bar'
import { RollingNumber } from '../rolling-number'
import type { ColoredModel, UsageDay } from './usage-summary.types'
import { EASE_OUT, SPRING, STRIPES, dayLabel, formatTokens, sum } from './usage-summary.utils'

type DayBarProps = {
  day: UsageDay
  index: number
  count: number
  max: number
  models: ColoredModel[]
  money: (n: number) => string
  dense: boolean
  /** Index of the hovered/focused day, or null. */
  active: number | null
  instantTip: boolean
  focusable: boolean
  buttonRef: (el: HTMLButtonElement | null) => void
  label: string
  onEnter: () => void
  onFocus: () => void
  onBlur: () => void
  onSelect: () => void
  onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => void
}

/** One day: a stacked bar (a button) plus its tooltip. */
export function UsageDayBar({
  day,
  index: i,
  count,
  max,
  models,
  money,
  dense,
  active,
  instantTip,
  focusable,
  buttonRef,
  label,
  onEnter,
  onFocus,
  onBlur,
  onSelect,
  onKeyDown,
}: DayBarProps) {
  const cost = sum(day, 'cost')
  const first = i < 2
  const last = i > count - 3
  const align = first ? 'left-0' : last ? 'right-0' : 'left-1/2 -translate-x-1/2'
  return (
    <div className="relative flex h-full flex-1 flex-col justify-end">
      <button
        ref={buttonRef}
        type="button"
        tabIndex={focusable ? 0 : -1}
        aria-label={label}
        onMouseEnter={onEnter}
        onFocus={onFocus}
        onBlur={onBlur}
        onClick={onSelect}
        onKeyDown={onKeyDown}
        className="flex h-full w-full cursor-pointer flex-col justify-end rounded-md outline-offset-2 focus-visible:outline-2 focus-visible:outline-ring"
      >
        <motion.span
          initial={false}
          animate={{ height: `${(cost / max) * 100}%` }}
          transition={SPRING}
          className={cn(
            'flex min-h-1 w-full flex-col-reverse transition-opacity',
            dense ? 'gap-px' : 'gap-[3px]',
            active !== null && active !== i && 'opacity-45',
          )}
        >
          {models.map((m) => {
            const share = (day.byModel[m.id]?.cost ?? 0) / Math.max(cost, 0.0001)
            return share > 0 ? (
              <span
                key={m.id}
                className={cn(
                  'w-full shrink-0',
                  dense ? 'rounded-[2px]' : 'rounded-[5px]',
                  // Today is still counting up.
                  i === count - 1 && STRIPES,
                )}
                style={{ height: `${share * 100}%`, backgroundColor: m.color }}
              />
            ) : null
          })}
        </motion.span>
      </button>
      {active === i && (
        <motion.div
          initial={instantTip ? false : { opacity: 0, scale: 0.97, y: 2 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.125, ease: EASE_OUT }}
          style={{
            transformOrigin: first ? 'bottom left' : last ? 'bottom right' : 'bottom',
          }}
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute bottom-full z-10 mb-2 w-max min-w-36 rounded-xl bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md ring-1 ring-foreground/10',
            align,
          )}
        >
          <p className="mb-1 flex justify-between gap-4 font-medium">
            {dayLabel(day.date, true)}
            <span className="tabular-nums">{money(cost)}</span>
          </p>
          {models
            .filter((m) => day.byModel[m.id])
            .map((m) => (
              <p key={m.id} className="flex items-center gap-1.5 text-muted-foreground">
                <span className="size-1.5 rounded-full" style={{ background: m.color }} />
                <span className="flex-1">{m.name}</span>
                <span className="tabular-nums">{money(day.byModel[m.id].cost)}</span>
              </p>
            ))}
        </motion.div>
      )}
    </div>
  )
}

type ModelListProps = {
  models: (ColoredModel & { tokens: number; cost: number })[]
  money: (n: number) => string
}

export function UsageModelList({ models, money }: ModelListProps) {
  return (
    <ul className="px-2 pb-2">
      {models.map((m) => (
        <li key={m.id} className="flex items-center gap-3 rounded-xl px-2 py-2 text-sm">
          <span
            aria-hidden="true"
            className="size-2 shrink-0 rounded-full"
            style={{ background: m.color }}
          />
          <span className="min-w-0 flex-1 truncate">{m.name}</span>
          <span className="font-mono text-[0.8125rem] text-muted-foreground tabular-nums">
            {formatTokens(m.tokens)}
          </span>
          <span className="w-20 text-right font-mono text-[0.8125rem] tabular-nums">
            {money(m.cost)}
          </span>
        </li>
      ))}
    </ul>
  )
}

type BudgetFooterProps = {
  budget: { limit: number; label?: string }
  totalCost: number
  spent: number
  overWarn: boolean
  over: boolean
  money: (n: number) => string
}

export function UsageBudgetFooter({
  budget,
  totalCost,
  spent,
  overWarn,
  over,
  money,
}: BudgetFooterProps) {
  return (
    <footer className="px-3.5 pt-3 pb-2.5 text-[0.8125rem]">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p
          className={cn(
            'flex items-center gap-1.5',
            over
              ? 'text-(--negative)'
              : overWarn
                ? 'text-(--warning)'
                : 'text-muted-foreground',
          )}
        >
          {overWarn && (
            <TriangleAlert fill="currentColor" fillOpacity={0.25} className="size-3.5" aria-hidden="true" />
          )}
          {over
            ? 'Over budget'
            : overWarn
              ? 'Close to the budget'
              : (budget.label ?? 'Monthly budget')}
        </p>
        <p className="font-mono text-muted-foreground tabular-nums">
          <RollingNumber className="text-foreground" value={money(totalCost)} /> /{' '}
          {money(budget.limit)}
        </p>
      </div>
      <ProgressBar
        kind="meter"
        size="sm"
        striped
        tone={over ? 'negative' : overWarn ? 'warning' : 'positive'}
        value={Math.min(Math.round(totalCost * 100) / 100, budget.limit)}
        max={budget.limit}
        label="Budget used"
        valueText={`${money(totalCost)} of ${money(budget.limit)} (${Math.round(spent * 100)}%)`}
      />
    </footer>
  )
}
