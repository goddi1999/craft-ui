// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { Waypoints } from 'lucide-react'
import { MotionConfig, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'

import { cn } from '@/lib/utils'

import { Panel, Shell, ShellHeader } from '../surface'
import { BlastLegend, BlastTooltip, fadeClass } from './blast-radius-parts'
import { C, CENTER_R, EASE_OUT, NEGATIVE_TONE, PALETTE, SIZE } from './blast-radius.constants'
import type { BlastKind, BlastRadiusProps, Placed } from './blast-radius.types'
import { hops, layoutNodes, polar } from './blast-radius.utils'

/**
 * What one entity can reach, drawn as rings of hops around it. An affected
 * set (what a leaked key or a risky tool call can touch) is traced in red
 * back to the centre, so the size of the blast is visible at a glance.
 */
export function BlastRadius({
  center,
  nodes,
  kinds = {},
  title,
  subtitle,
  aside,
  onSelect,
  className,
}: BlastRadiusProps) {
  const reduce = useReducedMotion()
  const [active, setActive] = useState<number | null>(null)
  const [fromKeyboard, setFromKeyboard] = useState(false)

  const { placed, maxDepth, radius, gap } = layoutNodes(nodes)
  const n = placed.length
  const affected = placed.filter((p) => p.affected).length

  const used = [...new Set(placed.map((p) => p.kind))]
  const kindOf = (kind: string): BlastKind =>
    kinds[kind] ?? {
      label: kind.charAt(0).toUpperCase() + kind.slice(1),
      color: PALETTE[used.indexOf(kind) % PALETTE.length],
    }
  const legend = [
    ...Object.keys(kinds).filter((k) => used.includes(k)),
    ...used.filter((k) => !(k in kinds)),
  ]

  const current = active === null ? undefined : placed[active]
  const onPath = new Set(current?.path ?? [])
  const nodeR = (depth: number) => (depth === 1 ? 9 : 6.5)

  const select = (index: number | null, keyboard: boolean) => {
    setFromKeyboard(keyboard)
    setActive(index)
    if (index !== null) onSelect?.(placed[index])
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!n) return
    const keys: Record<string, number> = {
      ArrowRight: (active ?? -1) + 1,
      ArrowDown: (active ?? -1) + 1,
      ArrowLeft: (active ?? n) - 1,
      ArrowUp: (active ?? n) - 1,
      Home: 0,
      End: n - 1,
    }
    if (event.key === 'Escape') return select(null, true)
    if (!(event.key in keys)) return
    event.preventDefault()
    select((keys[event.key] + n) % n, true)
  }

  // Ring by ring, then clockwise within a ring.
  const delay = (p: Placed, i: number) =>
    reduce ? 0 : (p.depth - 1) * 0.12 + Math.min(i * 0.012, 0.12)
  const fade = fadeClass(fromKeyboard)
  const CenterIcon = center.icon

  return (
    <MotionConfig reducedMotion="user">
      <Shell data-slot="blast-radius" className={cn('max-w-md', NEGATIVE_TONE, className)}>
        <ShellHeader icon={Waypoints} title={title} subtitle={subtitle} aside={aside} />
        <Panel className="p-4">
          <div
            tabIndex={0}
            role="group"
            aria-label={`${title}. Use arrow keys to read each node.`}
            onKeyDown={onKeyDown}
            onBlur={() => fromKeyboard && setActive(null)}
            className="relative mx-auto w-full max-w-80 rounded-full outline-offset-4"
          >
            <svg
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              role="img"
              aria-label={`${title}: ${affected} of ${n} reachable from ${center.label} affected`}
              className="block w-full overflow-visible"
              onPointerLeave={() => select(null, false)}
            >
              {Array.from({ length: maxDepth }, (_, d) => {
                const r = radius(d + 1)
                const [tx, ty] = polar(gap, r)
                return (
                  <motion.g
                    key={d}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.3,
                      ease: EASE_OUT,
                      delay: reduce ? 0 : d * 0.12,
                    }}
                  >
                    <circle
                      cx={C}
                      cy={C}
                      r={r}
                      fill="none"
                      strokeDasharray="2 4"
                      className="stroke-foreground/15"
                    />
                    <text
                      x={tx}
                      y={ty}
                      dy="0.32em"
                      textAnchor="middle"
                      fontSize="11"
                      strokeWidth={5}
                      paintOrder="stroke"
                      className="fill-muted-foreground stroke-card"
                    >
                      {hops(d + 1)}
                    </text>
                  </motion.g>
                )
              })}

              {placed.map((p, i) => {
                const lit = onPath.has(p.id)
                return (
                  <motion.g
                    key={`edge-${p.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, ease: EASE_OUT, delay: delay(p, i) }}
                  >
                    <line
                      x1={p.px}
                      y1={p.py}
                      x2={p.x}
                      y2={p.y}
                      strokeWidth={p.reach ? (p.depth === 1 ? 1.75 : 1.25) : 1}
                      strokeDasharray={p.indirect ? '3 3' : undefined}
                      className={cn(
                        fade,
                        '[transition-property:opacity,stroke]',
                        p.reach
                          ? 'stroke-(--tone)'
                          : lit
                            ? 'stroke-foreground/60'
                            : 'stroke-foreground/15',
                        current && !lit && 'opacity-25',
                      )}
                    />
                  </motion.g>
                )
              })}

              <motion.g
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: EASE_OUT }}
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              >
                {affected > 0 && (
                  <circle
                    cx={C}
                    cy={C}
                    r={CENTER_R + 4}
                    fill="none"
                    strokeWidth={1.75}
                    className="stroke-(--tone)"
                  />
                )}
                <circle cx={C} cy={C} r={CENTER_R} className="fill-primary" />
                {CenterIcon ? (
                  <CenterIcon
                    x={C - 9}
                    y={C - 9}
                    width={18}
                    height={18}
                    className="text-primary-foreground"
                    aria-hidden="true"
                  />
                ) : (
                  <text
                    x={C}
                    y={C}
                    dy="0.35em"
                    textAnchor="middle"
                    fontSize="13"
                    fontWeight={500}
                    className="fill-primary-foreground"
                  >
                    {center.initials ?? center.label.slice(0, 2).toUpperCase()}
                  </text>
                )}
              </motion.g>

              {placed.map((p, i) => {
                const r = nodeR(p.depth)
                const dim = current ? !onPath.has(p.id) : affected > 0 && !p.reach
                return (
                  <motion.g
                    key={p.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, ease: EASE_OUT, delay: delay(p, i) }}
                    style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                  >
                    <g className={cn(fade, dim && (current ? 'opacity-25' : 'opacity-60'))}>
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={r + 3.5}
                        fill="none"
                        strokeWidth={1.5}
                        strokeDasharray={p.indirect ? '2 2' : undefined}
                        className={cn(
                          'stroke-(--tone) transition-opacity duration-300',
                          !p.affected && 'opacity-0',
                        )}
                      />
                      {active === i && !p.affected && (
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r={r + 3.5}
                          fill="none"
                          strokeWidth={1.5}
                          className="stroke-foreground/40"
                        />
                      )}
                      <circle cx={p.x} cy={p.y} r={r} style={{ fill: kindOf(p.kind).color }} />
                    </g>
                  </motion.g>
                )
              })}

              {placed.map((p, i) => (
                <circle
                  key={`hit-${p.id}`}
                  cx={p.x}
                  cy={p.y}
                  r={14}
                  fill="transparent"
                  onPointerEnter={() => select(i, false)}
                />
              ))}
            </svg>

            <BlastTooltip
              current={current}
              kind={current && kindOf(current.kind)}
              fromKeyboard={fromKeyboard}
            />
          </div>

          <BlastLegend
            kinds={legend.map((key) => ({ key, kind: kindOf(key) }))}
            affected={affected > 0}
          />

          <p role="status" aria-live="polite" className="sr-only">
            {fromKeyboard && current
              ? `${current.label}, ${kindOf(current.kind).label}, ${hops(current.depth)}${current.affected ? ', affected' : ''}${current.indirect ? ', indirect' : ''}${current.note ? `. ${current.note}` : ''}`
              : ''}
          </p>
        </Panel>
      </Shell>
    </MotionConfig>
  )
}
