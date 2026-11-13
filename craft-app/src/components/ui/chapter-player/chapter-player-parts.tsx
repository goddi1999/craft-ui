import { Play } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useRef, type KeyboardEvent, type PointerEvent, type Ref } from 'react'

import { StepperProgressBarTitles } from '@/components/shared/steppers'
import { Button } from '@/components/ui/button'

import {
  KEY_STEP,
  KEY_STEP_LARGE,
  PAUSE_FADE,
  STEPPER_COLORS,
  TICK_GAP,
} from './chapter-player.constants'
import type { Chapter, ChapterPlayerColor } from './chapter-player.types'
import { clamp, formatTime } from './chapter-player.utils'

type ChapterNavProps = {
  chapters: Chapter[]
  active: number
  reduced: boolean
  onSelect: (index: number) => void
}

// on narrow screens the row scrolls; keep the current chapter in view without moving the page
function useCentreActive(active: number, reduced: boolean, selector: string) {
  const row = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const list = row.current
    const item = list?.querySelectorAll<HTMLElement>(selector)[active]
    if (!list || !item || list.scrollWidth <= list.clientWidth) return
    const left = item.getBoundingClientRect().left - list.getBoundingClientRect().left + list.scrollLeft
    list.scrollTo({
      left: left - (list.clientWidth - item.offsetWidth) / 2,
      behavior: reduced ? 'auto' : 'smooth',
    })
  }, [active, reduced, selector])
  return row
}

const ROW = '-mx-4 overflow-x-auto overscroll-x-contain px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'

/** The chapters as plain buttons; the current one is the default button in the theme accent. */
export function ChapterButtons({ chapters, active, reduced, onSelect }: ChapterNavProps) {
  const row = useCentreActive(active, reduced, ':scope > button')
  return (
    <div
      ref={row}
      // safe centring: when the buttons overflow they start at the edge instead of being cut off on both sides
      className={`${ROW} flex snap-x snap-mandatory scroll-px-4 justify-center-safe gap-2 pt-5 pb-4`}
    >
      {chapters.map((chapter, index) => {
        const on = index === active
        return (
          <Button
            key={`${chapter.label}-${chapter.start}`}
            type="button"
            variant={on ? 'default' : 'secondary'}
            aria-current={on ? 'step' : undefined}
            onClick={() => onSelect(index)}
            // 44px tall on phones (Fitts), the regular button height from sm up
            className="h-11 max-w-48 shrink-0 snap-center px-4 select-none [-webkit-tap-highlight-color:transparent] [touch-action:manipulation] active:scale-[0.97] sm:h-9"
          >
            {/* long chapter names end in an ellipsis instead of stretching the row */}
            <span className="truncate">{chapter.label}</span>
          </Button>
        )
      })}
    </div>
  )
}

// the stepper is a ported shared component, so its spacing and panel are tuned from outside
// titles truncate inside their step; below ~28rem the stepper scrolls instead of squeezing further
const STEPS = [
  'max-w-none min-w-[28rem] space-y-0',
  '[&_[data-slot=stepper-nav]]:mb-0 [&_[data-slot=stepper-panel]]:hidden',
  '[&_[data-slot=stepper-item]]:min-w-0 [&_[data-slot=stepper-trigger]]:min-w-0 [&_[data-slot=stepper-trigger]]:py-2',
  '[&_[data-slot=stepper-title]]:w-full [&_[data-slot=stepper-title]]:truncate [&_[data-slot=stepper-title]]:text-sm',
  '[&_[data-slot=stepper-indicator]]:transition-colors [&_[data-slot=stepper-indicator]]:duration-300',
].join(' ')

/** The chapters as a progress stepper: finished chapters and the current one are filled. */
export function ChapterSteps({
  chapters,
  active,
  color,
  reduced,
  onSelect,
}: ChapterNavProps & { color: ChapterPlayerColor }) {
  const row = useCentreActive(active, reduced, '[data-slot="stepper-item"]')
  const steps = useMemo(() => chapters.map((chapter) => ({ title: chapter.label })), [chapters])
  return (
    <div ref={row} className={`${ROW} pt-4 pb-3`}>
      <StepperProgressBarTitles
        steps={steps}
        value={active + 1}
        onValueChange={(step) => onSelect(step - 1)}
        colorVariant={STEPPER_COLORS[color]}
        renderContent={() => null}
        className={STEPS}
      />
    </div>
  )
}

