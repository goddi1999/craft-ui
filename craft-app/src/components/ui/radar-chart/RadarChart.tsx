// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { Radar } from 'lucide-react'
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'motion/react'
import { useId, useState } from 'react'

import { cn } from '@/lib/utils'

import { Panel, Shell, ShellHeader } from '../surface'
import { RadarDataTable, RadarLegend, RadarTooltip } from './radar-chart-parts'
import { EASE_OUT, GAP, LINE, PALETTE, SERIES_COLOR } from './radar-chart.constants'
import type { RadarChartProps } from './radar-chart.types'
import { axisAngles, layoutRadar, nextAxis, round } from './radar-chart.utils'
import { useWidth } from './use-width'

/**
 * A polygon over a handful of axes on a fixed scale. One filled series, an
 * optional dashed bar to beat, and every member as a dot on each spoke — so
 * the average and the spread read at once.
 */
export function RadarChart({
  axes,
  max,
  series,
  baseline,
  members = [],
  title,
  subtitle,
  headline,
  format = (v) => v.toFixed(1),
  onSelect,
  className,
}: RadarChartProps) {
  const reduce = useReducedMotion()
  const id = useId()
  const [ref, width, measured] = useWidth()
  const [active, setActive] = useState<number | null>(null)
  const [fromKeyboard, setFromKeyboard] = useState(false)

  const n = axes.length
  const brand = series.color ?? SERIES_COLOR
  const people = members.map((m, i) => ({
    ...m,
    color: m.color ?? PALETTE[i % PALETTE.length],
  }))
  const angles = axisAngles(n)
  const values = axes.map((_, i) => format(series.values[i] ?? 0))
  const { R, stacked, lines, wrapped, height, cx, cy } = layoutRadar(
    axes,
    values,
    angles,
    width,
  )

  const at = (i: number, r: number) =>
    [round(cx + r * angles[i].dx), round(cy + r * angles[i].dy)] as const
  const scale = (v: number) => (Math.min(Math.max(v, 0), max) / max) * R
  const shape = (vals: number[], k = 1) =>
    axes
      .map((_, i) => {
        const [x, y] = at(i, scale(vals[i] ?? 0) * k)
        return `${i ? 'L' : 'M'}${x} ${y}`
      })
      .join('') + 'Z'
  const ring = (r: number) => shape(axes.map(() => r))

  const steps = Number.isInteger(max) && max <= 10 ? max : 4
  const rings = Array.from({ length: steps }, (_, k) => ((k + 1) / steps) * max)

  // Members on the same value sit side by side across the spoke.
  const dots = axes.flatMap((_, i) => {
    const groups = new Map<number, typeof people>()
    for (const m of people) {
      const v = m.values[i] ?? 0
      groups.set(v, [...(groups.get(v) ?? []), m])
    }
    return [...groups].flatMap(([v, group]) =>
      group.map((m, k) => {
        const [x, y] = at(i, scale(v))
        const off = (k - (group.length - 1) / 2) * 7
        return {
          key: `${m.id}-${i}`,
          axis: i,
          color: m.color,
          x: round(x - angles[i].dy * off),
          y: round(y + angles[i].dx * off),
        }
      }),
    )
  })

  const select = (index: number | null, keyboard: boolean) => {
    setFromKeyboard(keyboard)
    setActive(index)
    if (index !== null) onSelect?.(index)
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!n) return
    if (event.key === 'Escape') return select(null, true)
    const next = nextAxis(event.key, active, n)
    if (next === null) return
    event.preventDefault()
    select(next, true)
  }

  // An invisible wedge per axis, so hover works anywhere in its slice.
  const wedge = (i: number) => {
    const far = R + GAP + 160
    const half = Math.PI / Math.max(n, 1)
    const a = (i / Math.max(n, 1)) * 2 * Math.PI
    const p = (t: number) =>
      `${round(cx + far * Math.sin(t))} ${round(cy - far * Math.cos(t))}`
    return `M${cx} ${cy}L${p(a - half)}L${p(a)}L${p(a + half)}Z`
  }

  const best = axes.length
    ? axes[series.values.indexOf(Math.max(...series.values.slice(0, n)))]
    : ''
  const tip = active === null ? null : at(active, scale(series.values[active] ?? 0))
  const memberLine = (i: number) =>
    people.map((m) => `${m.label} ${format(m.values[i] ?? 0)}`).join(' · ')

  return (
    <MotionConfig reducedMotion="user">
      <Shell data-slot="radar-chart" className={cn('max-w-xl', className)}>
        <ShellHeader
          icon={Radar}
          title={title}
          subtitle={subtitle}
          aside={
            headline && (
              <p className="flex items-baseline gap-1.5">
                <span className="text-xl font-medium tracking-tight tabular-nums">
                  {headline.value}
                </span>
                {headline.caption && (
                  <span className="text-xs text-muted-foreground">{headline.caption}</span>
                )}
              </p>
            )
          }
        />
        <Panel className="p-3 @md:p-4">
          <div
            ref={ref}
            tabIndex={0}
            role="group"
            aria-label={`${title}. Use arrow keys to read each axis.`}
            onKeyDown={onKeyDown}
            onBlur={() => fromKeyboard && setActive(null)}
            className="relative rounded-xl outline-offset-4"
          >
            <svg
              key={measured ? 'measured' : 'guess'}
              visibility={measured ? undefined : 'hidden'}
              role="img"
              aria-label={`${title}: ${series.label} ${axes.map((a, i) => `${a} ${values[i]}`).join(', ')}. Strongest on ${best}.`}
              width={width}
              height={height}
              className="block overflow-visible"
              onPointerLeave={() => select(null, false)}
            >
              <defs>
                <pattern
                  id={`${id}-grain`}
                  width={8}
                  height={8}
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx={4} cy={4} r={0.75} className="fill-foreground/15" />
                </pattern>
              </defs>

              <path d={ring(max)} fill={`url(#${id}-grain)`} />
              {rings.map((r) => (
                <path
                  key={r}
                  d={ring(r)}
                  fill="none"
                  className="stroke-foreground/10"
                  strokeLinejoin="round"
                />
              ))}
              {axes.map((_, i) => {
                const [x, y] = at(i, R)
                return (
                  <line
                    key={i}
                    x1={cx}
                    y1={cy}
                    x2={x}
                    y2={y}
                    className={cn(
                      'transition-[stroke] duration-150',
                      active === i ? 'stroke-foreground/30' : 'stroke-foreground/10',
                      fromKeyboard && 'duration-0',
                    )}
                  />
                )
              })}

              {baseline && (
                <path
                  d={shape(baseline.values)}
                  fill="none"
                  className="stroke-foreground/45"
                  strokeWidth={1.25}
                  strokeDasharray="4 4"
                  strokeLinejoin="round"
                />
              )}

              <motion.path
                initial={{ d: shape(series.values, 0.9), opacity: 0 }}
                animate={{ d: shape(series.values), opacity: 1 }}
                transition={{ duration: 0.3, ease: EASE_OUT }}
                style={{ fill: brand, stroke: brand }}
                fillOpacity={0.2}
                strokeWidth={1.75}
                strokeLinejoin="round"
              />

              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25, ease: EASE_OUT, delay: reduce ? 0 : 0.15 }}
              >
                {dots.map((d) => (
                  <circle
                    key={d.key}
                    cx={d.x}
                    cy={d.y}
                    r={3}
                    style={{ fill: d.color }}
                    className={cn(
                      'transition-opacity duration-150',
                      active !== null && active !== d.axis && 'opacity-35',
                      fromKeyboard && 'duration-0',
                    )}
                  />
                ))}
                {axes.map((_, i) => {
                  const [x, y] = at(i, scale(series.values[i] ?? 0))
                  return active === i ? (
                    <circle key={i} cx={x} cy={y} r={5} className="fill-foreground" />
                  ) : (
                    <circle key={i} cx={x} cy={y} r={3.5} style={{ fill: brand }} />
                  )
                })}
              </motion.g>

              {axes.map((label, i) => {
                const { dx, dy } = angles[i]
                const [x, y] = at(i, R + GAP)
                const middle = Math.abs(dx) < 0.15
                const anchor = middle ? 'middle' : dx > 0 ? 'start' : 'end'
                // Top labels grow upward, bottom ones downward, side ones center.
                const first = middle
                  ? dy < 0
                    ? -(lines[i] - 1) * LINE
                    : LINE * 0.5
                  : (-(lines[i] - 1) * LINE) / 2
                const on = active === i
                return (
                  <text
                    key={i}
                    x={x}
                    y={round(y + first)}
                    dy={middle && dy < 0 ? 0 : '0.32em'}
                    textAnchor={anchor}
                    fontSize="12"
                    className={cn(
                      'transition-[fill] duration-150',
                      on ? 'fill-foreground' : 'fill-muted-foreground',
                      fromKeyboard && 'duration-0',
                    )}
                  >
                    {stacked
                      ? wrapped[i].map((line, k) => (
                          <tspan key={k} x={x} dy={k ? LINE : undefined}>
                            {line}
                          </tspan>
                        ))
                      : label}
                    <tspan
                      {...(stacked ? { x, dy: LINE } : { dx: 4 })}
                      className={cn(
                        'font-mono tabular-nums',
                        on ? 'fill-foreground' : 'fill-muted-foreground',
                      )}
                    >
                      {values[i]}
                    </tspan>
                  </text>
                )
              })}

              {axes.map((_, i) => (
                <path
                  key={i}
                  d={wedge(i)}
                  fill="transparent"
                  onPointerEnter={() => select(i, false)}
                />
              ))}
            </svg>

            <AnimatePresence>
              {active !== null && tip && (
                <RadarTooltip
                  axis={axes[active]}
                  value={values[active]}
                  tip={tip}
                  cy={cy}
                  width={width}
                  height={height}
                  fromKeyboard={fromKeyboard}
                  members={people}
                  memberLine={memberLine(active)}
                  baseline={baseline}
                  baselineValue={format(baseline?.values[active] ?? 0)}
                />
              )}
            </AnimatePresence>
          </div>

          <RadarLegend series={series} color={brand} baseline={baseline} members={people} />
          <RadarDataTable
            title={title}
            axes={axes}
            series={series}
            values={values}
            baseline={baseline}
            members={people}
            format={format}
          />
          <p role="status" aria-live="polite" className="sr-only">
            {fromKeyboard && active !== null
              ? [
                  `${axes[active]}: ${series.label} ${values[active]}`,
                  baseline && `${baseline.label} ${format(baseline.values[active] ?? 0)}`,
                  ...people.map(
                    (m) => `${m.name ?? m.label} ${format(m.values[active] ?? 0)}`,
                  ),
                ]
                  .filter(Boolean)
                  .join(', ')
              : ''}
          </p>
        </Panel>
      </Shell>
    </MotionConfig>
  )
}
