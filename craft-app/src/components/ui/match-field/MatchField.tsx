// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { Briefcase, Target } from 'lucide-react'
import { MotionConfig, motion, useReducedMotion } from 'motion/react'
import { useMemo, useState } from 'react'

import { cn } from '@/lib/utils'

import { Panel, Shell, ShellHeader } from '../surface'
import { MatchAvatar } from './match-field-parts'
import { CX, CY, EASE_OUT, H, R, W } from './match-field.constants'
import type { MatchFieldProps } from './match-field.types'
import {
  buildField,
  nextIndex,
  pct,
  placeItems,
  polar,
  radiusOf,
  round,
} from './match-field.utils'
import { useWidth } from './use-width'

/**
 * A polar fit field: sectors are categories, distance from the middle is how
 * well something matches. People, bots or documents sit in their category, and
 * the dashed rings show score levels, with the strong-fit zone tinted.
 */
export function MatchField({
  sectors,
  items,
  title,
  subtitle,
  rings = [0.5, 0.7, 0.85],
  threshold = rings.length ? Math.max(...rings) : 0.85,
  min = Math.max(0, Math.min(threshold, ...rings) - 0.15),
  icon: CenterIcon = Briefcase,
  onSelect,
  className,
}: MatchFieldProps) {
  const reduce = useReducedMotion()
  const [ref, width, measured] = useWidth()
  const [active, setActive] = useState<string | null>(null)
  const [fromKeyboard, setFromKeyboard] = useState(false)

  const n = Math.max(sectors.length, 1)
  const radius = (score: number) => radiusOf(score, min)
  const thresholdR = radius(threshold)

  const placed = useMemo(() => placeItems(sectors, items, min), [sectors, items, min])
  const field = useMemo(() => buildField(sectors, items), [sectors, items])

  const current = placed.find((item) => item.id === active) ?? null
  const strong = placed.filter((item) => item.score >= threshold)
  const best = placed.reduce<(typeof placed)[number] | null>(
    (top, item) => (!top || item.score > top.score ? item : top),
    null,
  )
  const levels = [...new Set([...rings, threshold])]

  const select = (id: string | null, keyboard: boolean) => {
    setFromKeyboard(keyboard)
    setActive(id)
    const item = placed.find((p) => p.id === id)
    if (item) onSelect?.(items.find((i) => i.id === item.id) ?? item)
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!placed.length) return
    if (event.key === 'Escape') return select(null, true)
    const next = nextIndex(
      event.key,
      placed.findIndex((item) => item.id === active),
      placed.length,
    )
    if (next === null) return
    event.preventDefault()
    select(placed[next].id, true)
  }

  const scale = width / W
  const left = (x: number) => `${(x / W) * 100}%`
  const top = (y: number) => `${(y / H) * 100}%`

  return (
    <MotionConfig reducedMotion="user">
      <Shell data-slot="match-field" className={cn('max-w-md', className)}>
        <ShellHeader
          icon={Target}
          title={title}
          subtitle={subtitle}
          aside={
            <span className="rounded-full bg-foreground/[0.06] px-2.5 py-1 text-xs text-muted-foreground tabular-nums">
              {strong.length} above {pct(threshold)}
            </span>
          }
        />
        <Panel className="px-3 py-4 @md:px-4">
          <div
            ref={ref}
            tabIndex={0}
            role="group"
            aria-label={`${title}. Use arrow keys to go through matches.`}
            onKeyDown={onKeyDown}
            onBlur={() => fromKeyboard && setActive(null)}
            onPointerLeave={() => select(null, false)}
            className="relative aspect-[440/380] w-full rounded-xl outline-offset-4"
          >
            <svg
              key={measured ? 'measured' : 'guess'}
              visibility={measured ? undefined : 'hidden'}
              viewBox={`0 0 ${W} ${H}`}
              role="img"
              aria-label={`${title}: ${strong.length} of ${placed.length} above ${pct(threshold)}${best ? `, best ${best.name} at ${pct(best.score)}` : ''}`}
              className="absolute inset-0 block size-full overflow-visible"
            >
              <circle cx={CX} cy={CY} r={R} fill="none" className="stroke-foreground/10" />
              <circle cx={CX} cy={CY} r={thresholdR} className="fill-foreground/[0.04]" />

              {field.map((row, ring) => (
                <motion.g
                  key={ring}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.3,
                    ease: EASE_OUT,
                    delay: reduce ? 0 : ring * 0.02,
                  }}
                >
                  {row.dots.map((dot, k) => (
                    <circle
                      key={k}
                      cx={dot.x}
                      cy={dot.y}
                      r={dot.size}
                      className={
                        !dot.on
                          ? 'fill-foreground/15'
                          : row.r <= thresholdR
                            ? 'fill-primary/75'
                            : 'fill-foreground/30'
                      }
                    />
                  ))}
                </motion.g>
              ))}

              {levels.map((score) => (
                <circle
                  key={score}
                  cx={CX}
                  cy={CY}
                  r={round(radius(score))}
                  fill="none"
                  strokeDasharray="3 4"
                  strokeWidth={1.25}
                  className={score === threshold ? 'stroke-primary/70' : 'stroke-foreground/25'}
                />
              ))}
            </svg>

            {sectors.map((label, s) => {
              const a = (s / n) * 2 * Math.PI - Math.PI / 2
              const [x, y] = polar(s / n, R + 14)
              const cos = round(Math.cos(a))
              return (
                <span
                  key={s}
                  className={cn(
                    'pointer-events-none absolute w-max max-w-24 text-xs text-balance transition-colors duration-150',
                    cos > 0.3 ? 'text-left' : cos < -0.3 ? 'text-right' : 'text-center',
                    current?.sector === s ? 'text-foreground' : 'text-muted-foreground',
                  )}
                  style={{
                    left: left(x),
                    top: top(y),
                    transform: `translate(${-50 + 50 * cos}%, ${-50 + 50 * round(Math.sin(a))}%)`,
                  }}
                >
                  {label}
                </span>
              )
            })}

            {levels.map((score) => {
              // On the sector gap nearest 7 o'clock, where no avatars sit.
              const gap = (Math.round(0.62 * sectors.length - 0.5) + 0.5) / sectors.length
              const [x, y] = polar(gap, radius(score))
              return (
                <span
                  key={score}
                  className={cn(
                    'pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-card px-1 font-mono text-[0.625rem] tabular-nums',
                    score === threshold ? 'font-medium text-foreground' : 'text-muted-foreground',
                  )}
                  style={{ left: left(x), top: top(y) }}
                >
                  {pct(score)}
                </span>
              )
            })}

            <div
              aria-hidden="true"
              className="pointer-events-none absolute flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground"
              style={{ left: '50%', top: '50%' }}
            >
              <CenterIcon fill="currentColor" fillOpacity={0.25} className="size-4" />
            </div>

            {placed.map((item, i) => {
              const on = item.id === active
              // Pill goes outward unless it would leave the chart, then inward.
              const pill = (item.name.length + 4) * 6.6 + 24
              const px = item.x * scale
              const right = item.x >= CX ? px + 22 + pill <= width + 12 : px - 22 - pill < -12
              const isStrong = item.score >= threshold
              return (
                <MatchAvatar
                  key={item.id}
                  item={item}
                  index={i}
                  active={on}
                  dim={active !== null && !on}
                  labeled={on || isStrong}
                  strong={isStrong}
                  right={right}
                  fromKeyboard={fromKeyboard}
                  reduce={reduce}
                  left={left(item.x)}
                  top={top(item.y)}
                  onSelect={() => select(item.id, false)}
                />
              )
            })}
          </div>

          <p role="status" aria-live="polite" className="sr-only">
            {fromKeyboard && current
              ? `${current.name}, ${sectors[current.sector]}, ${pct(current.score)} match`
              : ''}
          </p>
        </Panel>
      </Shell>
    </MotionConfig>
  )
}
