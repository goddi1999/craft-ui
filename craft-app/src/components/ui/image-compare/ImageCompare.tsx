import { ChevronLeft, ChevronRight } from 'lucide-react'
import { animate, motion, useMotionValue, useReducedMotion } from 'motion/react'
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'

import { cn } from '@/lib/utils'

import {
  BUMP_PX,
  CHIP,
  HANDLE,
  HANDLE_ACROSS,
  HANDLE_DOWN,
  HANDLE_REST,
  INSTANT,
  KICK_SPRING,
  LAYER,
  LINE,
  MOVE_SPRING,
  ROOT,
  SLOP,
  SPRING_MORPH,
  TURN_SPRING,
} from './image-compare.constants'
import type { Drag, ImageCompareProps, Metrics } from './image-compare.types'
import { clamp, rubber } from './image-compare.utils'
import { useDividerStyles } from './use-divider-styles'

/**
 * Before and after, split by a divider that follows the pointer 1:1, rubber-bands past the edges
 * and swings a quarter turn when the orientation changes. Adapted from uiarc.
 */
export function ImageCompare({
  before,
  after,
  position,
  defaultPosition = 50,
  onPositionChange,
  orientation = 'horizontal',
  labels = ['Before', 'After'],
  label = 'Before and after',
  aspectRatio = '3 / 2',
  className,
}: ImageCompareProps) {
  const reduced = useReducedMotion() ?? false
  const vertical = orientation === 'vertical'
  const [internal, setInternal] = useState(defaultPosition)
  const current = clamp(position ?? internal, 0, 100)
  const afterShare = Math.round(100 - current)
  const rootRef = useRef<HTMLDivElement>(null)
  const handleRef = useRef<HTMLDivElement>(null)
  const beforeChip = useRef<HTMLSpanElement>(null)
  const afterChip = useRef<HTMLSpanElement>(null)
  const latest = useRef(current)
  const goal = useRef(current)
  const drag = useRef<Drag | null>(null)
  const pressedHandle = useRef(false)
  const [dragging, setDragging] = useState(false)
  const [quiet, setQuiet] = useState(false)
  const hasLabels = labels !== false

  // the divider is a committed position plus a catch-up offset: a press springs the offset to zero
  // while the pointer moves the position 1:1, so the divider glides to the finger and never trails it
  const pos = useMotionValue(current)
  const lag = useMotionValue(0)
  const theta = useMotionValue(vertical ? 90 : 0)
  const metrics = useMotionValue<Metrics>({ w: 0, h: 0, bw: 0, bh: 0, aw: 0, ah: 0 })
  const styles = useDividerStyles({ pos, lag, theta, metrics })

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || typeof ResizeObserver === 'undefined') return
    const measure = () =>
      metrics.set({
        w: root.clientWidth,
        h: root.clientHeight,
        bw: beforeChip.current?.offsetWidth ?? 0,
        bh: beforeChip.current?.offsetHeight ?? 0,
        aw: afterChip.current?.offsetWidth ?? 0,
        ah: afterChip.current?.offsetHeight ?? 0,
      })
    const observer = new ResizeObserver(measure)
    for (const node of [root, beforeChip.current, afterChip.current]) {
      if (node) observer.observe(node)
    }
    measure()
    return () => observer.disconnect()
    // captions that mount later are observed too
  }, [metrics, hasLabels])

  // a new orientation swings the divider a quarter turn about its pivot while the clip follows it
  useEffect(() => {
    const target = vertical ? 90 : 0
    if (theta.get() === target) return
    if (reduced) theta.jump(target)
    else animate(theta, target, TURN_SPRING)
  }, [reduced, theta, vertical])

  // positions that arrive from outside a drag (props, keys, a double-click) spring the divider there
  useLayoutEffect(() => {
    latest.current = current
    if (drag.current?.started || goal.current === current) return
    goal.current = current
    const from = pos.get() + lag.get()
    lag.jump(0)
    pos.jump(from)
    if (reduced) pos.jump(current)
    else animate(pos, current, MOVE_SPRING)
  })

  function commit(next: number, live = false) {
    if (live && Math.round(next) === Math.round(latest.current)) return
    const value = Number(next.toFixed(2))
    if (value === latest.current) return
    latest.current = value
    if (position === undefined) setInternal(value)
    onPositionChange?.(value)
  }

  function percentAt(event: PointerEvent<HTMLDivElement>) {
    const rect = rootRef.current!.getBoundingClientRect()
    return vertical
      ? ((event.clientY - rect.top) / (rect.height || 1)) * 100
      : ((event.clientX - rect.left) / (rect.width || 1)) * 100
  }

  function axisSize() {
    const rect = rootRef.current?.getBoundingClientRect()
    return (vertical ? rect?.height : rect?.width) || 1
  }

  // focus that follows a pointer keeps the handle quiet: no ring until a key is pressed
  function focusQuietly() {
    const node = handleRef.current
    if (!node || document.activeElement === node) return
    setQuiet(true)
    node.focus({ preventScroll: true })
  }

  function start(state: Drag, at: number) {
    const from = pos.get() + lag.get()
    state.started = true
    state.grab = state.press ? 0 : at - from
    lag.jump(0)
    pos.jump(from)
    setDragging(true)
    focusQuietly()
    follow(state, at, true)
  }

  // puts the line under the pointer, with resistance past the edges, and commits the position once
  // per whole percent
  function follow(state: Drag, at: number, first = false) {
    const raw = at - state.grab
    const size = axisSize()
    const edge = clamp(raw, 0, 100)
    const placed = reduced ? edge : edge + (rubber(((raw - edge) / 100) * size) / size) * 100
    state.raw = raw
    if (first && state.press && !reduced) {
      const from = pos.get()
      pos.jump(placed)
      lag.jump(from - placed)
      animate(lag, 0, MOVE_SPRING)
    } else {
      pos.set(placed)
    }
    commit(edge, true)
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || !event.isPrimary || !rootRef.current) return
    const onHandle = !!(event.target as HTMLElement).closest('[data-handle]')
    pressedHandle.current = onHandle
    event.currentTarget.setPointerCapture(event.pointerId)
    const state: Drag = {
      pointer: event.pointerId,
      grab: 0,
      press: !onHandle,
      started: false,
      x: event.clientX,
      y: event.clientY,
      raw: 0,
    }
    drag.current = state
    // a finger on the photo might be scrolling the page, so it waits for a sideways drag; a mouse
    // or the handle answers at once
    if (event.pointerType !== 'touch' || onHandle) start(state, percentAt(event))
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const state = drag.current
    if (!state || state.pointer !== event.pointerId) return
    if (!state.started) {
      const dx = Math.abs(event.clientX - state.x)
      const dy = Math.abs(event.clientY - state.y)
      const along = vertical ? dy : dx
      const across = vertical ? dx : dy
      if (along < SLOP && across < SLOP) return
      if (across > along) {
        drag.current = null
        return
      }
      start(state, percentAt(event))
      return
    }
    follow(state, percentAt(event))
  }

  function onPointerEnd(event: PointerEvent<HTMLDivElement>) {
    const state = drag.current
    if (!state || state.pointer !== event.pointerId) return
    drag.current = null
    // a tap on the photo moves the divider there
    if (!state.started) {
      if (event.type === 'pointerup') {
        focusQuietly()
        commit(clamp(percentAt(event), 0, 100))
      }
      return
    }
    // the divider stays where it was let go; past an edge, or still catching up to a press, it
    // springs on with the speed it had
    const from = pos.get() + lag.get()
    const velocity = lag.getVelocity() + (from > 100 || from < 0 ? pos.getVelocity() : 0)
    const target = clamp(lag.get() !== 0 ? state.raw : from, 0, 100)
    lag.jump(0)
    pos.jump(from)
    goal.current = Number(target.toFixed(2))
    if (from !== target) {
      if (reduced) pos.jump(target)
      else animate(pos, target, { ...MOVE_SPRING, velocity })
    }
    commit(target)
    setDragging(false)
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const large = event.shiftKey ? 10 : 1
    // keys move the divider the way they point along its axis; the other two follow the value,
    // where up and right mean more of the after image
    const toward: Record<string, number> = vertical
      ? { ArrowUp: -large, ArrowDown: large, ArrowRight: -large, ArrowLeft: large }
      : { ArrowLeft: -large, ArrowRight: large, ArrowUp: -large, ArrowDown: large }
    toward.PageUp = -10
    toward.PageDown = 10
    let next: number
    if (event.key === 'Home') next = 100
    else if (event.key === 'End') next = 0
    else if (event.key in toward) next = Math.round(latest.current) + toward[event.key]
    else return
    event.preventDefault()
    setQuiet(false)
    const clamped = clamp(next, 0, 100)
    if (clamped === latest.current) {
      // a press at a limit kicks the divider and lets it settle back
      if (!reduced && next !== clamped) {
        const velocity = ((Math.sign(next - clamped) * BUMP_PX) / axisSize()) * 100
        animate(pos, goal.current, { ...KICK_SPRING, velocity })
      }
      return
    }
    commit(clamped)
  }

  const capsule = dragging ? (vertical ? HANDLE_DOWN : HANDLE_ACROSS) : HANDLE_REST
  const nudge = reduced ? INSTANT : SPRING_MORPH

  return (
    <div
      ref={rootRef}
      data-slot="image-compare"
      data-orientation={orientation}
      data-dragging={dragging || undefined}
      className={cn(ROOT, className)}
      style={{ aspectRatio }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onLostPointerCapture={onPointerEnd}
      onMouseDown={(event) => event.preventDefault()}
      onDragStart={(event) => event.preventDefault()}
      // pointer capture sends the double-click to the frame, so it checks where the presses began
      onDoubleClick={() => {
        if (pressedHandle.current && latest.current !== 50) commit(50)
      }}
    >
      <div className={LAYER}>{after}</div>
      <motion.div className={LAYER} style={{ clipPath: styles.clipPath }}>
        {before}
      </motion.div>
      {labels && (
        <>
          <motion.span
            ref={beforeChip}
            className={cn(CHIP, 'top-3 left-3')}
            style={{ opacity: styles.beforeOpacity }}
            aria-hidden="true"
          >
            {labels[0]}
          </motion.span>
          <motion.span
            ref={afterChip}
            className={cn(CHIP, 'top-3 right-3')}
            style={{ opacity: styles.afterAcross }}
            aria-hidden="true"
          >
            {labels[1]}
          </motion.span>
          <motion.span
            className={cn(CHIP, 'bottom-3 left-3')}
            style={{ opacity: styles.afterDown }}
            aria-hidden="true"
          >
            {labels[1]}
          </motion.span>
        </>
      )}
      {/* a frame-sized layer moved by a share of itself; its top-left corner is the divider's center */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{ x: styles.pivotX, y: styles.pivotY }}
      >
        <motion.span className="absolute top-0 left-0 size-0" style={{ rotate: theta }}>
          <span className={LINE} />
        </motion.span>
        <motion.span
          className="absolute top-0 left-0"
          style={{ x: styles.handleX, y: styles.handleY }}
        >
          <motion.div
            ref={handleRef}
            data-handle=""
            data-quiet={quiet || undefined}
            className={HANDLE}
            role="slider"
            tabIndex={0}
            aria-label={label}
            aria-orientation={orientation}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={afterShare}
            aria-valuetext={`${afterShare}% after`}
            initial={false}
            animate={capsule}
            transition={nudge}
            onKeyDown={onKeyDown}
            onBlur={() => setQuiet(false)}
          >
            <motion.span
              className="flex items-center"
              style={{ rotate: theta }}
              aria-hidden="true"
            >
              <motion.span
                className="-mx-[2.5px] grid place-items-center"
                initial={false}
                animate={{ x: dragging ? -4 : 0 }}
                transition={nudge}
              >
                <ChevronLeft size={16} strokeWidth={1.75} />
              </motion.span>
              <motion.span
                className="-mx-[2.5px] grid place-items-center"
                initial={false}
                animate={{ x: dragging ? 4 : 0 }}
                transition={nudge}
              >
                <ChevronRight size={16} strokeWidth={1.75} />
              </motion.span>
            </motion.span>
          </motion.div>
        </motion.span>
      </motion.div>
    </div>
  )
}
