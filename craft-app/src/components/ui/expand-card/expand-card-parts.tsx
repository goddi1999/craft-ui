import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect, useId, useLayoutEffect, useRef, type KeyboardEvent } from 'react'

import {
  AWAY_SCALE,
  AWAY_SHIFT,
  DETAILS_BOTTOM,
  DETAILS_DELAY_MS,
  DETAILS_RISE,
  DETAILS_SPRING,
  DETAILS_TOP,
  FADE_SPRING,
  HEAD_DROP,
  HEAD_SHIFT,
  HEAD_X,
  HEAD_Y,
  INSET,
  OPEN_SPRING,
  PRICE_DROP,
  PRICE_Y,
  ROW_HEIGHT,
  SHRINK_SPRING,
  SLIDE_SPRING,
  THUMB,
  THUMB_GROW,
  THUMB_RADIUS,
  THUMB_RADIUS_GROW,
} from './expand-card.constants'
import type { ExpandCardItem } from './expand-card.types'

type Spring = { type: 'spring'; stiffness: number; damping: number; mass: number }

// reduced motion keeps the stiffness but damps critically, so nothing overshoots
const calm = (spring: Spring, reduced: boolean): Spring =>
  reduced ? { ...spring, damping: 2 * Math.sqrt(spring.stiffness) } : spring

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

/** `rest` when nothing is open; `above`/`below` when another card is open and this one makes way. */
export type RowState = 'open' | 'rest' | 'above' | 'below'

type ExpandCardRowProps = {
  item: ExpandCardItem
  state: RowState
  /** Px from the top of the list where the row sits when nothing is open. */
  home: number
  /** The last card opened, kept above the others while it folds back. */
  front: boolean
  reduced: boolean
  onToggle: () => void
  onAction?: (item: ExpandCardItem) => void
}

