// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import {
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react'
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

import { CSS_EASE_OUT, NARROW, WIDE } from './eval-race.constants'
import type { EvalRaceLayout, EvalRacePosition } from './eval-race.types'
import { round, stadium, type Track } from './eval-race.utils'

function useWidth() {
  const ref = useRef<HTMLDivElement>(null)
  // null until measured, so the track draws once at its real size.
  const [width, setWidth] = useState<number | null>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    setWidth(el.getBoundingClientRect().width)
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return [ref, width ?? 400, width !== null] as const
}

type RowProps = {
  s: EvalRacePosition
  laps: number
  total: number
  perLap: number
  layout: EvalRaceLayout
  fastest: boolean
  formatTime: (s: number) => string
}

/** The cells of one standings row; the caller supplies the grid. */
function RaceRow({ s, laps, total, perLap, layout, fastest, formatTime }: RowProps) {
  const lead = s.rank === 0
  const lapped = s.behind >= perLap
  const time = (v: number | null, best = false, className?: string) => (
    <span
      className={cn(
        'text-right font-mono text-xs tabular-nums',
        best && fastest ? 'text-primary' : 'text-muted-foreground',
        className,
      )}
    >
      {v === null ? '–' : formatTime(v)}
    </span>
  )
  const bars = Array.from({ length: laps }, (_, k) => {
    const size = Math.min(perLap, total - k * perLap)
    const fill = Math.min(Math.max((s.scored - k * perLap) / size, 0), 1)
    const current = fill > 0 && fill < 1
    return (
      <span
        key={k}
        className="h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/[0.08]"
      >
        <span
          className={cn(
            'block h-full origin-left transition-transform duration-300',
            lead
              ? current
                ? 'bg-primary'
                : 'bg-primary/45'
              : current
                ? 'bg-foreground/60'
                : 'bg-foreground/25',
          )}
          style={{
            transform: `scaleX(${round(fill)})`,
            transitionTimingFunction: CSS_EASE_OUT,
          }}
        />
      </span>
    )
  })
  return (
    <>
      <span
        className={cn(
          'font-mono text-xs tabular-nums',
          lead ? 'text-primary' : 'text-muted-foreground',
        )}
      >
        P{s.rank + 1}
      </span>
      <span className="min-w-0">
        <span
          className={cn(
            'block truncate text-[0.8125rem]',
            lapped ? 'text-muted-foreground' : 'text-foreground',
          )}
        >
          {s.label}
        </span>
        <span className={cn('mt-1 flex gap-1', NARROW[layout])}>{bars}</span>
      </span>
      <span className={cn('gap-1', WIDE[layout])}>{bars}</span>
      <span
        className={cn(
          'truncate text-right font-mono text-xs tabular-nums',
          lead ? 'text-primary' : 'text-foreground',
        )}
      >
        {s.gap}
      </span>
      {layout === 'standings' && time(s.last, false, 'hidden @md:block')}
      {time(s.best, true)}
    </>
  )
}

type TrackViewProps = {
  standings: EvalRacePosition[]
  perLap: number
  active: string | null
  mini?: boolean
  label?: React.ReactNode
  onSelect?: (id: string | null) => void
  className?: string
}

