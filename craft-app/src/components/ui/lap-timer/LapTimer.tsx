// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { Timer } from 'lucide-react'
import { MotionConfig } from 'motion/react'
import { useState } from 'react'

import { cn } from '@/lib/utils'

import { Panel, Shell, ShellHeader } from '../surface'
import { DIALS, MAX_DIAL, TONE_TOKENS } from './lap-timer.constants'
import { useWidth } from './lap-timer.hooks'
import { LapDial, SectorTable } from './lap-timer-parts'
import type { LapTimerProps, SectorArc } from './lap-timer.types'
import { arc, clock, signed, sum } from './lap-timer.utils'

/**
 * A run as a stopwatch. The hand sweeps the dial while each stage paints its
 * sector — green when it beat its best split, grey when it didn't — and the
 * clock carries the live delta against the best lap.
 */
export function LapTimer({
  sectors,
  elapsed,
  best: bestLap,
  running = true,
  dial: dialProp,
  title,
  subtitle,
  lap,
  aside,
  format = (s) => `${s.toFixed(1)} s`,
  className,
}: LapTimerProps) {
  const [ref, width, measured] = useWidth()
  const [hover, setHover] = useState<string | null>(null)

  const best = bestLap ?? sum(sectors.map((s) => s.best))
  const done = sectors.filter((s) => s.split !== undefined).length
  const currentIndex = running && done < sectors.length ? done : -1
  const doneTime = sum(sectors.slice(0, done).map((s) => s.split ?? 0))
  const finished = !running && done === sectors.length && sectors.length > 0
  const now = finished ? doneTime : Math.max(elapsed, doneTime)
  const inSector = now - doneTime

  // Live delta: what's lost or gained in finished sectors, plus any overrun
  // in the running one. Ahead of pace never shows until a sector closes.
  const current = currentIndex >= 0 ? sectors[currentIndex] : undefined
  const delta =
    sum(sectors.slice(0, done).map((s) => (s.split ?? 0) - s.best)) +
    (current ? Math.max(0, inSector - current.best) : 0)
  const started = now > 0
  const ahead = delta < -0.05

  const turn = dialProp ?? DIALS.find((d) => d >= Math.max(best, now) * 1.04) ?? 3600
  // Numbers around the face: the most that land on whole values.
  const count = [12, 6, 5, 4, 3, 2].find((n) => Number.isInteger(turn / n)) ?? 4

  // Geometry
  const size = Math.max(160, Math.min(MAX_DIAL, Math.floor(width)))
  const c = size / 2
  const ring = 5
  const R = c - 10

  const deg = (t: number) => (t / turn) * 360

  // One arc per started sector; a small gap keeps neighbours apart.
  const arcs = sectors.flatMap<SectorArc>((s, i) => {
    const start = sum(sectors.slice(0, i).map((x) => x.split ?? 0))
    const length = s.split ?? (i === currentIndex ? inSector : 0)
    if (length <= 0) return []
    const a0 = deg(start)
    const a1 = deg(start + length)
    const gap = s.split !== undefined && a1 - a0 > 4 ? 1.2 : 0
    const state = s.split === undefined ? 'live' : s.split < s.best ? 'faster' : 'slower'
    return [{ id: s.id, d: arc(a0 + (i ? gap : 0), a1 - gap, R - ring / 2, c, c), state }]
  })

  const subFrac = current
    ? inSector / Math.max(current.best, 0.001)
    : started
      ? now / Math.max(best, 0.001)
      : 0
  const subLabel = current ? `S${currentIndex + 1}` : 'LAP'
  const last = done > 0 ? sectors[done - 1] : undefined

  return (
    <MotionConfig reducedMotion="user">
      <Shell data-slot="lap-timer" className={cn('max-w-md', TONE_TOKENS, className)}>
        <ShellHeader icon={Timer} title={title} subtitle={subtitle} aside={aside} />
        <Panel className="p-4 @sm:p-5">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <p
              className="font-mono text-[2rem] leading-none font-medium tracking-tight tabular-nums"
              aria-label={`Elapsed ${clock(now)}`}
            >
              {clock(now)}
            </p>
            {started && (
              <p
                className={cn(
                  'font-mono text-[0.8125rem] tabular-nums transition-colors duration-200',
                  ahead ? 'text-(--positive)' : 'text-muted-foreground',
                )}
              >
                {done === 0 && delta <= 0 ? 'on pace' : `${signed(delta)} s vs best lap`}
              </p>
            )}
          </div>
          <div className="mt-2 flex items-center justify-between gap-3 text-[0.8125rem] text-muted-foreground">
            <span className="truncate">
              {[lap, `${done} of ${sectors.length} sectors`].filter(Boolean).join(' · ')}
            </span>
            <span className="flex shrink-0 items-center gap-1.5 font-mono tabular-nums">
              <svg aria-hidden="true" width={8} height={6} className="fill-foreground">
                <path d="M4 6L0 0H8Z" />
              </svg>
              best {format(best)}
            </span>
          </div>

          <div ref={ref} className="mt-4 flex justify-center">
            <LapDial
              label={`${title}: ${clock(now)} elapsed, ${signed(delta)} seconds against the best lap of ${format(best)}.`}
              size={size}
              measured={measured}
              turn={turn}
              count={count}
              best={best}
              hand={deg(now)}
              started={started}
              arcs={arcs}
              hover={hover}
              subFrac={subFrac}
              subLabel={subLabel}
              hasCurrent={!!current}
              ring={ring}
              R={R}
            />
          </div>

          <SectorTable
            sectors={sectors}
            currentIndex={currentIndex}
            inSector={inSector}
            hover={hover}
            onHover={setHover}
            format={format}
          />

          <p role="status" aria-live="polite" className="sr-only">
            {last && last.split !== undefined
              ? `${last.label} split ${format(last.split)}, ${signed(last.split - last.best)} seconds against best.${finished ? ` Lap ${clock(now)}.` : ''}`
              : ''}
          </p>
        </Panel>
      </Shell>
    </MotionConfig>
  )
}
