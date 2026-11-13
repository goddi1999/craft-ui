import { MotionConfig, motion, useReducedMotion } from 'motion/react'
import {
  useCallback,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'

import { cn } from '@/lib/utils'

import {
  DropChip,
  FunnelDataTable,
  FunnelSummary,
  FunnelTooltip,
} from './funnel-chart-parts'
import {
  BAR_SPRING,
  BRIDGE_SPRING,
  FADE,
  INSTANT,
  LAYOUT,
  SHOW_PCT_AT,
} from './funnel-chart.constants'
import type { FunnelChartProps } from './funnel-chart.types'
import {
  barWidth,
  barX,
  blockHeight,
  bridgePath,
  chartHeight,
  defaultFormat,
  dropPct,
  nextStage,
  ofTop,
  pctText,
  stageColor,
  worstDropIndex,
} from './funnel-chart.utils'
import { useDismissOutside } from './use-dismiss-outside'
import { useWidth } from './use-width'

/**
 * Conversion funnel with curved drop-off bridges and loss chips per stage.
 * Hand-written SVG — measures its own container, works in light and dark.
 */
export function FunnelChart({
  stages,
  formatValue = defaultFormat,
  showSummary = true,
  animated = true,
  onSelect,
  ariaLabel,
  className,
}: FunnelChartProps) {
  const reduce = useReducedMotion() === true
  const anim = animated && !reduce
  const uid = useId().replace(/[^\w-]/g, '')
  const [rootRef, width, measured] = useWidth()
  const wrapRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<number | null>(null)
  const [fromKeyboard, setFromKeyboard] = useState(false)
  const [pinned, setPinned] = useState(false)

  const clear = useCallback(() => {
    setActive(null)
    setPinned(false)
    setFromKeyboard(false)
    onSelect?.(null)
  }, [onSelect])

  useDismissOutside(wrapRef, pinned && active !== null, clear)

  const n = stages.length
  const top = Math.max(1e-9, stages[0]?.value ?? 1)
  const maxV = Math.max(top, ...stages.map((s) => s.value))
  const block = blockHeight()
  const H = chartHeight(n)
  const color = (i: number) => stageColor(stages, i)
  const w = (i: number) => barWidth(stages[i].value, maxV, width)
  const bx = (i: number) => barX(stages[i].value, maxV, width)
  const pct = (i: number) => ofTop(stages[i].value, top)
  const drop = (i: number) => dropPct(stages[i].value, stages[i + 1].value)

  const summary =
    n >= 2
      ? {
          conv: pct(n - 1),
          worst: worstDropIndex(stages),
          dropPct: drop(worstDropIndex(stages)),
        }
      : null

  const select = (index: number | null, keyboard: boolean, pin = false) => {
    setFromKeyboard(keyboard)
    setActive(index)
    setPinned(pin && index !== null)
    onSelect?.(index)
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      clear()
      return
    }
    const next = nextStage(event.key, active, n)
    if (next === null) return
    event.preventDefault()
    select(next, true, true)
  }

  const handleHitEnter = (i: number) => {
    if (!pinned) select(i, false)
  }

  const handleHitDown = (i: number, event: PointerEvent) => {
    // touch pins the tooltip; a second tap on the same stage clears it
    if (event.pointerType !== 'mouse') {
      if (pinned && active === i) clear()
      else select(i, false, true)
      return
    }
    select(i, false)
  }

  const handleHitLeave = (event: PointerEvent) => {
    if (event.pointerType === 'mouse' && !pinned) select(null, false)
  }

  if (!n) {
    return (
      <p className={cn('py-10 text-center text-[13px] text-muted-foreground', className)}>
        No data
      </p>
    )
  }

  const cur = active !== null ? stages[active] : null
  const label =
    ariaLabel ?? `Funnel with ${n} stages from ${stages[0].label} to ${stages[n - 1].label}`
  const spring = reduce ? INSTANT : BRIDGE_SPRING

  return (
    <MotionConfig reducedMotion="user">
      <div ref={rootRef} data-slot="funnel-chart" className={cn('w-full', className)}>
        {showSummary && summary && (
          <FunnelSummary
            stages={stages}
            conv={summary.conv}
            worst={summary.worst}
            drop={summary.dropPct}
          />
        )}

        <div
          ref={wrapRef}
          className="relative overflow-visible touch-pan-y outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          style={{ height: H }}
          tabIndex={0}
          role="group"
          aria-label={`${label}. Use arrow keys to read each stage.`}
          onKeyDown={handleKeyDown}
          onBlur={() => fromKeyboard && clear()}
        >
          <svg
            key={measured ? 'measured' : 'guess'}
            visibility={measured ? undefined : 'hidden'}
            width={width}
            height={H}
            role="img"
            aria-label={label}
            className="block overflow-visible"
          >
            <defs>
              {stages.slice(0, -1).map((_, i) => (
                <linearGradient key={i} id={`fg-${uid}-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" style={{ stopColor: color(i), stopOpacity: 0.34 }} />
                  <stop offset="1" style={{ stopColor: color(i + 1), stopOpacity: 0.08 }} />
                </linearGradient>
              ))}
            </defs>

            {stages.slice(0, -1).map((_, i) => (
              <motion.path
                key={i}
                fill={`url(#fg-${uid}-${i})`}
                initial={anim ? { opacity: 0, d: bridgePath(stages, i, width, maxV) } : false}
                animate={{
                  opacity: active === null || active === i ? 1 : 0.35,
                  d: bridgePath(stages, i, width, maxV),
                }}
                transition={
                  anim
                    ? {
                        opacity: { duration: 0.4, delay: 0.3 + i * 0.1 },
                        d: spring,
                      }
                    : { d: spring, opacity: FADE }
                }
              />
            ))}

            {stages.map((s, i) => {
              const y = i * block
              const dim = active !== null && active !== i
              return (
                <g
                  key={i}
                  style={{
                    opacity: dim ? 0.5 : 1,
                    transition: fromKeyboard ? undefined : 'opacity .2s',
                  }}
                >
                  <text
                    x={0}
                    y={y + 14}
                    className={cn(
                      'text-[12.5px]',
                      active === i ? 'fill-foreground' : 'fill-muted-foreground',
                    )}
                  >
                    {s.label}
                  </text>
                  <text
                    x={width}
                    y={y + 14}
                    textAnchor="end"
                    className="fill-foreground text-[12.5px] tabular-nums"
                  >
                    {formatValue(s.value)}
                    {width >= SHOW_PCT_AT && (
                      <tspan className="fill-muted-foreground"> · {pctText(pct(i))}</tspan>
                    )}
                  </text>
                  <motion.rect
                    y={y + LAYOUT.text}
                    height={LAYOUT.bar}
                    rx={9}
                    fill={color(i)}
                    initial={anim ? { x: width / 2, width: 0 } : false}
                    animate={{ x: bx(i), width: w(i) }}
                    transition={
                      anim
                        ? { ...BAR_SPRING, delay: i * 0.09 }
                        : spring
                    }
                  />
                </g>
              )
            })}

            {stages.slice(0, -1).map((_, i) => {
              const yc = i * block + LAYOUT.text + LAYOUT.bar + LAYOUT.bridge / 2
              const hot = active === i
              return (
                <motion.g
                  key={i}
                  initial={anim ? { opacity: 0 } : false}
                  animate={{ opacity: active === null || hot ? 1 : 0.4 }}
                  transition={{
                    duration: 0.3,
                    delay: anim && active === null ? 0.6 + i * 0.1 : 0,
                  }}
                >
                  <DropChip
                    x={width / 2}
                    y={yc}
                    label={`−${pctText(drop(i))}`}
                    hot={hot}
                  />
                </motion.g>
              )
            })}

            {/* Full-row hit areas: ≥52px tall (text+bar) / block between stages. */}
            {stages.map((_, i) => (
              <rect
                key={i}
                x={0}
                y={i * block}
                width={width}
                height={i === n - 1 ? LAYOUT.text + LAYOUT.bar : block}
                fill="transparent"
                className="touch-manipulation select-none [-webkit-tap-highlight-color:transparent]"
                onPointerEnter={() => handleHitEnter(i)}
                onPointerDown={(e) => handleHitDown(i, e)}
                onPointerLeave={handleHitLeave}
              />
            ))}
          </svg>

          {cur && active !== null && (
            <FunnelTooltip
              stage={cur}
              index={active}
              stages={stages}
              top={top}
              x={width / 2}
              y={active * block + LAYOUT.text}
              boundsWidth={width}
              formatValue={formatValue}
              fromKeyboard={fromKeyboard}
            />
          )}
        </div>

        <FunnelDataTable
          stages={stages}
          top={top}
          formatValue={formatValue}
          caption={ariaLabel ?? 'Funnel data'}
        />
        <p role="status" aria-live="polite" className="sr-only">
          {fromKeyboard && cur && active !== null
            ? [
                `${cur.label}: ${formatValue(cur.value)}`,
                `${pctText(pct(active))} of first stage`,
                active < n - 1 &&
                  `lost ${formatValue(cur.value - stages[active + 1].value)} next (${pctText(drop(active))})`,
              ]
                .filter(Boolean)
                .join(', ')
            : ''}
        </p>
      </div>
    </MotionConfig>
  )
}
