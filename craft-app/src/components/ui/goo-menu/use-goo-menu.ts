import { useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from 'react'
import {
  animate,
  motionValue,
  useAnimationFrame,
  useMotionValue,
  useTransform,
  type MotionValue,
} from 'motion/react'

import {
  BREATHE,
  CLOSE_KICK,
  CLOSE_STAGGER,
  GROW_SPRING,
  IN_SPRING,
  KEY_TOAST_MS,
  MAIN_SIZE,
  OPEN_KICK,
  OUT_SPRING,
  POP_SPRING,
  SCALE,
  SELECT_CLOSE_MS,
  SELECT_TOAST_MS,
  SHRINK_SPRING,
  STAGGER_MS,
  TOAST_KICK,
  TOAST_PADDING,
  TOAST_SPRING,
  TURN,
  TURN_SPRING,
  UNTOAST_KICK,
  UNTOAST_SPRING,
} from './goo-menu.constants'
import type { GooMenuItem } from './goo-menu.types'
import { bubbleHomes, ORIGIN, withReducedMotion, type Point, type Spring } from './goo-menu.utils'

export type Bubble = {
  x: MotionValue<number>
  y: MotionValue<number>
  scale: MotionValue<number>
}

export type SelectVia = 'pointer' | 'keyboard'

type Toast = { index: number; shown: boolean }

type Timers = Map<string, number>

const createBubble = (): Bubble => ({
  x: motionValue(0),
  y: motionValue(0),
  scale: motionValue<number>(SCALE.closed),
})

export function flyTo(bubble: Bubble, point: Point, spring: Spring) {
  animate(bubble.x, point.x, spring)
  animate(bubble.y, point.y, spring)
}

// adds to the velocity the + already has, like goo.js does; reduced motion skips the squash
function kick(pop: MotionValue<number>, velocity: number, reduced: boolean) {
  if (reduced) return
  animate(pop, 1, { ...POP_SPRING, velocity: pop.getVelocity() + velocity })
}

function cancel(timers: Timers, key: string) {
  window.clearTimeout(timers.get(key))
  timers.delete(key)
}

// one timer per key, so scheduling again replaces it, like a bubble's pending flight in goo.js
function later(timers: Timers, key: string, ms: number, run: () => void) {
  cancel(timers, key)
  if (ms <= 0) {
    run()
    return
  }
  timers.set(
    key,
    window.setTimeout(() => {
      timers.delete(key)
      run()
    }, ms),
  )
}

type UseGooMenuOptions = {
  items: readonly GooMenuItem[]
  openProp: boolean | undefined
  defaultOpen: boolean
  onOpenChange: ((open: boolean) => void) | undefined
  onSelect: ((value: string) => void) | undefined
  radius: number
  toastDuration: number
  reduced: boolean
  rootRef: RefObject<HTMLDivElement | null>
  triggerRef: RefObject<HTMLButtonElement | null>
  toastRef: RefObject<HTMLSpanElement | null>
}

/** Open state, bubble choreography, the toast morph and the idle breathing of the +. */
export function useGooMenu({
  items,
  openProp,
  defaultOpen,
  onOpenChange,
  onSelect,
  radius,
  toastDuration,
  reduced,
  rootRef,
  triggerRef,
  toastRef,
}: UseGooMenuOptions) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const open = openProp === undefined ? uncontrolledOpen : openProp
  const [toast, setToast] = useState<Toast | null>(null)

  const openRef = useRef(open)
  const previousOpen = useRef(open)
  const previousToast = useRef(toast)
  const timers = useRef<Timers>(new Map())

  const count = items.length
  const homes = useMemo(() => bubbleHomes(count, radius), [count, radius])
  // the blob and the button of a bubble live in different layers, so they share these
  const bubbles = useMemo(() => Array.from({ length: count }, createBubble), [count])

  const width = useMotionValue(MAIN_SIZE)
  const pop = useMotionValue(1)
  const breathe = useMotionValue(0)
  const rotation = useMotionValue(open ? TURN : 0)
  const scale = useTransform(() => pop.get() + breathe.get())

  const toasting = toast !== null && toast.shown
  const breathing = !open && !toasting && !reduced

  useAnimationFrame((time) => {
    breathe.set(breathing ? Math.sin((time / 1000) * BREATHE.speed) * BREATHE.amount : 0)
  })

  useLayoutEffect(() => {
    openRef.current = open
  })

  const setOpen = (next: boolean) => {
    // timers can fire after the menu already got there
    if (next === openRef.current) return
    if (openProp === undefined) setUncontrolledOpen(next)
    onOpenChange?.(next)
  }

  const close = () => {
    // the bubbles go inert as they close, so hand focus back to the + instead of losing it
    const active = document.activeElement
    if (active !== triggerRef.current && rootRef.current?.contains(active)) {
      triggerRef.current?.focus()
    }
    setOpen(false)
  }

  const hideToast = () => {
    setToast((current) => (current?.shown ? { ...current, shown: false } : current))
  }

  const showToast = (index: number) => {
    setToast({ index, shown: true })
    later(timers.current, 'hide-toast', toastDuration, hideToast)
  }

  const toggle = () => {
    // a pick that is still on its way would close or toast on top of this
    cancel(timers.current, 'close')
    cancel(timers.current, 'show-toast')
    if (toasting) {
      cancel(timers.current, 'hide-toast')
      hideToast()
    }
    setOpen(!open)
  }

  const select = (index: number, via: SelectVia) => {
    const item = items[index]
    onSelect?.(item.value)
    if (via === 'keyboard') close()
    else later(timers.current, 'close', SELECT_CLOSE_MS, close)
    if (item.toast !== undefined) {
      const delay = via === 'keyboard' ? KEY_TOAST_MS : SELECT_TOAST_MS
      later(timers.current, 'show-toast', delay, () => showToast(index))
    }
  }

  // a drag takes over from a flight that has not started yet
  const cancelFlight = (index: number) => cancel(timers.current, `bubble-${index}`)

  // runs on controlled changes too, which is why this is an effect and not in toggle()
  useEffect(() => {
    const changed = previousOpen.current !== open
    previousOpen.current = open
    const spring = (base: Spring) => withReducedMotion(base, reduced)

    if (changed) {
      kick(pop, open ? OPEN_KICK : CLOSE_KICK, reduced)
      animate(rotation, open ? TURN : 0, spring(TURN_SPRING))
    }

    bubbles.forEach((bubble, i) => {
      if (open) {
        // staggered when it just opened; otherwise the homes moved, so go straight there
        const delay = changed ? i * STAGGER_MS : 0
        later(timers.current, `bubble-${i}`, delay, () => flyTo(bubble, homes[i], spring(OUT_SPRING)))
        animate(bubble.scale, SCALE.open, spring(GROW_SPRING))
      } else if (changed) {
        // back in from the far end, a little quicker than they came out
        const delay = (bubbles.length - 1 - i) * STAGGER_MS * CLOSE_STAGGER
        later(timers.current, `bubble-${i}`, delay, () => flyTo(bubble, ORIGIN, spring(IN_SPRING)))
        animate(bubble.scale, SCALE.closed, spring(SHRINK_SPRING))
      }
    })
  }, [open, homes, bubbles, reduced, pop, rotation])

  // measure the toast once it is in the DOM, before paint, then grow the pill around it
  useLayoutEffect(() => {
    if (previousToast.current === toast) return
    previousToast.current = toast
    if (toast === null) return

    const content = toastRef.current
    if (toast.shown && content) {
      animate(width, content.offsetWidth + TOAST_PADDING, withReducedMotion(TOAST_SPRING, reduced))
      kick(pop, TOAST_KICK, reduced)
    } else {
      animate(width, MAIN_SIZE, withReducedMotion(UNTOAST_SPRING, reduced))
      kick(pop, UNTOAST_KICK, reduced)
    }
  }, [toast, reduced, width, pop, toastRef])

  useEffect(() => {
    if (!open) return
    const handleClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    document.addEventListener('click', handleClick)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('click', handleClick)
      window.removeEventListener('keydown', handleKeyDown)
    }
  })

  useEffect(() => {
    const pending = timers.current
    return () => {
      pending.forEach((timer) => window.clearTimeout(timer))
      pending.clear()
    }
  }, [])

  useEffect(
    () => () => {
      bubbles.forEach((bubble) => {
        bubble.x.stop()
        bubble.y.stop()
        bubble.scale.stop()
      })
    },
    [bubbles],
  )

  useEffect(
    () => () => {
      width.stop()
      pop.stop()
      rotation.stop()
    },
    [width, pop, rotation],
  )

  return {
    open,
    toast,
    bubbles,
    homes,
    width,
    scale,
    rotation,
    toggle,
    select,
    cancelFlight,
  }
}
