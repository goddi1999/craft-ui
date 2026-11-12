import { AnimatePresence, Reorder, motion, useTransform } from 'motion/react'
import { Plus } from 'lucide-react'
import { useRef, useState, type CSSProperties, type KeyboardEvent, type Ref } from 'react'

import { cn } from '@/lib/utils'

import {
  AREA_SHADE,
  BLUR_SUBTLE,
  DURATION,
  EASE_ENTER,
  GRADE_STYLES,
  INSTANT,
  SMOOTH_SPRING,
  SNAPPY_SPRING,
  THUMB,
} from './color-picker.constants'
import type { ColorSwatch, Hsva } from './color-picker.types'
import {
  clamp,
  contrastRatio,
  gradeFor,
  hsvToRgb,
  newSwatchId,
  parseColor,
  stepFor,
  toCss,
} from './color-picker.utils'
import { useFollow } from './use-follow'
import { usePointerPad } from './use-pointer-pad'

const WHITE = { r: 1, g: 1, b: 1, a: 1 }

/** A colour chip over a checkerboard, so opacity reads as opacity. */
export function Chip({ color, className }: { color: string; className?: string }) {
  return (
    <span
      className={cn(
        'relative block size-8 flex-none overflow-hidden rounded-full [background:var(--checker)]',
        className,
      )}
    >
      <span
        className="absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_oklch(0%_0_0/0.1)]"
        style={{ background: color }}
      />
    </span>
  )
}

export function ChipLabel({
  label,
  hex,
  className,
}: {
  label: string
  hex: string
  className?: string
}) {
  return (
    <span className={cn('grid min-w-0 text-start leading-[1.15]', className)}>
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium tabular-nums">{hex}</span>
    </span>
  )
}

/** Saturation left to right, brightness bottom to top, over the pure hue. */
export function ColorArea({
  hsva,
  reduced,
  active,
  onActive,
  onChange,
  thumbRef,
}: {
  hsva: Hsva
  reduced: boolean
  active: boolean
  onActive: (active: boolean) => void
  onChange: (next: Hsva) => void
  thumbRef: Ref<HTMLDivElement>
}) {
  const x = useFollow(hsva.s, reduced, active)
  const y = useFollow(1 - hsva.v, reduced, active)
  const left = useTransform(x, (v) => `${v * 100}%`)
  const top = useTransform(y, (v) => `${v * 100}%`)
  const pad = usePointerPad((px, py) => onChange({ ...hsva, s: px, v: 1 - py }), onActive)

  const handleKeyDown = (event: KeyboardEvent) => {
    const step = stepFor(event, 'both')
    if (!step) return
    event.preventDefault()
    onChange({ ...hsva, s: clamp(hsva.s + step[0] / 100), v: clamp(hsva.v + step[1] / 100) })
  }

  return (
    <div
      {...pad}
      data-active={active || undefined}
      style={{ background: `${AREA_SHADE}, hsl(${hsva.h} 100% 50%)` }}
      className="group relative h-[164px] cursor-crosshair touch-none rounded-2xl shadow-[inset_0_0_0_1px_oklch(0%_0_0/0.08)]"
    >
      <motion.div
        ref={thumbRef}
        role="slider"
        tabIndex={0}
        aria-roledescription="2D slider"
        aria-label="Saturation and brightness"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(hsva.s * 100)}
        aria-valuetext={`Saturation ${Math.round(hsva.s * 100)}%, brightness ${Math.round(hsva.v * 100)}%`}
        onKeyDown={handleKeyDown}
        style={{ left, top, background: toCss(hsva, true) }}
        className={cn(THUMB, 'group-data-active:scale-120 group-data-active:cursor-grabbing')}
      />
    </div>
  )
}

