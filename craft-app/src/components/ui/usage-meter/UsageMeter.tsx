import { TriangleAlert } from 'lucide-react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import { useId, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'

import { cn } from '@/lib/utils'

import { FADE, FREE_SWATCH, POP, TRACK } from './usage-meter.constants'
import type { Highlight, LegendItem, UsageMeterProps } from './usage-meter.types'
import { formatAmount, roundTo, segmentColor, usageStatus } from './usage-meter.utils'
import { Segment, StatusBadge, Swap, Ticker } from './usage-meter-parts'
import { useMeterMotion } from './use-meter-motion'

const KEY_STEPS: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }

/**
 * A segmented bar for a fixed allowance, such as storage or seats. It shows what takes the
 * space and how close the total is to the limit; hover, focus or press a category to read it
 * out, and past the limit the overflow is hatched. Adapted from uiarc.
 */
export function UsageMeter({
  label,
  segments,
  limit,
  unit = '',
  decimals = 1,
  freeLabel = 'Free',
  overLabel = 'Over limit',
  warnAt = 0.9,
  className,
}: UsageMeterProps) {
  const reduced = useReducedMotion() === true
  const root = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const legend = useRef<HTMLDivElement>(null)
  const inView = useInView(root, { once: true, amount: 0.4 })
  const titleId = useId()
  const hatchId = `hatch${titleId.replace(/[^a-zA-Z0-9_-]/g, '')}`
  const ready = inView || reduced

  const total = roundTo(segments.reduce((sum, segment) => sum + segment.value, 0), decimals)
  const free = roundTo(Math.max(0, limit - total), decimals)
  const over = roundTo(Math.max(0, total - limit), decimals)
  const status = usageStatus(total, limit, warnAt)
  const format = (value: number) => formatAmount(value, decimals, unit)
  const limitText = format(limit).replace(/\.0+(?= |$)/, '')

  const { amounts, span, width, limitX, overClip, markerOpacity } = useMeterMotion({
    segments,
    limit,
    ready,
    reduced,
    trackRef,
  })

  // hover previews a category, focus previews it too, and a press pins it until pressed again or Escape
  const [hovered, setHovered] = useState<string | null>(null)
  const [focused, setFocused] = useState<string | null>(null)
  const [pinned, setPinned] = useState<string | null>(null)
  const [roving, setRoving] = useState(0)
  const items: LegendItem[] = [
    ...segments.map(({ id, label: name, value }) => ({ id, label: name, value })),
    {
      id: 'free',
      label: status === 'over' ? overLabel : freeLabel,
      value: status === 'over' ? over : free,
    },
  ]
  const active = hovered ?? focused ?? pinned
  const activeItem = items.find((item) => item.id === active) ?? null
  const highlightOf = (id: string): Highlight => (active ? (active === id ? 'on' : 'off') : undefined)

  const idAt = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect()
    if (!rect?.width) return null
    const at = ((clientX - rect.left) / rect.width) * Math.max(limit, total)
    // past the limit the hatch stands for the overage, so pointing there highlights it
    if (at > limit) return 'free'
    let end = 0
    for (const segment of segments) {
      end += segment.value
      if (at <= end) return segment.id
    }
    return 'free'
  }

  const onTrackMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse') setHovered(idAt(event.clientX))
  }
  const onTrackTap = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse') return
    const id = idAt(event.clientX)
    setPinned((current) => (current === id ? null : id))
  }
  const onLegendKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      if (pinned || focused) {
        event.preventDefault()
        setPinned(null)
      }
      return
    }
    const next =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? items.length - 1
          : KEY_STEPS[event.key] !== undefined
            ? roving + KEY_STEPS[event.key]
            : undefined
    if (next === undefined) return
    event.preventDefault()
    const index = (next + items.length) % items.length
    setRoving(index)
    legend.current?.querySelectorAll<HTMLButtonElement>('button')[index]?.focus()
  }

  const headline = ready ? (activeItem ? activeItem.value : total) : 0
  const share = activeItem && limit > 0 ? Math.round((activeItem.value / limit) * 100) : 0
  const caption = !activeItem
    ? `${unit} of ${limitText} used`
    : activeItem.id === 'free'
      ? `${unit} ${status === 'over' ? 'over the limit' : 'free'}`
      : `${unit} in ${activeItem.label} · ${share}% of plan`
  const badge =
    status === 'over' ? `${format(over)} over` : status === 'near' ? 'Almost full' : `${format(free)} free`
  const breakdown = segments.map((segment) => `${segment.label} ${format(segment.value)}`).join(', ')
  const standing =
    status === 'over'
      ? `Over the limit by ${format(over)}.`
      : `${format(free)} free${status === 'near' ? ', almost full' : ''}.`
  const summary = `${label}: ${format(total)} of ${limitText} used. ${breakdown}. ${standing}`

  // status changes are announced, and so is a growing overage; routine changes stay quiet
  const notice = status === 'over' ? `over:${over}` : status
  const [announced, setAnnounced] = useState({ notice, message: '' })
  if (announced.notice !== notice) {
    setAnnounced({
      notice,
      message:
        status === 'over'
          ? `Over the plan limit by ${format(over)}.`
          : status === 'near'
            ? `Almost full. ${format(free)} free.`
            : `Under the limit. ${format(free)} free.`,
    })
  }

  return (
    <div
      ref={root}
      data-slot="usage-meter"
      data-status={status}
      role="group"
      aria-labelledby={titleId}
      className={cn('grid min-w-0 gap-4 text-foreground', className)}
    >
      <div className="flex min-h-7 min-w-0 items-center justify-between gap-3">
        {/* a long label wraps beside the status mark instead of hiding its end */}
        <span
          id={titleId}
          className="min-w-0 text-base leading-[1.4] font-medium tracking-[-0.01em] text-balance text-foreground"
        >
          {label}
        </span>
        <StatusBadge status={status} text={badge} reduced={reduced} />
      </div>

      <p className="flex min-w-0 items-baseline gap-2">
        <span className="sr-only">
          {format(total)} of {limitText} used
        </span>
        <span
          className="flex-none text-4xl leading-[1.1] font-medium tracking-[-0.03em]"
          aria-hidden="true"
        >
          <Ticker value={headline} decimals={decimals} reduced={reduced} />
        </span>
        <span className="min-w-0 flex-1 text-sm text-muted-foreground" aria-hidden="true">
          <Swap text={caption} reduced={reduced} />
        </span>
      </p>

      {/* the bar leaves room above and below the track for the limit marker */}
      <div className="relative py-[5px]">
        <div
          ref={trackRef}
          role="img"
          aria-label={summary}
          data-active={active ?? undefined}
          onPointerMove={onTrackMove}
          onPointerLeave={() => setHovered(null)}
          onPointerUp={onTrackTap}
          className={cn(
            'relative isolate h-3.5 overflow-hidden rounded-full [-webkit-tap-highlight-color:transparent]',
            TRACK,
          )}
        >
          {segments.map((segment, index) => (
            <Segment
              key={segment.id}
              index={index}
              amounts={amounts}
              span={span}
              width={width}
              highlight={highlightOf(segment.id)}
            />
          ))}
          {/* past the limit the overflow keeps its colours, hatched so it reads as over without colour */}
          <motion.svg
            data-highlight={highlightOf('free')}
            className="pointer-events-none absolute inset-0 size-full"
            style={{ clipPath: overClip, opacity: markerOpacity }}
            aria-hidden="true"
            focusable="false"
          >
            <defs>
              <pattern
                id={hatchId}
                width={6}
                height={6}
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45)"
              >
                <rect width={2.5} height={6} className="fill-card" />
              </pattern>
            </defs>
            {/* highlighting the overage floods it with the destructive colour */}
            <rect
              width="100%"
              height="100%"
              className={cn(
                'fill-destructive transition-opacity duration-160 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none',
                active === 'free' ? 'opacity-100' : 'opacity-0',
              )}
            />
            <rect width="100%" height="100%" fill={`url(#${hatchId})`} />
          </motion.svg>
        </div>
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 -left-px w-0.5 rounded-[1px] bg-foreground"
          style={{ x: limitX, opacity: markerOpacity }}
        />
      </div>

      {/* the legend is the keyboard path: arrows move, focus previews, a press pins */}
      <div
        ref={legend}
        role="group"
        aria-label={`${label} by category`}
        onKeyDown={onLegendKey}
        className="-mx-2 grid grid-cols-[repeat(auto-fit,minmax(108px,1fr))] gap-0.5"
      >
        {items.map((item, index) => {
          const warning = item.id === 'free' && status === 'over'
          const highlight = highlightOf(item.id)
          return (
            <button
              key={item.id}
              type="button"
              data-highlight={highlight}
              aria-pressed={pinned === item.id}
              aria-label={`${item.label}, ${format(item.value)}`}
              tabIndex={index === roving ? 0 : -1}
              onClick={() => {
                setRoving(index)
                setPinned((current) => (current === item.id ? null : item.id))
              }}
              onFocus={() => {
                setRoving(index)
                setFocused(item.id)
              }}
              onBlur={() => setFocused(null)}
              onPointerEnter={(event) => {
                if (event.pointerType === 'mouse') setHovered(item.id)
              }}
              onPointerLeave={(event) => {
                if (event.pointerType === 'mouse') setHovered(null)
              }}
              className={cn(
                'grid min-w-0 cursor-pointer justify-items-start gap-0.5 rounded-xl p-2 text-left outline-none [-webkit-tap-highlight-color:transparent] transition-[background-color,opacity] duration-160 ease-[cubic-bezier(.22,1,.36,1)] hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring aria-pressed:bg-muted motion-reduce:transition-none',
                highlight === 'off' && 'opacity-45',
              )}
            >
              <span className="flex max-w-full min-w-0 items-center gap-2 text-sm leading-[1.4] text-muted-foreground">
                <span className="grid size-3 flex-none place-items-center" aria-hidden="true">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {warning ? (
                      <motion.span
                        key="alert"
                        className="col-start-1 row-start-1 grid place-items-center text-destructive"
                        variants={reduced ? FADE : POP}
                        initial="hidden"
                        animate="shown"
                        exit="gone"
                      >
                        <TriangleAlert size={12} strokeWidth={2} />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="swatch"
                        className={cn(
                          'col-start-1 row-start-1 size-2.5 rounded-[3px]',
                          item.id === 'free' ? FREE_SWATCH : segmentColor(index),
                        )}
                        variants={reduced ? FADE : POP}
                        initial="hidden"
                        animate="shown"
                        exit="gone"
                      />
                    )}
                  </AnimatePresence>
                </span>
                <span className="min-w-0 flex-1">
                  <Swap text={item.label} reduced={reduced} />
                </span>
              </span>
              <span className="flex items-baseline gap-1 pl-5 text-base leading-[1.4] font-medium text-foreground">
                <Ticker value={item.value} decimals={decimals} reduced={reduced} />
                {unit ? <span className="text-sm font-normal text-muted-foreground">{unit}</span> : null}
              </span>
            </button>
          )
        })}
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {announced.message}
      </p>
    </div>
  )
}
