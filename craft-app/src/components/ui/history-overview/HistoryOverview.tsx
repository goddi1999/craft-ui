import { ChevronLeft, GalleryHorizontalEnd, X } from 'lucide-react'
import { animate, motion, useMotionValue, useReducedMotion } from 'motion/react'
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type WheelEvent,
} from 'react'

import { cn } from '@/lib/utils'

import {
  CARD_GAP,
  DRAG_SLOP,
  FLING,
  SNAP,
  WHEEL,
  WHEEL_SETTLE_MS,
  ZOOM,
} from './history-overview.constants'
import type { HistoryOverviewProps } from './history-overview.types'
import { HistoryCard } from './history-overview-parts'

const CONTROL =
  'grid size-11 place-items-center rounded-xl bg-black/70 text-white shadow-lg backdrop-blur-md outline-none transition-[opacity,scale] duration-150 [-webkit-tap-highlight-color:transparent] [touch-action:manipulation] focus-visible:ring-2 focus-visible:ring-white active:scale-[0.94] sm:size-10'

/**
 * Pages you have visited, as one zoomable strip. On a page, the button at the bottom zooms out
 * to every page side by side; drag, scroll or arrow through them, then pick one and it zooms
 * back up to fill the screen. The edge arrow steps back one page without leaving it.
 */