export function ExpandCardRow({
  item,
  state,
  home,
  front,
  reduced,
  onToggle,
  onAction,
}: ExpandCardRowProps) {
  const open = state === 'open'
  const away = state === 'above' || state === 'below'
  const targetY = open ? 0 : home + (state === 'above' ? -AWAY_SHIFT : state === 'below' ? AWAY_SHIFT : 0)

  const progress = useMotionValue(open ? 1 : 0)
  const reveal = useMotionValue(open ? 1 : 0)
  const y = useMotionValue(targetY)
  const opacity = useMotionValue(away ? 0 : 1)
  const scale = useMotionValue(away ? AWAY_SCALE : 1)
  const detailsHeight = useMotionValue(0)
  const details = useRef<HTMLDivElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)
  const detailsId = useId()

  useLayoutEffect(() => {
    const el = details.current
    if (!el) return
    const measure = () => detailsHeight.set(el.offsetHeight)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [detailsHeight])

  useEffect(() => {
    const controls = [
      animate(progress, open ? 1 : 0, calm(OPEN_SPRING, reduced)),
      animate(y, targetY, calm(SLIDE_SPRING, reduced)),
      animate(opacity, away ? 0 : 1, calm(FADE_SPRING, reduced)),
      animate(scale, away ? AWAY_SCALE : 1, calm(SHRINK_SPRING, reduced)),
    ]
    // the details wait until the photo has started to grow; closing hides them at once
    const timer = open
      ? setTimeout(
          () => controls.push(animate(reveal, 1, calm(DETAILS_SPRING, reduced))),
          DETAILS_DELAY_MS,
        )
      : undefined
    if (!open) controls.push(animate(reveal, 0, calm(DETAILS_SPRING, reduced)))
    return () => {
      clearTimeout(timer)
      controls.forEach((control) => control.stop())
    }
  }, [open, away, targetY, reduced, progress, reveal, y, opacity, scale])

  // the photo, title and price all ride the one progress spring
  const grown = useTransform(progress, clamp01)
  const height = useTransform([progress, detailsHeight], ([p, h]: number[]) =>
    ROW_HEIGHT + p * (DETAILS_TOP + h + DETAILS_BOTTOM - ROW_HEIGHT),
  )
  const thumbWidth = useTransform(
    grown,
    (g) => `calc(${THUMB}px + ${g.toFixed(4)} * (100% - ${THUMB + INSET * 2}px))`,
  )
  const thumbHeight = useTransform(progress, (p) => Math.max(THUMB, THUMB + p * THUMB_GROW))
  const thumbRadius = useTransform(grown, (g) => THUMB_RADIUS + g * THUMB_RADIUS_GROW)
  const headX = useTransform(grown, (g) => HEAD_X - HEAD_SHIFT * g)
  const headY = useTransform(progress, (p) => HEAD_Y + HEAD_DROP * p)
  const asideY = useTransform(progress, (p) => PRICE_Y + PRICE_DROP * p)
  const detailsOpacity = useTransform(reveal, clamp01)
  const detailsY = useTransform(reveal, (r) => (1 - r) * DETAILS_RISE)

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Escape' || !open) return
    event.preventDefault()
    // the details turn inert as it folds, so bring focus back to the row first
    toggle.current?.focus()
    onToggle()
  }

  return (
    <motion.div
      data-slot="expand-card-row"
      data-state={state}
      inert={away}
      className="absolute inset-x-0 top-0 overflow-hidden rounded-3xl bg-muted"
      style={{ y, scale, opacity, height, zIndex: front ? 2 : 1 }}
      onKeyDown={handleKeyDown}
    >
      <button
        ref={toggle}
        type="button"
        aria-expanded={open}
        aria-controls={detailsId}
        onClick={onToggle}
        className="absolute inset-0 cursor-pointer rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
      >
        <span className="sr-only">
          {[item.title, item.subtitle, item.aside].filter(Boolean).join(', ')}
        </span>
      </button>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-3 left-3 overflow-hidden bg-foreground/[0.09] *:block *:size-full [&>img]:object-cover"
        style={{ width: thumbWidth, height: thumbHeight, borderRadius: thumbRadius }}
      >
        {item.media}
      </motion.div>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-0 left-0"
        style={{ x: headX, y: headY }}
      >
        <p className="text-[15px] leading-5 font-semibold whitespace-nowrap">{item.title}</p>
        {item.subtitle ? (
          <p className="text-[13px] leading-[18px] whitespace-nowrap text-muted-foreground">
            {item.subtitle}
          </p>
        ) : null}
      </motion.div>

      {item.aside ? (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute top-0 right-4 text-[15px] leading-[18px] font-semibold"
          style={{ y: asideY }}
        >
          {item.aside}
        </motion.span>
      ) : null}

      <motion.div
        ref={details}
        id={detailsId}
        inert={!open}
        // clicks on the text fall through to the row and fold it back
        className="pointer-events-none absolute inset-x-4 top-[176px]"
        style={{ opacity: detailsOpacity, y: detailsY }}
      >
        {item.description ? (
          <p className="text-[13px] leading-[19px] text-foreground/80">{item.description}</p>
        ) : null}
        {item.tags?.length || item.action ? (
          <div className="mt-3 flex items-center gap-1.5">
            {item.tags?.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-foreground/[0.09] px-2.5 py-[5px] text-xs font-medium whitespace-nowrap text-foreground/80"
              >
                {tag}
              </span>
            ))}
            {item.action ? (
              <button
                type="button"
                onClick={() => onAction?.(item)}
                className="pointer-events-auto ml-auto rounded-full bg-primary px-3.5 py-[7px] text-[13px] font-semibold whitespace-nowrap text-primary-foreground outline-none transition-transform duration-150 focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97] motion-reduce:active:scale-100"
              >
                {item.action}
              </button>
            ) : null}
          </div>
        ) : null}
      </motion.div>
    </motion.div>
  )
}