/** A horizontal track whose thumb shows the value it reports. */
export function Slider({
  label,
  value,
  valueText,
  max,
  track,
  fill,
  reduced,
  active,
  onActive,
  onChange,
}: {
  label: string
  value: number
  valueText: string
  max: number
  /** CSS background of the track. */
  track: string
  /** CSS background painted over the checkerboard inside the thumb. */
  fill: string
  reduced: boolean
  active: boolean
  onActive: (active: boolean) => void
  onChange: (value: number) => void
}) {
  const x = useFollow(value / max, reduced, active)
  const left = useTransform(x, (v) => `${v * 100}%`)
  const pad = usePointerPad((px) => onChange(px * max), onActive)

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      onChange(event.key === 'Home' ? 0 : max)
      return
    }
    const step = stepFor(event, 'x')
    if (!step) return
    event.preventDefault()
    onChange(clamp(value + step[0], 0, max))
  }

  return (
    // the track overhangs by half a thumb, so the thumb's centre covers the whole range
    <div
      {...pad}
      style={{ '--track': track, '--thumb-fill': fill } as CSSProperties}
      className="relative mx-[11px] h-3.5 cursor-pointer touch-none rounded-full before:absolute before:inset-y-0 before:-inset-x-[11px] before:rounded-[inherit] before:shadow-[inset_0_0_0_1px_oklch(0%_0_0/0.08)] before:[background:var(--track)]"
    >
      <motion.div
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={Math.round(value)}
        aria-valuetext={valueText}
        data-active={active || undefined}
        onKeyDown={handleKeyDown}
        style={{ left }}
        className={cn(
          THUMB,
          'top-1/2 [background:var(--checker)] after:absolute after:inset-0 after:rounded-[inherit] after:[background:var(--thumb-fill)] data-active:scale-120 data-active:cursor-grabbing',
        )}
      />
    </div>
  )
}

/** The WCAG ratio against the background it will sit on; the number springs, the grade swaps. */
export function ContrastReadout({
  hsva,
  background,
  reduced,
}: {
  hsva: Hsva
  background: string
  reduced: boolean
}) {
  const parsed = parseColor(background)
  const ratio = contrastRatio(hsva, parsed ? hsvToRgb(parsed) : WHITE)
  const grade = gradeFor(ratio)
  const shownRatio = useFollow(ratio, reduced)
  const ratioText = useTransform(shownRatio, (v) => v.toFixed(2))
  const hidden = reduced
    ? { opacity: 0 }
    : { opacity: 0, y: '0.3em', filter: `blur(${BLUR_SUBTLE}px)` }

  return (
    <div className="flex items-center gap-2.5 text-sm">
      <span
        aria-hidden
        style={{ background, color: toCss(hsva) }}
        className="grid h-7 w-9 flex-none place-items-center rounded-[9px] border border-border font-medium"
      >
        Aa
      </span>
      <span aria-hidden className="min-w-[4.4ch] font-medium tabular-nums">
        <motion.span>{ratioText}</motion.span>:1
      </span>
      <span
        aria-hidden
        className="min-w-0 flex-1 truncate text-xs text-muted-foreground max-[360px]:hidden"
      >
        against background
      </span>
      <span
        aria-hidden
        className={cn(
          'relative inline-grid h-[22px] items-center rounded-full px-2 text-xs font-medium whitespace-nowrap transition-colors duration-240 ease-[cubic-bezier(0.22,1,0.36,1)]',
          GRADE_STYLES[grade],
        )}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={grade}
            initial={hidden}
            animate={{ opacity: 1, y: '0em', filter: 'blur(0px)' }}
            exit={{ ...hidden, transition: { duration: DURATION.instant } }}
            transition={
              reduced
                ? { duration: DURATION.instant }
                : { duration: DURATION.standard, ease: EASE_ENTER }
            }
          >
            {grade}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="sr-only">
        {`Contrast ${ratio.toFixed(2)} to 1, ${grade === 'Fails' ? 'fails' : `passes ${grade}`}`}
      </span>
    </div>
  )
}

/**
 * Saved colours as a roving-tabindex listbox. Click applies, drag or Alt+Arrow reorders,
 * Delete removes and hands focus to a neighbour (or `onEmptied` once the last one goes).
 */
