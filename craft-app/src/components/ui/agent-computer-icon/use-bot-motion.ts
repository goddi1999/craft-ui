import { useReducedMotion } from 'motion/react'
import { useLayoutEffect, useRef, useState, type RefObject } from 'react'

import {
  DOT,
  FOLLOW_RAMP,
  IDLE_FRAME_MS,
  LOOK_MORPH,
  LOOK_PITCH,
  LOOK_YAW,
  MAX_STEP,
  MOTION_STILLS,
  POINTER_BUSY_MS,
  SCALE,
  START_TIME,
} from './agent-computer-icon.constants'
import {
  createBotState,
  isLooking,
  isMorphing,
  sampleBot,
  setFace,
  setLook,
  setMotion,
  setShape,
} from './agent-computer-icon.engine'
import { playLength } from './agent-computer-icon.poses'
import type {
  BotEffects,
  BotFace,
  BotFrame,
  BotMotion,
  BotShape,
  BotState,
} from './agent-computer-icon.types'
import { clamp, easeOutQuint, lidAt } from './agent-computer-icon.utils'

export type BotRefs = {
  svg: RefObject<SVGSVGElement | null>
  body: RefObject<SVGRectElement | null>
  shape: RefObject<SVGPathElement | null>
  eyes: readonly RefObject<SVGPathElement | null>[]
  notch: RefObject<SVGCircleElement | null>
  dot: RefObject<SVGCircleElement | null>
}

type Options = { animated: boolean; lookAtCursor: boolean; reduced: boolean; paused: boolean }
type Handlers = { effects: (effects: BotEffects) => void; end: (motion: BotMotion) => void }

const hasEffects = (effects: BotEffects) =>
  effects.arcs.length > 0 || effects.dots.length > 0 || effects.notif !== null

function setAttr(element: Element | null, name: string, value: string | number) {
  const next = String(value)
  if (element && element.getAttribute(name) !== next) element.setAttribute(name, next)
}

/**
 * The frame loop lives outside React: it writes the mask's path and transforms straight to the DOM,
 * runs only while the bot is on screen and something moves, and drops to ~20fps when it only drifts.
 * Move extras (rings, sparks, badges) come and go, so those go back through React.
 */
function createBotController(refs: BotRefs, state: BotState, handlers: RefObject<Handlers>) {
  let options: Options = { animated: true, lookAtCursor: false, reduced: false, paused: false }
  let t = START_TIME
  let frame = 0
  let lastDraw = 0
  let visible = true
  let pointer: { nx: number; ny: number } | null = null
  let lastMove = -Infinity
  let engagedAt: number | null = null
  let showingEffects = false
  let endTimer = 0

  const still = () => options.reduced || options.paused
  const idle = () => options.animated && !still()

  const paint = () => {
    const next = sampleBot(state, t, idle())
    setAttr(refs.shape.current, 'd', next.body)
    setAttr(refs.body.current, 'opacity', next.bodyAlpha)
    next.eyes.forEach((eye, side) => {
      const element = refs.eyes[side]?.current ?? null
      if (!eye) return setAttr(element, 'opacity', 0)
      setAttr(element, 'd', eye.d)
      setAttr(element, 'transform', eye.transform)
      setAttr(element, 'opacity', eye.opacity)
    })
    const badge = [
      [refs.notch.current, DOT.radius + DOT.gap],
      [refs.dot.current, DOT.radius],
    ] as const
    for (const [circle, radius] of badge) {
      setAttr(circle, 'cx', next.badge.x)
      setAttr(circle, 'cy', next.badge.y)
      setAttr(circle, 'r', Math.round(radius * SCALE * next.badge.scale * 100) / 100)
    }
    if (hasEffects(next.effects) || showingEffects) handlers.current.effects(next.effects)
    showingEffects = hasEffects(next.effects)
  }

  // half a viewport away turns the eyes fully; with no pointer they look straight out
  const follow = () => {
    if (options.lookAtCursor && !still()) {
      engagedAt ??= t
      const look = {
        yaw: LOOK_YAW * (pointer?.nx ?? 0),
        pitch: -LOOK_PITCH * (pointer?.ny ?? 0),
        mix: easeOutQuint(clamp((t - engagedAt) / FOLLOW_RAMP)),
        wander: pointer ? 0 : 1,
      }
      setLook(state, look, t, LOOK_MORPH)
    } else if (engagedAt !== null) {
      engagedAt = null
      setLook(state, null, t, still() ? 0 : LOOK_MORPH)
    }
  }

  // a Move state plays once, then the bot settles back to idle
  const playing = () => state.motion.current !== 'idle'
  const finish = () => {
    const ended = state.motion.current
    setMotion(state, 'idle', t, still())
    handlers.current.end(ended)
  }

  const wantsFrames = () =>
    visible &&
    !still() &&
    (idle() || options.lookAtCursor || playing() || isMorphing(state, t) || isLooking(state, t))

  const tick = (now: number) => {
    frame = 0
    const busy =
      now - lastMove < POINTER_BUSY_MS ||
      playing() ||
      isMorphing(state, t) ||
      isLooking(state, t) ||
      (idle() && lidAt(t + state.phase) < 1) ||
      t - state.blinkAt < 1
    if (lastDraw && !busy && now - lastDraw < IDLE_FRAME_MS) {
      frame = requestAnimationFrame(tick)
      return
    }
    t += lastDraw ? Math.min((now - lastDraw) / 1000, MAX_STEP) : 0
    lastDraw = now
    if (playing() && t - state.motion.at >= playLength(state.motion.current)) finish()
    follow()
    paint()
    if (wantsFrames()) frame = requestAnimationFrame(tick)
    else lastDraw = 0
  }

  const stop = () => {
    cancelAnimationFrame(frame)
    frame = 0
    lastDraw = 0
  }

  const run = () => {
    if (still() || !visible) {
      stop()
      follow()
      paint()
      return
    }
    if (!frame && wantsFrames()) frame = requestAnimationFrame(tick)
    else if (!frame) paint()
  }

  const onPointerMove = (event: PointerEvent) => {
    const svg = refs.svg.current
    if (event.pointerType === 'touch' || !svg) return
    const box = svg.getBoundingClientRect()
    pointer = {
      nx: clamp((event.clientX - (box.left + box.width / 2)) / Math.max(1, window.innerWidth / 2), -1, 1),
      ny: clamp((event.clientY - (box.top + box.height / 2)) / Math.max(1, window.innerHeight / 2), -1, 1),
    }
    lastMove = performance.now()
  }
  const onPointerLeave = () => {
    pointer = null
  }

  const observer =
    typeof IntersectionObserver === 'undefined'
      ? null
      : new IntersectionObserver(
          ([entry]) => {
            visible = entry?.isIntersecting ?? true
            if (visible) run()
            else stop()
          },
          { rootMargin: '80px' },
        )
  if (refs.svg.current) observer?.observe(refs.svg.current)

  return {
    setOptions(next: Options) {
      if (next.lookAtCursor !== options.lookAtCursor) {
        if (next.lookAtCursor) {
          window.addEventListener('pointermove', onPointerMove, { passive: true })
          document.addEventListener('pointerleave', onPointerLeave)
        } else {
          window.removeEventListener('pointermove', onPointerMove)
          document.removeEventListener('pointerleave', onPointerLeave)
          pointer = null
        }
      }
      options = next
      run()
    },
    setShape(shape: BotShape) {
      setShape(state, shape, t, still() ? 0 : undefined)
      run()
    },
    setFace(face: BotFace) {
      setFace(state, face, t, still() ? 0 : undefined)
      run()
    },
    play(motion: BotMotion) {
      window.clearTimeout(endTimer)
      if (still()) {
        // a still frame: jump to the state's most telling moment and hold it
        setMotion(state, motion, t - MOTION_STILLS[motion], true)
        // reduced motion still settles back to idle after the state's length; a paused bot holds
        if (options.reduced && !options.paused && motion !== 'idle') {
          endTimer = window.setTimeout(() => {
            finish()
            paint()
          }, playLength(motion) * 1000)
        }
      } else if (motion !== 'idle' || playing()) {
        setMotion(state, motion, t)
      }
      run()
    },
    blink() {
      if (still()) return
      state.blinkAt = t
      run()
    },
    paint,
    destroy() {
      stop()
      window.clearTimeout(endTimer)
      observer?.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerleave', onPointerLeave)
    },
  }
}

