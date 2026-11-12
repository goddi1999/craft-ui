import { animate, useMotionValue, type MotionValue } from 'motion/react'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'

import {
  DRAG_SPRING,
  DRAG_Y,
  RECYCLE_MS,
  RETURN_SPRING,
  THROW_AHEAD,
  THROW_DRIFT,
  THROW_DRIFT_MAX,
  THROW_PAST_EDGE,
  THROW_SPEED,
  THROW_SPRING,
  VELOCITY_SMOOTHING,
} from './swipe-deck.constants'
import type { SwipeDeckDirection, SwipeDeckItem } from './swipe-deck.types'
import { calm, clamp, decide, liftOf, reconcile } from './swipe-deck.utils'

/** What each card hands the deck so a drag, a key or a button can move it. */
export type CardMotion = {
  x: MotionValue<number>
  y: MotionValue<number>
  depth: MotionValue<number>
  /** 1 while the card is flying off. */
  flight: MotionValue<number>
  /** 1 when grabbed by the top half, -1 by the bottom half, so it tilts the other way. */
  grab: MotionValue<number>
  /** Drops the card in from behind the last one. */
  rejoin: (count: number) => void
}

type Drag = {
  id: string
  pointer: number
  originX: number
  originY: number
  lastX: number
  lastY: number
  lastTime: number
  vx: number
  vy: number
  targetX: number
}

type Spring = Parameters<typeof calm>[0]

type Options = {
  items: SwipeDeckItem[]
  threshold: number
  reduced: boolean
  labels: Record<SwipeDeckDirection, string>
  onSwipe?: (item: SwipeDeckItem, direction: SwipeDeckDirection) => void
}

/** Order, dragging and throwing for the deck. Anything per frame runs on motion values. */
export function useSwipeDeck({ items, threshold, reduced, labels, onSwipe }: Options) {
  const ids = items.map((item) => item.id)
  const idsKey = ids.join('\n')
  const [order, setOrder] = useState(ids)
  const [seenKey, setSeenKey] = useState(idsKey)
  if (seenKey !== idsKey) {
    setSeenKey(idsKey)
    setOrder(reconcile(order, ids))
  }
  const [status, setStatus] = useState('')

  // how far the cards behind have risen, driven by the top card's drag
  const lift = useMotionValue(0)
  const cards = useRef(new Map<string, CardMotion>())
  const drag = useRef<Drag | null>(null)
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>())

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach(clearTimeout)
  }, [])

  const register = useCallback((id: string, card: CardMotion) => {
    const registry = cards.current
    registry.set(id, card)
    return () => {
      if (registry.get(id) === card) registry.delete(id)
    }
  }, [])

  const top = items.find((item) => item.id === order[0])

  // dragging and snapping back carry the cards behind with them; a throw does not
  const moveX = (card: CardMotion, target: number, spring: Spring) =>
    animate(card.x, target, {
      ...calm(spring, reduced),
      onUpdate: (x) => lift.set(liftOf(x, threshold)),
    })

  function throwTop(direction: 1 | -1, vx = 0, vy = 0) {
    const id = order[0]
    const card = id === undefined ? undefined : cards.current.get(id)
    const item = items.find((entry) => entry.id === id)
    if (!card || !item || card.flight.get()) return
    drag.current = null

    // the cards behind rose with the drag. bake that in now, or they drop a level
    // the moment the top card leaves and then rise again
    const rise = liftOf(card.x.get(), threshold)
    if (rise > 0) {
      for (const other of order) {
        const behind = other === id ? undefined : cards.current.get(other)
        behind?.depth.jump(Math.max(0, behind.depth.get() - rise))
      }
    }
    lift.jump(0)
    card.flight.set(1)

    const spring = calm(THROW_SPRING, reduced)
    const x = card.x.get()
    // always aim ahead of the card, never behind it
    const distance = Math.max(window.innerWidth / 2 + THROW_PAST_EDGE, Math.abs(x) + THROW_AHEAD)
    animate(card.x, direction * distance, {
      ...spring,
      velocity: direction * Math.max(Math.abs(vx), THROW_SPEED),
    })
    animate(
      card.y,
      card.y.get() + clamp(vy * THROW_DRIFT, -THROW_DRIFT_MAX, THROW_DRIFT_MAX),
      spring,
    )

    // the next card is on top straight away; the thrown one rejoins at the back once it is gone
    const next = [...order.slice(1), item.id]
    setOrder(next)
    const timer = setTimeout(() => {
      timers.current.delete(timer)
      card.flight.set(0)
      card.x.jump(0)
      card.y.jump(0)
      card.rejoin(next.length)
    }, RECYCLE_MS)
    timers.current.add(timer)

    const side: SwipeDeckDirection = direction === 1 ? 'right' : 'left'
    const following = items.find((entry) => entry.id === next[0])
    setStatus(
      following && following !== item
        ? `${labels[side]}: ${item.title}. Next: ${following.title}`
        : `${labels[side]}: ${item.title}`,
    )
    onSwipe?.(item, side)
  }

  function handlePointerDown(event: PointerEvent<HTMLElement>, id: string) {
    const card = cards.current.get(id)
    if (event.button !== 0 || id !== order[0] || !card || card.flight.get()) return
    const box = event.currentTarget.getBoundingClientRect()
    card.grab.set(event.clientY < box.top + box.height / 2 ? 1 : -1)
    drag.current = {
      id,
      pointer: event.pointerId,
      originX: event.clientX - card.x.get(),
      originY: event.clientY - card.y.get(),
      lastX: event.clientX,
      lastY: event.clientY,
      lastTime: event.timeStamp,
      vx: 0,
      vy: 0,
      targetX: 0,
    }
    // caught mid snap-back: keep its speed, but hold it as tightly as a drag
    moveX(card, 0, DRAG_SPRING)
    animate(card.y, 0, calm(DRAG_SPRING, reduced))
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    const current = drag.current
    if (!current || current.pointer !== event.pointerId) return
    const card = cards.current.get(current.id)
    if (!card) return
    const dt = Math.max(1, event.timeStamp - current.lastTime) / 1000
    const keep = VELOCITY_SMOOTHING
    current.vx = current.vx * keep + ((event.clientX - current.lastX) / dt) * (1 - keep)
    current.vy = current.vy * keep + ((event.clientY - current.lastY) / dt) * (1 - keep)
    current.lastX = event.clientX
    current.lastY = event.clientY
    current.lastTime = event.timeStamp
    current.targetX = event.clientX - current.originX
    moveX(card, current.targetX, DRAG_SPRING)
    animate(card.y, (event.clientY - current.originY) * DRAG_Y, calm(DRAG_SPRING, reduced))
  }

  function handlePointerUp(event: PointerEvent<HTMLElement>) {
    const current = drag.current
    if (!current || current.pointer !== event.pointerId) return
    drag.current = null
    const card = cards.current.get(current.id)
    if (!card) return
    const direction = decide(current.targetX, current.vx, threshold)
    if (direction !== 0) {
      throwTop(direction, current.vx, current.vy)
      return
    }
    moveX(card, 0, RETURN_SPRING)
    animate(card.y, 0, calm(RETURN_SPRING, reduced))
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'ArrowLeft') throwTop(-1)
    else if (event.key === 'ArrowRight') throwTop(1)
    else return
    event.preventDefault()
  }

  return {
    order,
    top,
    lift,
    status,
    register,
    throwTop,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleKeyDown,
  }
}
