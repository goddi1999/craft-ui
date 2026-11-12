import {
  animate,
  motionValue,
  useMotionValue,
  useTransform,
  type AnimationPlaybackControls,
  type MotionValue,
} from 'motion/react'
import {
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from 'react'

import { DURATION, EASE_STANDARD, GAP, REVEAL, REVEAL_STAGGER, SETTLE } from './usage-meter.constants'
import type { UsageMeterSegment } from './usage-meter.types'
import { soon } from './usage-meter.utils'

type Store = Map<string, MotionValue<number>>

function amountFor(store: Store, id: string) {
  let amount = store.get(id)
  if (!amount) {
    amount = motionValue(0)
    store.set(id, amount)
  }
  return amount
}

/**
 * The springs behind the bar. Segments grow into place once `ready`, left to right; later
 * changes re-flow every segment on one spring each. The bar spans the limit, or everything
 * used once that is more, so crossing the limit is continuous.
 */
export function useMeterMotion({
  segments,
  limit,
  ready,
  reduced,
  trackRef,
}: {
  segments: UsageMeterSegment[]
  limit: number
  ready: boolean
  reduced: boolean
  trackRef: RefObject<HTMLDivElement | null>
}) {
  // one motion value per segment id, kept across renders so a changed value springs from where it is
  const [store] = useState<Store>(() => new Map())
  const amounts = segments.map((segment) => amountFor(store, segment.id))
  const shownLimit = useMotionValue(limit)
  const width = useMotionValue(0)
  const used = useTransform(() => amounts.reduce((sum, amount) => sum + amount.get(), 0))
  const span = useTransform(() => Math.max(shownLimit.get(), used.get(), 1e-6))
  const limitX = useTransform(() => Math.round((shownLimit.get() / span.get()) * width.get()))
  const overClip = useTransform(() => `inset(0 0 0 ${limitX.get() + GAP}px)`)
  // the limit marker and the hatch fade on their own short tween whenever usage crosses the
  // limit, so a limit that jumps past usage never blinks them out in one frame
  const markerOpacity = useMotionValue(0)

  useEffect(() => {
    let over = used.get() > shownLimit.get()
    markerOpacity.jump(over ? 1 : 0)
    let fading: AnimationPlaybackControls | undefined
    const check = () => {
      const next = used.get() > shownLimit.get()
      if (next === over) return
      over = next
      fading?.stop()
      if (reduced) markerOpacity.jump(next ? 1 : 0)
      else {
        fading = animate(markerOpacity, next ? 1 : 0, {
          duration: DURATION.fast,
          ease: EASE_STANDARD,
        })
      }
    }
    const stops = [used.on('change', check), shownLimit.on('change', check)]
    return () => {
      stops.forEach((stop) => stop())
      fading?.stop()
    }
  }, [markerOpacity, reduced, shownLimit, used])

  useLayoutEffect(() => {
    const node = trackRef.current
    if (!node) return
    width.set(node.clientWidth)
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(() => width.set(node.clientWidth))
    observer.observe(node)
    return () => observer.disconnect()
  }, [trackRef, width])

  const revealed = useRef(false)
  const flow = useEffectEvent((first: boolean) => {
    // a segment that left forgets its amount, so one that comes back grows in again
    const ids = new Set(segments.map((segment) => segment.id))
    for (const id of [...store.keys()]) if (!ids.has(id)) store.delete(id)
    return segments.map((segment, index) => {
      const amount = store.get(segment.id)
      if (!amount || amount.get() === segment.value) return null
      if (reduced) {
        amount.jump(segment.value)
        return null
      }
      const transition = first ? { ...REVEAL, delay: index * REVEAL_STAGGER } : SETTLE
      return soon(() => animate(amount, segment.value, transition))
    })
  })
  // the key carries every id and value, so a new array with the same numbers changes nothing
  const values = segments.map((segment) => `${segment.id}:${segment.value}`).join('|')
  useEffect(() => {
    if (!ready) return
    const first = !revealed.current
    revealed.current = true
    const stops = flow(first)
    return () => stops.forEach((stop) => stop?.())
  }, [values, ready, reduced])

  useEffect(() => {
    if (shownLimit.get() === limit) return
    if (reduced) {
      shownLimit.jump(limit)
      return
    }
    return soon(() => animate(shownLimit, limit, SETTLE))
  }, [limit, reduced, shownLimit])

  return { amounts, span, width, limitX, overClip, markerOpacity }
}