type Controller = ReturnType<typeof createBotController>

export function useBotMotion({
  refs,
  shape,
  face,
  animated,
  lookAtCursor,
  online,
  motion,
  motionKey,
  onMotionEnd,
  paused,
  phase,
}: {
  refs: BotRefs
  shape: BotShape
  face: BotFace
  animated: boolean
  lookAtCursor: boolean
  online: boolean
  motion: BotMotion
  motionKey: string | number | undefined
  onMotionEnd: ((motion: BotMotion) => void) | undefined
  paused: boolean
  phase: number
}) {
  const reduced = useReducedMotion() === true
  const controller = useRef<Controller | null>(null)

  // the first frame comes from React; after that the controller writes the body and eyes itself
  const [initial] = useState<BotFrame>(() => {
    const still = paused || reduced
    const at = still ? START_TIME - MOTION_STILLS[motion] : START_TIME
    const state = createBotState(shape, face, at, phase, still ? motion : 'idle')
    return sampleBot(state, START_TIME, animated && !still)
  })
  const [effects, setEffects] = useState<BotEffects>(initial.effects)
  const handlers = useRef<Handlers>({ effects: setEffects, end: () => {} })

  useLayoutEffect(() => {
    handlers.current.end = (ended) => onMotionEnd?.(ended)
  })

  // layout effects, so every change is painted before the browser shows a stale frame. The
  // controller is made once; shape, face, options and motion reach it through the effects after it.
  useLayoutEffect(() => {
    const still = paused || reduced
    const at = still ? START_TIME - MOTION_STILLS[motion] : START_TIME
    const state = createBotState(shape, face, at, phase, still ? motion : 'idle')
    const created = createBotController(refs, state, handlers)
    controller.current = created
    return () => {
      created.destroy()
      controller.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useLayoutEffect(() => {
    controller.current?.setOptions({ animated, lookAtCursor, reduced, paused })
  }, [animated, lookAtCursor, reduced, paused])
  useLayoutEffect(() => {
    controller.current?.setShape(shape)
  }, [shape])
  useLayoutEffect(() => {
    controller.current?.setFace(face)
  }, [face])
  useLayoutEffect(() => {
    controller.current?.play(motion)
  }, [motion, motionKey, paused])
  // a newly mounted status dot needs placing even when nothing else is moving
  useLayoutEffect(() => {
    if (online) controller.current?.paint()
  }, [online])

  const blink = () => controller.current?.blink()

  return { initial, effects, blink }
}