export function HistoryOverview({
  pages,
  current: currentProp,
  defaultCurrent,
  onCurrentChange,
  overviewScale = 0.42,
  className,
  ...props
}: HistoryOverviewProps) {
  const reduced = useReducedMotion() ?? false
  const stage = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [inner, setInner] = useState(() => {
    const found = pages.findIndex((page) => page.id === defaultCurrent)
    return found >= 0 ? found : pages.length - 1
  })
  const controlled = currentProp ? pages.findIndex((page) => page.id === currentProp) : -1
  const current = controlled >= 0 ? controlled : Math.min(inner, pages.length - 1)

  const [overview, setOverview] = useState(false)
  const zoom = useMotionValue(0)
  const focus = useMotionValue(current)
  const drag = useRef({ id: -1, x: 0, from: 0, moved: false, last: 0, time: 0, velocity: 0 })
  const wheelTimer = useRef(0)

  useLayoutEffect(() => {
    const node = stage.current
    if (!node) return
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ width, height })
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  // a controlled change from outside slides to that page
  useLayoutEffect(() => {
    if (!overview && Math.round(focus.get()) !== current) {
      animate(focus, current, reduced ? { duration: 0 } : SNAP)
    }
  }, [current, overview, focus, reduced])

  // keep keyboard focus with the view: the centred card in the strip, the strip button on a page
  const toggle = useRef<HTMLButtonElement>(null)
  const wasOverview = useRef(false)
  useEffect(() => {
    if (overview) {
      stage.current?.querySelectorAll<HTMLButtonElement>('button')[current]?.focus({ preventScroll: true })
    } else if (wasOverview.current) {
      toggle.current?.focus({ preventScroll: true })
    }
    wasOverview.current = overview
  }, [overview, current])

  const motionFor = (spring: typeof ZOOM | typeof SNAP) => (reduced ? { duration: 0 } : spring)
  const spacing = size.width * overviewScale + CARD_GAP
  const clampIndex = (value: number) => Math.min(pages.length - 1, Math.max(0, value))

  const choose = (index: number) => {
    setInner(index)
    onCurrentChange?.(pages[index].id)
  }

  const showOverview = () => {
    setOverview(true)
    focus.set(current)
    animate(zoom, 1, motionFor(ZOOM))
  }

  const open = (index: number) => {
    setOverview(false)
    choose(index)
    animate(focus, index, motionFor(ZOOM))
    animate(zoom, 0, motionFor(ZOOM))
  }

  const step = (by: number) => {
    const next = clampIndex(current + by)
    if (next === current) return
    choose(next)
    animate(focus, next, motionFor(SNAP))
  }

  const settle = (target: number) => animate(focus, clampIndex(Math.round(target)), motionFor(SNAP))

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!overview || event.button !== 0) return
    focus.stop()
    drag.current = {
      id: event.pointerId,
      x: event.clientX,
      from: focus.get(),
      moved: false,
      last: event.clientX,
      time: event.timeStamp,
      velocity: 0,
    }
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const state = drag.current
    if (event.pointerId !== state.id || spacing <= 0) return
    const dx = event.clientX - state.x
    if (!state.moved && Math.abs(dx) > DRAG_SLOP) {
      state.moved = true
      event.currentTarget.setPointerCapture(event.pointerId)
    }
    if (!state.moved) return
    const dt = Math.max(1, event.timeStamp - state.time)
    state.velocity = (event.clientX - state.last) / dt
    state.last = event.clientX
    state.time = event.timeStamp
    focus.set(state.from - dx / spacing)
  }

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const state = drag.current
    if (event.pointerId !== state.id) return
    state.id = -1
    if (!state.moved) return
    // a fling carries on in the direction it was thrown
    settle(focus.get() - (state.velocity * 1000 * FLING) / spacing)
  }

  const onClickCapture = (event: MouseEvent) => {
    // a drag that ends over a card must not open it
    if (drag.current.moved) {
      event.stopPropagation()
      drag.current.moved = false
    }
  }

  const onWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (!overview || spacing <= 0) return
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY
    focus.stop()
    focus.set(Math.min(pages.length - 0.6, Math.max(-0.4, focus.get() + (delta / spacing) * WHEEL)))
    window.clearTimeout(wheelTimer.current)
    wheelTimer.current = window.setTimeout(() => settle(focus.get()), WHEEL_SETTLE_MS)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!overview) return
    const at = clampIndex(Math.round(focus.get()))
    const move = (to: number) => {
      const target = clampIndex(to)
      settle(target)
      // focus follows the centred card, so Enter opens what you see
      stage.current?.querySelectorAll<HTMLButtonElement>('button')[target]?.focus({ preventScroll: true })
    }
    if (event.key === 'ArrowRight') move(at + 1)
    else if (event.key === 'ArrowLeft') move(at - 1)
    else if (event.key === 'Home') move(0)
    else if (event.key === 'End') move(pages.length - 1)
    else if (event.key === 'Escape') open(current)
    else return
    event.preventDefault()
  }

  const fade = 'pointer-events-none absolute inset-y-0 z-10 w-16 from-[#0e0e10] to-transparent sm:w-28'
  const geometry = { width: size.width, height: size.height, scale: overviewScale }

  return (
    <div
      data-slot="history-overview"
      data-overview={overview || undefined}
      className={cn('group/history relative isolate overflow-hidden rounded-[18px] bg-[#0e0e10]', className)}
      onKeyDown={onKeyDown}
      {...props}
    >
      <div
        ref={stage}
        role="region"
        aria-label={overview ? 'All pages' : pages[current]?.title}
        className={cn('absolute inset-0', overview && 'cursor-grab touch-pan-y active:cursor-grabbing')}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={onClickCapture}
        onWheel={onWheel}
      >
        {size.width > 0 &&
          pages.map((page, index) => (
            <HistoryCard
              key={page.id}
              page={page}
              index={index}
              zoom={zoom}
              focus={focus}
              geometry={geometry}
              overview={overview}
              current={index === current}
              onOpen={() => open(index)}
            />
          ))}
      </div>

      <motion.div aria-hidden className={cn(fade, 'left-0 bg-linear-to-r')} style={{ opacity: zoom }} />
      <motion.div aria-hidden className={cn(fade, 'right-0 bg-linear-to-l')} style={{ opacity: zoom }} />

      {overview && (
        // a visible way out without picking a page; Escape does the same
        <button
          type="button"
          onClick={() => open(current)}
          aria-label={`Back to ${pages[current]?.title ?? 'page'}`}
          className={cn(CONTROL, 'absolute bottom-4 left-1/2 z-20 -translate-x-1/2')}
        >
          <X className="size-[18px]" strokeWidth={2.4} aria-hidden />
        </button>
      )}

      {!overview && (
        <>
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={current === 0}
            aria-label="Previous page"
            className={cn(
              CONTROL,
              'absolute top-1/2 left-3 z-20 -translate-y-1/2 disabled:pointer-events-none disabled:opacity-0',
              // revealed by hovering the edge on desktop; always there on touch
              'pointer-fine:opacity-0 pointer-fine:group-hover/history:opacity-100 pointer-fine:focus-visible:opacity-100',
            )}
          >
            <ChevronLeft className="size-5" strokeWidth={2.4} aria-hidden />
          </button>
          <button
            ref={toggle}
            type="button"
            onClick={showOverview}
            aria-label="Show all pages"
            aria-expanded={false}
            className={cn(CONTROL, 'absolute bottom-4 left-1/2 z-20 -translate-x-1/2')}
          >
            <GalleryHorizontalEnd className="size-[18px]" strokeWidth={2.2} aria-hidden />
          </button>
        </>
      )}
    </div>
  )
}