function TrackView({
  standings,
  perLap,
  active,
  mini = false,
  label,
  onSelect,
  className,
}: TrackViewProps) {
  const id = useId()
  const [ref, width, measured] = useWidth()
  const marker = mini ? 4.5 : width < 360 ? 9 : 10
  const lane = mini ? 9 : width < 360 ? 20 : 24
  const pad = Math.max(marker, lane / 2) + 2
  const height = Math.round(
    mini ? width * 0.5 : Math.min(Math.max(width * 0.4, 150), 216),
  )
  const track = stadium(width, height, pad)
  const inner = track.r - lane / 2 - 4

  // Finished racers queue up past the line in finishing order.
  const spacing = ((marker * 2 + 3) / track.perimeter) * perLap
  const finished = standings.filter((s) => s.done).length

  const ticks = mini
    ? []
    : Array.from({ length: 19 }, (_, k) => {
        const f = (k + 1) / 20
        const long = (k + 1) % 5 === 0
        const [x1, y1] = track.at(f, inner + 2)
        const [x2, y2] = track.at(f, inner + 2 - (long ? 6 : 3))
        return { k, long, x1, y1, x2, y2 }
      })

  const [lx, ly] = track.at(0)
  const sq = lane / 4

  return (
    <div ref={ref} data-slot="eval-race-track" className={cn('relative', className)}>
      <svg
        key={measured ? 'measured' : 'guess'}
        visibility={measured ? undefined : 'hidden'}
        aria-hidden="true"
        width={width}
        height={height}
        className="block overflow-visible"
      >
        {!mini && (
          <defs>
            <pattern
              id={`${id}-grain`}
              width={8}
              height={8}
              patternUnits="userSpaceOnUse"
            >
              <circle cx={4} cy={4} r={0.75} className="fill-foreground/[0.12]" />
            </pattern>
          </defs>
        )}
        {!mini && inner > 0 && <path d={track.path(inner)} fill={`url(#${id}-grain)`} />}
        <path
          d={track.path()}
          fill="none"
          strokeWidth={lane}
          className="stroke-foreground/[0.06]"
        />
        {!mini && (
          <path
            d={track.path()}
            fill="none"
            strokeDasharray="2 6"
            className="stroke-foreground/15"
          />
        )}
        {ticks.map((t) => (
          <line
            key={t.k}
            x1={round(t.x1)}
            y1={round(t.y1)}
            x2={round(t.x2)}
            y2={round(t.y2)}
            className={t.long ? 'stroke-foreground/25' : 'stroke-foreground/[0.12]'}
          />
        ))}

        {/* Start / finish: a two-column checker across the lane. */}
        <g>
          {Array.from({ length: 8 }, (_, k) => {
            const col = k % 2
            const row = Math.floor(k / 2)
            if ((row + col) % 2) return null
            return (
              <rect
                key={k}
                x={round(lx - sq + col * sq)}
                y={round(ly - lane / 2 + row * sq)}
                width={round(sq)}
                height={round(sq)}
                className="fill-foreground/70"
              />
            )
          })}
        </g>

        {/* Two passes, so streaks never paint over another marker. */}
        {(['trail', 'disc'] as const).flatMap((part) =>
          [...standings]
            .reverse()
            .map((s) => (
              <Marker
                key={`${part}-${s.id}`}
                part={part}
                track={track}
                laps={
                  s.scored / perLap +
                  (s.done ? ((finished - s.rank) * spacing) / perLap : 0)
                }
                rank={s.rank}
                lead={s.rank === 0}
                lapped={s.behind >= perLap}
                dim={active !== null && active !== s.id}
                mini={mini}
                r={marker}
                lane={lane}
                onPointerEnter={onSelect && (() => onSelect(s.id))}
                onPointerLeave={onSelect && (() => onSelect(null))}
              />
            )),
        )}
      </svg>
      {label && measured && (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 flex flex-col items-center justify-center text-center"
          style={{ height }}
        >
          {label}
        </div>
      )}
    </div>
  )
}

type MarkerProps = {
  part: 'trail' | 'disc'
  track: Track
  laps: number
  rank: number
  lead: boolean
  lapped: boolean
  dim: boolean
  mini: boolean
  r: number
  lane: number
  onPointerEnter?: () => void
  onPointerLeave?: () => void
}

function Marker({
  part,
  track,
  laps,
  rank,
  lead,
  lapped,
  dim,
  mini,
  r,
  lane,
  onPointerEnter,
  onPointerLeave,
}: MarkerProps) {
  const reduce = useReducedMotion()
  // Scores land in steps; a critically damped spring turns them into a glide.
  const pos = useSpring(laps, { stiffness: 70, damping: 18, restDelta: 0.0002 })
  useEffect(() => {
    if (reduce) pos.jump(laps)
    else pos.set(laps)
  }, [laps, pos, reduce])

  const velocity = useVelocity(pos)
  // Each new score kicks the spring, so raw velocity pulses every update; a
  // slow, overdamped spring turns it into a steady speed for the streak.
  const speed = useSpring(velocity, { stiffness: 24, damping: 14, restDelta: 0.0001 })
  const x = useTransform(pos, (v) => round(track.at(v)[0]))
  const y = useTransform(pos, (v) => round(track.at(v)[1]))
  // A streak behind each marker, as long as it is fast.
  const tail = useTransform(speed, (v) => Math.min(Math.max(v * 0.22, 0), 0.08))
  const dash = useTransform(tail, (t) => `${t.toFixed(4)} ${(1 - t).toFixed(4)}`)
  const offset = useTransform(() => -(pos.get() - tail.get()))
  // Fades with its length instead of popping off at rest.
  const streak = useTransform(tail, (t) => Math.min(t / 0.02, 1))

  if (part === 'trail') {
    if (mini || reduce) return null
    return (
      <motion.path
        d={track.path()}
        pathLength={1}
        fill="none"
        strokeWidth={lane * 0.3}
        strokeLinecap="round"
        className={cn(
          'transition-[stroke] duration-200',
          dim
            ? 'stroke-foreground/[0.06]'
            : lead
              ? 'stroke-primary/50'
              : 'stroke-foreground/15',
        )}
        style={{ strokeDasharray: dash, strokeDashoffset: offset, opacity: streak }}
      />
    )
  }

  return (
    <g onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave}>
      <motion.g style={{ x, y }}>
        <circle
          r={r}
          className={cn(
            'transition-[fill] duration-200',
            // Dimmed markers stay opaque so the track never shows through.
            dim
              ? 'fill-card'
              : lead
                ? 'fill-primary'
                : lapped
                  ? 'fill-muted-foreground'
                  : 'fill-foreground',
          )}
        />
        {!mini && (
          <text
            textAnchor="middle"
            dy="0.35em"
            fontSize={r > 9 ? 11 : 10}
            className={cn(
              'font-mono font-medium',
              dim
                ? 'fill-muted-foreground'
                : lead
                  ? 'fill-primary-foreground'
                  : 'fill-background',
            )}
          >
            {rank + 1}
          </text>
        )}
      </motion.g>
    </g>
  )
}

export { RaceRow, TrackView }
