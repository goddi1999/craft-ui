// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { AnimatePresence, motion } from 'motion/react'

import { cn } from '@/lib/utils'

import { EASE_OUT_CLASS, ENTER } from './lap-timer.constants'
import type { LapSector, SectorArc } from './lap-timer.types'
import { arc, polar, round, signed } from './lap-timer.utils'

type DialProps = {
  label: string
  size: number
  measured: boolean
  /** Seconds per turn. */
  turn: number
  /** Numbers around the face. */
  count: number
  best: number
  /** Hand angle in degrees. */
  hand: number
  started: boolean
  arcs: SectorArc[]
  hover: string | null
  /** Progress of the sub-dial, 0 to 1 (more than 1 when over the best split). */
  subFrac: number
  subLabel: string
  /** True while a sector runs. */
  hasCurrent: boolean
  ring: number
  R: number
}

/** The stopwatch face: sector arcs, best-lap notch, ticks, sub-dial and hand. */
export function LapDial({
  label,
  size,
  measured,
  turn,
  count,
  best,
  hand,
  started,
  arcs,
  hover,
  subFrac,
  subLabel,
  hasCurrent,
  ring,
  R,
}: DialProps) {
  const c = size / 2
  const tickOut = R - ring - 5
  const numR = tickOut - 20
  const sub = { x: c, y: round(c - R * 0.36), r: round(R * 0.2) }
  const deg = (t: number) => (t / turn) * 360
  const labelOf = (v: number) => (turn >= 300 && v % 60 === 0 ? `${v / 60}m` : `${v}`)
  const ticks = Array.from({ length: 60 }, (_, i) => i)

  return (
    <svg
      key={measured ? 'measured' : 'guess'}
      visibility={measured ? undefined : 'hidden'}
      role="img"
      aria-label={label}
      width={size}
      height={size}
      className="block"
    >
      {/* Sector track */}
      <circle
        cx={c}
        cy={c}
        r={R - ring / 2}
        fill="none"
        strokeWidth={ring}
        className="stroke-foreground/[0.07]"
      />
      {arcs.map((a) => (
        <path
          key={a.id}
          d={a.d}
          fill="none"
          strokeWidth={ring}
          strokeLinecap="round"
          className={cn(
            `transition-[stroke,opacity] duration-200 ${EASE_OUT_CLASS}`,
            a.state === 'live'
              ? 'stroke-primary'
              : a.state === 'faster'
                ? 'stroke-(--positive)'
                : 'stroke-foreground/35',
            hover && hover !== a.id && 'opacity-30',
          )}
        />
      ))}

      {/* Best lap: a notch outside the track */}
      {best > 0 && best < turn && (
        <path
          d={(() => {
            const a = deg(best)
            const w = (4 / (R + 8)) * (180 / Math.PI)
            const [x0, y0] = polar(a, R + 1, c, c)
            const [x1, y1] = polar(a - w, R + 8, c, c)
            const [x2, y2] = polar(a + w, R + 8, c, c)
            return `M${x0} ${y0}L${x1} ${y1}L${x2} ${y2}Z`
          })()}
          strokeLinejoin="round"
          strokeWidth={1}
          className="fill-foreground stroke-foreground"
        />
      )}

      {/* Face: ticks light up as the hand passes */}
      {ticks.map((i) => {
        const major = i % (60 / count) === 0
        const a = i * 6
        const [x1, y1] = polar(a, tickOut, c, c)
        const [x2, y2] = polar(a, tickOut - (major ? 8 : 4), c, c)
        const lit = started && a <= hand
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            strokeWidth={major ? 1.5 : 1}
            strokeLinecap="round"
            className={
              major
                ? lit
                  ? 'stroke-foreground/80'
                  : 'stroke-foreground/35'
                : lit
                  ? 'stroke-foreground/45'
                  : 'stroke-foreground/15'
            }
          />
        )
      })}
      {Array.from({ length: count }, (_, k) => {
        const v = ((k + 1) * turn) / count
        const [x, y] = polar((360 * (k + 1)) / count, numR, c, c)
        return (
          <text
            key={k}
            x={x}
            y={y}
            dy="0.35em"
            textAnchor="middle"
            fontSize={size < 220 ? 10 : 11}
            className="fill-muted-foreground font-mono tabular-nums"
          >
            {labelOf(v)}
          </text>
        )
      })}

      {/* Sub-dial: the running sector against its best split */}
      <circle cx={sub.x} cy={sub.y} r={sub.r} className="fill-foreground/[0.05]" />
      <circle
        cx={sub.x}
        cy={sub.y}
        r={sub.r - 3}
        fill="none"
        strokeWidth={2}
        className="stroke-foreground/10"
      />
      {subFrac > 0 && (
        <path
          d={arc(0, Math.min(subFrac, 1) * 360, sub.r - 3, sub.x, sub.y)}
          fill="none"
          strokeWidth={2}
          strokeLinecap="round"
          className={
            subFrac > 1
              ? 'stroke-foreground/40'
              : hasCurrent
                ? 'stroke-primary'
                : 'stroke-(--positive)'
          }
        />
      )}
      <text
        x={sub.x}
        y={sub.y}
        dy="0.35em"
        textAnchor="middle"
        fontSize={size < 220 ? 9 : 10}
        className="fill-foreground font-mono font-medium tracking-wide"
      >
        {subLabel}
      </text>

      {/* Hand */}
      <g transform={`rotate(${round(hand)} ${c} ${c})`}>
        <line
          x1={c}
          y1={round(c + 16)}
          x2={c}
          y2={round(c - (R - ring - 4))}
          strokeWidth={1.75}
          strokeLinecap="round"
          className="stroke-foreground"
        />
        <circle cx={c} cy={round(c + 16)} r={3} className="fill-foreground" />
      </g>
      <circle cx={c} cy={c} r={6} className="fill-primary" />
      <circle cx={c} cy={c} r={2} className="fill-card" />
    </svg>
  )
}

