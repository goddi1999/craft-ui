import { X } from 'lucide-react'
import { animate, motion, useMotionValue, usePresence, useTransform } from 'motion/react'
import { useEffect, useLayoutEffect, useRef, type MouseEvent } from 'react'

import {
  ENTER_SCALE,
  EXIT_MS,
  EXIT_SCALE,
  FADE_SPRING,
  GAP,
  POP_SPRING,
  WIDTH_SPRING,
} from './tag-input.constants'

type Spring = { type: 'spring'; stiffness: number; damping: number; mass: number }

// reduced motion keeps the stiffness but damps critically, so nothing overshoots
const calm = (spring: Spring, reduced: boolean): Spring =>
  reduced ? { ...spring, damping: 2 * Math.sqrt(spring.stiffness) } : spring

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

type TagChipProps = {
  tag: string
  /** Pop in when mounted; chips that are there from the start just sit there. */
  appear: boolean
  reduced: boolean
  onRemove: (tag: string, fromKeyboard: boolean) => void
}

/** A chip born at the width of its word that pops in, and shrinks away when removed. */
export function TagChip({ tag, appear, reduced, onRemove }: TagChipProps) {
  const [isPresent, safeToRemove] = usePresence()
  const inner = useRef<HTMLSpanElement>(null)
  const done = useRef(safeToRemove)
  // 1 once it sits at its natural width, so a late font or a resize still fits
  const settled = useMotionValue(appear ? 0 : 1)
  const full = useMotionValue(0)
  const width = useMotionValue(0)
  const scale = useMotionValue(appear ? ENTER_SCALE : 1)
  const opacity = useMotionValue(appear ? 0 : 1)

  const shownWidth = useTransform([width, settled], ([w, s]: number[]) =>
    s ? 'auto' : Math.max(0, w),
  )
  // while it leaves, the gap after it closes along with the width
  const marginRight = useTransform([width, full], ([w, f]: number[]) =>
    isPresent || !f ? 0 : -GAP * (1 - clamp01(w / f)),
  )

  useEffect(() => {
    done.current = safeToRemove
  })

  useLayoutEffect(() => {
    const el = inner.current
    if (!el) return

    if (isPresent) {
      if (settled.get()) return
      const natural = el.offsetWidth
      full.set(natural)
      const controls = [
        animate(width, natural, {
          ...calm(WIDTH_SPRING, reduced),
          onComplete: () => settled.set(1),
        }),
        animate(scale, 1, calm(POP_SPRING, reduced)),
        animate(opacity, 1, calm(FADE_SPRING, reduced)),
      ]
      return () => controls.forEach((control) => control.stop())
    }

    // leaving: measure first so it shrinks from the width it really has
    if (settled.get()) {
      const natural = el.offsetWidth
      full.set(natural)
      width.jump(natural)
      settled.set(0)
    }
    const controls = [
      animate(width, 0, calm(WIDTH_SPRING, reduced)),
      animate(scale, EXIT_SCALE, calm(POP_SPRING, reduced)),
      animate(opacity, 0, calm(FADE_SPRING, reduced)),
    ]
    const timer = setTimeout(() => done.current?.(), EXIT_MS)
    return () => {
      clearTimeout(timer)
      controls.forEach((control) => control.stop())
    }
  }, [isPresent, reduced, settled, full, width, scale, opacity])

  const handleRemove = (event: MouseEvent<HTMLButtonElement>) => {
    // the field focuses the input on click; a tap on x should not open the keyboard
    event.stopPropagation()
    onRemove(tag, event.detail === 0)
  }

  return (
    <motion.span
      data-slot="tag-input-chip"
      inert={!isPresent}
      className="inline-flex h-8 items-center overflow-hidden rounded-lg bg-foreground/[0.09] text-sm font-medium whitespace-nowrap text-foreground"
      style={{ width: shownWidth, marginRight, scale, opacity }}
    >
      <span ref={inner} className="inline-flex shrink-0 items-center gap-1 pr-1.5 pl-[11px]">
        <span>{tag}</span>
        <button
          type="button"
          onClick={handleRemove}
          aria-label={`Remove ${tag}`}
          className="grid size-5 place-items-center rounded-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-3.5" strokeWidth={2.2} aria-hidden />
        </button>
      </span>
    </motion.span>
  )
}