export function SwatchRow({
  swatches,
  hex,
  max,
  reduced,
  onChange,
  onApply,
  onEmptied,
}: {
  swatches: ColorSwatch[]
  hex: string
  max: number
  reduced: boolean
  onChange: (swatches: ColorSwatch[]) => void
  onApply: (color: string) => void
  onEmptied: () => void
}) {
  const [focusId, setFocusId] = useState<string | null>(null)
  const buttons = useRef(new Map<string, HTMLButtonElement>())
  // a drag ends with a click on the same swatch; this swallows it
  const dragged = useRef(false)
  const tabId = swatches.some((entry) => entry.id === focusId) ? focusId : swatches[0]?.id

  const focus = (id: string) => buttons.current.get(id)?.focus({ preventScroll: true })

  const save = () => {
    const entry = { id: newSwatchId(), color: hex }
    onChange([entry, ...swatches].slice(0, max))
    setFocusId(entry.id)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const item = swatches[index]
    if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault()
      const next = swatches.filter((entry) => entry.id !== item.id)
      onChange(next)
      const neighbor = next[Math.min(index, next.length - 1)]
      setFocusId(neighbor?.id ?? null)
      requestAnimationFrame(() => (neighbor ? focus(neighbor.id) : onEmptied()))
      return
    }
    const move = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
    if (!move && event.key !== 'Home' && event.key !== 'End') return
    event.preventDefault()
    if (move && event.altKey) {
      const to = index + move
      if (to < 0 || to >= swatches.length) return
      const next = [...swatches]
      next.splice(index, 1)
      next.splice(to, 0, item)
      onChange(next)
      requestAnimationFrame(() => focus(item.id))
      return
    }
    const target =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? swatches.length - 1
          : (index + move + swatches.length) % swatches.length
    setFocusId(swatches[target].id)
    focus(swatches[target].id)
  }

  return (
    <div className="flex min-h-8 items-center gap-1.5">
      <button
        type="button"
        onClick={save}
        aria-label={`Save ${hex}`}
        className="grid size-[30px] flex-none place-items-center rounded-full border border-dashed border-foreground/25 text-muted-foreground outline-none transition-[color,border-color,transform] duration-160 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.92] motion-reduce:transition-none"
      >
        <Plus className="size-4" strokeWidth={1.75} aria-hidden />
      </button>
      <Reorder.Group
        as="div"
        axis="x"
        values={swatches}
        onReorder={onChange}
        role="listbox"
        aria-label="Saved colors"
        aria-orientation="horizontal"
        className="flex min-w-0 flex-1 gap-1.5"
      >
        <AnimatePresence initial={false}>
          {swatches.map((entry, index) => {
            const current = entry.color.toUpperCase() === hex
            return (
              <Reorder.Item
                key={entry.id}
                value={entry}
                as="div"
                dragElastic={0.12}
                initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={
                  reduced
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.4, transition: { duration: DURATION.fast } }
                }
                transition={reduced ? INSTANT : { ...SNAPPY_SPRING, layout: SMOOTH_SPRING }}
                whileDrag={reduced ? undefined : { scale: 1.15, zIndex: 2 }}
                onDragStart={() => {
                  dragged.current = true
                }}
                onDragEnd={() =>
                  requestAnimationFrame(() => {
                    dragged.current = false
                  })
                }
                className="relative flex-none touch-pan-y"
              >
                <button
                  ref={(node) => {
                    if (node) buttons.current.set(entry.id, node)
                    else buttons.current.delete(entry.id)
                  }}
                  type="button"
                  role="option"
                  aria-selected={current}
                  aria-label={`${entry.color}. Alt and arrow keys to move, Delete to remove`}
                  tabIndex={entry.id === tabId ? 0 : -1}
                  data-current={current || undefined}
                  onFocus={() => setFocusId(entry.id)}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                  onClick={() => {
                    if (!dragged.current) onApply(entry.color)
                  }}
                  className="group grid size-[30px] place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring data-current:shadow-[inset_0_0_0_2px_var(--foreground)]"
                >
                  <Chip
                    color={entry.color}
                    className="size-[26px] transition-[scale] duration-[580ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-data-current:scale-[0.78] motion-reduce:transition-none"
                  />
                </button>
              </Reorder.Item>
            )
          })}
        </AnimatePresence>
      </Reorder.Group>
    </div>
  )
}
