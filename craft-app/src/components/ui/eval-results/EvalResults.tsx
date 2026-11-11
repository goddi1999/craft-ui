// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { ArrowDown, ArrowUp, FlaskConical } from 'lucide-react'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { useRef, useState, type KeyboardEvent } from 'react'

import { cn } from '@/lib/utils'

import { RollingNumber } from '../rolling-number'
import { Segmented } from '../segmented-control'
import { Panel, Shell, ShellHeader } from '../surface'
import {
  COLS,
  TEXT_NEGATIVE,
  TEXT_POSITIVE,
  enter,
  filters,
  statuses,
} from './eval-results.constants'
import { CaseDetail, Compare } from './eval-results-parts'
import type { EvalCase, EvalFilter, EvalResultsProps } from './eval-results.types'
import { pct } from './eval-results.utils'

/**
 * A grid with one cell per eval case, filterable by outcome, with a detail
 * panel for the selected case and a compare view of metrics and regressions.
 * Arrow keys move through the grid.
 */
export function EvalResults({
  data,
  view = 'grid',
  filter: filterProp,
  onFilterChange,
  selectedId: selectedProp,
  onSelectCase,
  className,
}: EvalResultsProps) {
  const { cases } = data
  const [filterState, setFilter] = useState<EvalFilter>('all')
  const [selectedState, setSelected] = useState<string | null>(null)
  const [focus, setFocus] = useState(0)
  const [animateDetail, setAnimateDetail] = useState(true)
  const cells = useRef<(HTMLButtonElement | null)[]>([])
  const filter = filterProp ?? filterState
  const selectedId = selectedProp !== undefined ? selectedProp : selectedState
  const selected = cases.find((c) => c.id === selectedId)
  const match = filters.find((f) => f.id === filter)!.match

  const finished = cases.filter((c) => c.status !== 'pending' && c.status !== 'running')
  const passed = finished.filter((c) => c.status === 'pass' || c.status === 'improved')
  const rate = finished.length ? passed.length / finished.length : 0
  const delta = data.baselinePassRate !== undefined ? rate - data.baselinePassRate : null
  const inFlight = cases.length - finished.length
  const regressed = cases.filter((c) => c.status === 'regressed')

  const select = (c: EvalCase, viaKeyboard: boolean) => {
    setAnimateDetail(!viaKeyboard)
    setSelected(c.id)
    onSelectCase?.(c)
  }

  const onGridKey = (e: KeyboardEvent) => {
    const moves: Record<string, number> = {
      ArrowRight: 1,
      ArrowLeft: -1,
      ArrowDown: COLS,
      ArrowUp: -COLS,
    }
    let next = focus
    if (e.key in moves) next = focus + moves[e.key]
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = cases.length - 1
    else return
    e.preventDefault()
    next = Math.max(0, Math.min(cases.length - 1, next))
    setFocus(next)
    cells.current[next]?.focus()
  }

  return (
    <MotionConfig reducedMotion="user">
      <Shell
        data-slot="eval-results"
        aria-label={`Eval results: ${data.suite}`}
        className={cn('max-w-lg', className)}
      >
        <ShellHeader
          icon={FlaskConical}
          title={<span className="font-mono">{data.suite}</span>}
          subtitle={
            <>
              {data.label ? `${data.label} · ` : ''}
              {inFlight ? (
                <>
                  <RollingNumber value={String(inFlight)} /> of {cases.length} running
                </>
              ) : (
                `${cases.length} cases`
              )}
            </>
          }
          aside={
            <div className="text-right">
              <p className="font-mono text-2xl leading-tight font-medium tracking-tight tabular-nums">
                <RollingNumber value={pct(rate)} />
              </p>
              {delta !== null && (
                <span
                  className={cn(
                    'inline-flex items-center gap-0.5 font-mono text-xs tabular-nums',
                    delta >= 0 ? TEXT_POSITIVE : TEXT_NEGATIVE,
                  )}
                >
                  {delta >= 0 ? (
                    <ArrowUp strokeWidth={2.5} className="size-3" aria-hidden="true" />
                  ) : (
                    <ArrowDown strokeWidth={2.5} className="size-3" aria-hidden="true" />
                  )}
                  <span className="sr-only">{delta >= 0 ? 'Up' : 'Down'}</span>
                  <RollingNumber value={Math.abs(delta * 100).toFixed(1)} /> pts vs
                  baseline
                </span>
              )}
            </div>
          }
        />

        <Panel className="p-3">
          {view === 'grid' ? (
            <>
              <Segmented
                label="Filter cases"
                className="mb-3 max-w-full overflow-x-auto"
                value={filter}
                onValueChange={(next) => {
                  setFilter(next)
                  onFilterChange?.(next)
                }}
                options={filters.map((f) => ({
                  value: f.id,
                  label: (
                    <span className="whitespace-nowrap">
                      {f.label}
                      <RollingNumber
                        className="ml-1.5 font-mono text-xs opacity-60"
                        value={String(cases.filter((c) => f.match(c.status)).length)}
                      />
                    </span>
                  ),
                }))}
              />
              <div
                role="grid"
                aria-label="Cases"
                onKeyDown={onGridKey}
                className="grid grid-cols-12 gap-1"
              >
                {cases.map((c, i) => {
                  const s = statuses[c.status]
                  const Icon = s.icon
                  const dim = !match(c.status)
                  return (
                    <button
                      key={c.id}
                      ref={(el) => {
                        cells.current[i] = el
                      }}
                      type="button"
                      role="gridcell"
                      tabIndex={i === focus ? 0 : -1}
                      aria-selected={c.id === selectedId}
                      aria-label={`${c.name}: ${s.label}`}
                      title={`${c.name} · ${s.label}`}
                      onFocus={() => setFocus(i)}
                      onClick={(e) => select(c, e.detail === 0)}
                      className={cn(
                        'flex aspect-square items-center justify-center rounded-[5px] transition-[background-color,opacity,scale] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.92] motion-reduce:transition-none',
                        s.cell,
                        dim && 'opacity-20',
                        // Selection changes the shape, not an outline.
                        c.id === selectedId && 'scale-90 rounded-full',
                      )}
                    >
                      {Icon && (
                        <Icon
                          strokeWidth={2.5}
                          className={cn(
                            'size-3',
                            c.status === 'running' &&
                              'animate-spin motion-reduce:animate-none',
                          )}
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  )
                })}
              </div>
            </>
          ) : (
            <Compare
              metrics={data.metrics ?? []}
              regressed={regressed}
              onSelect={(c, kb) => select(c, kb)}
            />
          )}

          <AnimatePresence mode="wait" initial={false}>
            {selected && (
              <motion.div
                key={selected.id}
                initial={animateDetail ? { opacity: 0, y: 4 } : false}
                animate={{ opacity: 1, y: 0, transition: enter }}
                exit={{ opacity: 0, transition: { duration: animateDetail ? 0.12 : 0 } }}
                className="mt-3"
              >
                <CaseDetail selected={selected} />
              </motion.div>
            )}
          </AnimatePresence>
        </Panel>

        <p role="status" aria-live="polite" className="sr-only">
          {cases.length > 0 && !inFlight
            ? `Eval finished: ${passed.length} of ${cases.length} passed`
            : ''}
        </p>
      </Shell>
    </MotionConfig>
  )
}