type TableProps = {
  sectors: LapSector[]
  currentIndex: number
  inSector: number
  hover: string | null
  onHover: (id: string | null) => void
  format: (seconds: number) => string
}

/** One row per sector: colour key, name, split and delta against best. */
export function SectorTable({
  sectors,
  currentIndex,
  inSector,
  hover,
  onHover,
  format,
}: TableProps) {
  return (
    <table className="mt-5 w-full text-[0.8125rem]">
      <caption className="sr-only">Sector splits against best</caption>
      <thead className="sr-only">
        <tr>
          <th scope="col">Sector</th>
          <th scope="col">Split</th>
          <th scope="col">Delta vs best</th>
        </tr>
      </thead>
      <tbody>
        {sectors.map((s, i) => {
          const isLive = i === currentIndex
          const has = s.split !== undefined
          const faster = has && (s.split ?? 0) < s.best
          return (
            <tr
              key={s.id}
              onPointerEnter={() => has && onHover(s.id)}
              onPointerLeave={() => onHover(null)}
              className={cn(
                `h-10 transition-opacity duration-200 ${EASE_OUT_CLASS}`,
                hover && hover !== s.id && 'opacity-50',
              )}
            >
              <th scope="row" className="pr-3 text-left font-normal">
                <span className="flex items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className={cn(
                      'h-1 w-3.5 shrink-0 rounded-full transition-colors duration-200',
                      isLive
                        ? 'bg-primary'
                        : !has
                          ? 'bg-foreground/10'
                          : faster
                            ? 'bg-(--positive)'
                            : 'bg-foreground/35',
                    )}
                  />
                  <span className="font-mono text-muted-foreground tabular-nums">
                    S{i + 1}
                  </span>
                  <span
                    className={cn('truncate', !has && !isLive && 'text-muted-foreground')}
                  >
                    {s.label}
                  </span>
                </span>
              </th>
              <td
                className={cn(
                  'w-20 text-right font-mono tabular-nums',
                  !has && 'text-muted-foreground',
                )}
              >
                {has ? format(s.split ?? 0) : isLive ? format(inSector) : '—'}
              </td>
              <td className="w-16 text-right font-mono tabular-nums">
                <AnimatePresence initial={false}>
                  {has && (
                    <motion.span
                      key="delta"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={ENTER}
                      className={cn(
                        'inline-block',
                        faster ? 'text-(--positive)' : 'text-muted-foreground',
                      )}
                    >
                      {signed((s.split ?? 0) - s.best)}
                    </motion.span>
                  )}
                </AnimatePresence>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