/**
 * The tick ruler with its playhead. The playhead is moved by the clock through `playheadRef`,
 * so dragging and playback never go through React state.
 */
export function Scrubber({
  duration,
  label,
  sliderRef,
  playheadRef,
  elapsedRef,
  onSeek,
  onScrubStart,
  onScrubEnd,
  getTime,
}: {
  duration: number
  label: string
  sliderRef: Ref<HTMLDivElement>
  playheadRef: Ref<HTMLDivElement>
  /** the clock writes the elapsed time here once a second */
  elapsedRef: Ref<HTMLSpanElement>
  onSeek: (time: number) => void
  onScrubStart: () => void
  onScrubEnd: () => void
  getTime: () => number
}) {
  const track = useRef<HTMLDivElement>(null)
  const bounds = useRef<DOMRect | null>(null)

  const seekTo = (clientX: number) => {
    const rect = bounds.current
    if (!rect || rect.width === 0) return
    onSeek(clamp((clientX - rect.left) / rect.width, 0, 1) * duration)
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    event.currentTarget.setPointerCapture(event.pointerId)
    bounds.current = track.current?.getBoundingClientRect() ?? null
    onScrubStart()
    seekTo(event.clientX)
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) seekTo(event.clientX)
  }

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
    event.currentTarget.releasePointerCapture(event.pointerId)
    onScrubEnd()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? KEY_STEP_LARGE : KEY_STEP
    const now = getTime()
    const next =
      event.key === 'ArrowRight' || event.key === 'ArrowUp'
        ? now + step
        : event.key === 'ArrowLeft' || event.key === 'ArrowDown'
          ? now - step
          : event.key === 'PageUp'
            ? now + KEY_STEP_LARGE
            : event.key === 'PageDown'
              ? now - KEY_STEP_LARGE
              : event.key === 'Home'
                ? 0
                : event.key === 'End'
                  ? duration
                  : null
    if (next === null) return
    event.preventDefault()
    onSeek(next)
  }

  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-start gap-3 sm:gap-4">
      <span ref={elapsedRef} className="min-w-[4ch] pt-1.5 text-xs font-semibold text-foreground tabular-nums">
        0:00
      </span>
      <div
        ref={sliderRef}
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-valuenow={0}
        aria-valuetext={`0:00 of ${formatTime(duration)}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
        className="relative h-11 cursor-grab sm:h-10 rounded-md outline-none select-none [touch-action:pan-y] focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
      >
        <div ref={track} className="absolute inset-x-0 top-2 h-2.5 text-foreground/30">
          <div
            aria-hidden
            className="size-full"
            style={{
              backgroundImage: `repeating-linear-gradient(90deg, currentColor 0 1px, transparent 1px ${TICK_GAP}px)`,
            }}
          />
        </div>
        {/* full-width layer moved by its own width, so translateX(40%) lands at 40% of the ruler */}
        <div
          ref={playheadRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 will-change-transform"
          style={{ transform: 'translateX(0%)' }}
        >
          <span className="absolute top-0.5 left-0 h-4 w-0.5 -translate-x-1/2 rounded-full bg-foreground/80" />
          <span className="absolute top-6 left-0 size-3.5 -translate-x-1/2 rounded-full bg-foreground/65 shadow-[0_2px_6px_rgb(0_0_0/0.25),inset_0_1px_0_rgb(255_255_255/0.2)]" />
        </div>
      </div>
      <span className="pt-1.5 text-xs font-semibold text-muted-foreground tabular-nums">
        {formatTime(duration)}
      </span>
    </div>
  )
}

/** A quiet play / pause mark in the middle of the stage, shown only while paused. */
export function PauseMark({ playing }: { playing: boolean }) {
  return (
    <AnimatePresence initial={false}>
      {!playing && (
        <motion.span
          key="paused"
          aria-hidden
          initial={{ opacity: 0, transform: 'scale(0.9)' }}
          animate={{ opacity: 1, transform: 'scale(1)' }}
          exit={{ opacity: 0, transform: 'scale(0.9)' }}
          transition={PAUSE_FADE}
          className="pointer-events-none absolute top-1/2 left-1/2 -mt-7 -ml-7 grid size-14 place-items-center rounded-full bg-black/45 text-white backdrop-blur-md"
        >
          <Play className="size-6 translate-x-0.5 fill-current" strokeWidth={0} />
        </motion.span>
      )}
    </AnimatePresence>
  )
}
