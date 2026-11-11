// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { Flag } from 'lucide-react'
import { MotionConfig, motion } from 'motion/react'
import { useState } from 'react'

import { cn } from '@/lib/utils'

import { Panel, Shell, ShellHeader } from '../surface'
import { COLS, ROW, WIDE, spring } from './eval-race.constants'
import { RaceRow, TrackView } from './eval-race-parts'
import type { EvalRaceProps } from './eval-race.types'
import { defaultFormatTime, plural, rankRacers } from './eval-race.utils'

/**
 * Several models scoring the same eval set, drawn as a race: one lap of the
 * track per `perLap` cases, numbered markers for positions, and standings
 * with gaps, lapped runners and the fastest lap.
 */
export function EvalRace({
  racers,
  total,
  perLap,
  title = 'Eval race',
  subtitle,
  layout = 'race',
  status,
  formatTime = defaultFormatTime,
  onSelect,
  className,
}: EvalRaceProps) {
  const [active, setActive] = useState<string | null>(null)
  const [fromKeyboard, setFromKeyboard] = useState(false)

  const laps = Math.max(Math.ceil(total / perLap), 1)
  const standings = rankRacers(racers, total, perLap, formatTime)
  const leader = standings[0]
  const second = standings[1]
  const final = status ? status === 'final' : standings.every((s) => s.done)

  const fastest = standings
    .filter((s) => s.best !== null)
    .sort((a, b) => (a.best ?? 0) - (b.best ?? 0))[0]

  const margin = !second
    ? ''
    : second.behind >= perLap
      ? `by ${plural(Math.floor(second.behind / perLap), 'lap')}`
      : second.behind > 0
        ? `by ${plural(second.behind, 'case')}`
        : second.gap.startsWith('+') && second.gap !== '+0'
          ? `by ${second.gap.slice(1)}`
          : ''
  const leaderLine = leader
    ? `${leader.label} ${leader.done ? (final ? 'wins' : 'finished first') : 'leads'}${margin ? ` ${margin}` : ''}`
    : 'No racers yet'

  const select = (id: string | null, keyboard: boolean) => {
    setFromKeyboard(keyboard)
    setActive(id)
    onSelect?.(id)
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    const n = standings.length
    if (!n) return
    const index = standings.findIndex((s) => s.id === active)
    const keys: Record<string, number> = {
      ArrowDown: index + 1,
      ArrowRight: index + 1,
      ArrowUp: (index < 0 ? n : index) - 1,
      ArrowLeft: (index < 0 ? n : index) - 1,
      Home: 0,
      End: n - 1,
    }
    if (event.key === 'Escape') return select(null, true)
    if (!(event.key in keys)) return
    event.preventDefault()
    select(standings[(keys[event.key] + n) % n].id, true)
  }

  const focused = standings.find((s) => s.id === active)
  const compact = layout === 'standings'

  const headline = (
    <div className="min-w-0">
      <p className="text-[0.8125rem] text-pretty text-muted-foreground">
        {leader && <span className="font-medium text-foreground">{leader.label}</span>}
        {leader ? leaderLine.slice(leader.label.length) : leaderLine}
      </p>
      <p className="mt-0.5 text-[1.75rem] leading-9 font-medium tracking-tight tabular-nums">
        {(leader?.scored ?? 0).toLocaleString('en-US')}
        <span className="text-lg text-muted-foreground">
          {' '}
          / {total.toLocaleString('en-US')}
        </span>
      </p>
      <p className="text-xs text-muted-foreground">
        Cases scored · 1 lap = {perLap.toLocaleString('en-US')}
      </p>
    </div>
  )

  return (
    <MotionConfig reducedMotion="user">
      <Shell data-slot="eval-race" className={cn('max-w-xl', className)}>
        <ShellHeader
          icon={Flag}
          title={title}
          subtitle={subtitle ?? `${plural(racers.length, 'model')} · ${total} cases`}
          aside={
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              {final ? (
                <Flag
                  fill="currentColor"
                  fillOpacity={0.25}
                  aria-hidden="true"
                  className="size-3.5"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-primary motion-safe:animate-pulse"
                />
              )}
              {final ? 'Final' : compact ? `Lap ${leader?.lap ?? 1} of ${laps}` : 'Live'}
            </span>
          }
        />
        <Panel className="p-4 @max-sm:p-3">
          {compact ? (
            <div className="flex items-center justify-between gap-4">
              {headline}
              <TrackView
                standings={standings}
                perLap={perLap}
                active={active}
                mini
                className="w-[34%] max-w-44 shrink-0"
              />
            </div>
          ) : (
            <>
              {headline}
              <TrackView
                standings={standings}
                perLap={perLap}
                active={active}
                onSelect={(id) => select(id, false)}
                className="mt-4"
                label={
                  <>
                    <p className="text-2xl font-medium tracking-tight tabular-nums @max-sm:text-xl">
                      {final ? (
                        'Final'
                      ) : (
                        <>
                          Lap {leader?.lap ?? 1}
                          <span className="text-muted-foreground"> / {laps}</span>
                        </>
                      )}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {fastest ? (
                        <>
                          Fastest lap · {fastest.label}{' '}
                          <span className="font-mono text-primary tabular-nums">
                            {formatTime(fastest.best ?? 0)}
                          </span>
                        </>
                      ) : (
                        `First lap · ${perLap} cases`
                      )}
                    </p>
                  </>
                }
              />
            </>
          )}

          <div
            tabIndex={0}
            role="group"
            aria-label={`${title} standings. Use arrow keys to read each model.`}
            onKeyDown={onKeyDown}
            onBlur={() => fromKeyboard && select(null, true)}
            onPointerLeave={() => select(null, false)}
            className="mt-4 rounded-xl outline-offset-2"
          >
            <div
              aria-hidden="true"
              className={cn(
                'grid h-7 items-center gap-2.5 px-2 text-[0.6875rem] text-muted-foreground',
                compact ? COLS.standings : COLS.race,
              )}
            >
              <span>Pos</span>
              <span>Model</span>
              <span className={WIDE[layout]}>Laps</span>
              <span className="text-right">Gap</span>
              {compact && <span className="hidden text-right @md:block">Last</span>}
              <span className="text-right">Best</span>
            </div>
            <div
              aria-hidden="true"
              className="relative"
              style={{ height: standings.length * ROW }}
            >
              {racers.map((racer) => {
                const s = standings.find((x) => x.id === racer.id)!
                return (
                  <motion.div
                    key={racer.id}
                    initial={false}
                    animate={{ y: s.rank * ROW }}
                    transition={fromKeyboard ? { duration: 0 } : spring}
                    onPointerEnter={() => select(s.id, false)}
                    className={cn(
                      'absolute inset-x-0 top-0 grid items-center gap-2.5 rounded-lg px-2 transition-colors duration-150',
                      compact ? COLS.standings : COLS.race,
                      active === s.id && 'bg-foreground/[0.05]',
                    )}
                    style={{ height: ROW }}
                  >
                    <RaceRow
                      s={s}
                      laps={laps}
                      total={total}
                      perLap={perLap}
                      layout={layout}
                      fastest={fastest?.id === s.id}
                      formatTime={formatTime}
                    />
                  </motion.div>
                )
              })}
            </div>
          </div>

          <table className="sr-only">
            <caption>{`${title}: ${leaderLine}`}</caption>
            <thead>
              <tr>
                <th scope="col">Position</th>
                <th scope="col">Model</th>
                <th scope="col">Cases scored</th>
                <th scope="col">Lap</th>
                <th scope="col">Gap</th>
                <th scope="col">Last lap</th>
                <th scope="col">Best lap</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((s) => (
                <tr key={s.id}>
                  <td>{s.rank + 1}</td>
                  <th scope="row">{s.name ?? s.label}</th>
                  <td>{`${s.scored} of ${total}`}</td>
                  <td>{s.done ? 'Finished' : `${s.lap} of ${laps}`}</td>
                  <td>{s.gap}</td>
                  <td>{s.last === null ? 'None' : formatTime(s.last)}</td>
                  <td>{s.best === null ? 'None' : formatTime(s.best)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p role="status" aria-live="polite" className="sr-only">
            {fromKeyboard && focused
              ? `Position ${focused.rank + 1}, ${focused.name ?? focused.label}, ${focused.scored} of ${total} cases, ${focused.gap}`
              : leader
                ? `${leader.name ?? leader.label} ${final ? 'wins' : 'leads'}`
                : ''}
          </p>
        </Panel>
      </Shell>
    </MotionConfig>
  )
}
