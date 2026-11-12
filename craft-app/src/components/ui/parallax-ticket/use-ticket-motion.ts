import {
  animate,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react'
import { useEffect, useRef, type PointerEvent } from 'react'

import {
  FLIP_KICK,
  FLIP_SPRING,
  FLOAT_X,
  FLOAT_X_SPEED,
  FLOAT_Y,
  FLOAT_Y_SPEED,
  GLARE_DRIFT,
  GLARE_REST_X,
  GLARE_REST_Y,
  GLARE_SPRING,
  IDLE_GLARE,
  IMAGE_DEPTH,
  LIFT_SPRING,
  PRESS_SCALE,
  TEXT_DEPTH,
  TILT_SPRING,
} from './parallax-ticket.constants'
import { clamp, settle } from './parallax-ticket.utils'

type UseTicketMotionOptions = {
  flipped: boolean
  tilt: number
  depth: number
  reduced: boolean
}

/**
 * Tilt, parallax, glare, press and flip as motion values. The card tilts toward the
 * pointer, each layer slides by its own depth, and untouched it floats on its own.
 */
export function useTicketMotion({ flipped, tilt, depth, reduced }: UseTicketMotionOptions) {
  const tiltTargetX = useMotionValue(0)
  const tiltTargetY = useMotionValue(0)
  const rotateX = useSpring(tiltTargetX, settle(TILT_SPRING, reduced))
  const rotateY = useSpring(tiltTargetY, settle(TILT_SPRING, reduced))
  const glareTarget = useMotionValue(IDLE_GLARE)
  const glare = useSpring(glareTarget, settle(GLARE_SPRING, reduced))
  const hovering = useMotionValue(0)
  const pointerX = useMotionValue(GLARE_REST_X)
  const pointerY = useMotionValue(GLARE_REST_Y)
  const flip = useMotionValue(flipped ? 180 : 0)
  const lift = useMotionValue(1)
  const pressed = useRef(false)
  const wasFlipped = useRef(flipped)

  // the float is decorative, so reduced motion keeps the card still until pointed at
  useAnimationFrame((time) => {
    if (hovering.get()) return
    const seconds = time / 1000
    tiltTargetX.set(reduced ? 0 : Math.sin(seconds * FLOAT_X_SPEED) * FLOAT_X)
    tiltTargetY.set(reduced ? 0 : Math.cos(seconds * FLOAT_Y_SPEED) * FLOAT_Y)
  })

  // layers slide against the tilt; a tilt of 0 still floats, so never divide by it
  const span = Math.max(tilt, 1)
  const shiftX = useTransform(rotateY, (deg) => deg / span)
  const shiftY = useTransform(rotateX, (deg) => -deg / span)
  const imageX = useTransform(shiftX, (shift) => shift * depth * IMAGE_DEPTH)
  const imageY = useTransform(shiftY, (shift) => shift * depth * IMAGE_DEPTH)
  const textX = useTransform(shiftX, (shift) => shift * depth * TEXT_DEPTH)
  const textY = useTransform(shiftY, (shift) => shift * depth * TEXT_DEPTH)

  // under the pointer the glare sits right on it, otherwise it drifts with the float
  const glareX = useTransform([hovering, pointerX, shiftX], ([on, at, shift]: number[]) =>
    on ? at : GLARE_REST_X + shift * GLARE_DRIFT,
  )
  const glareY = useTransform([hovering, pointerY, shiftY], ([on, at, shift]: number[]) =>
    on ? at : GLARE_REST_Y + shift * GLARE_DRIFT,
  )
  const glareImage = useMotionTemplate`radial-gradient(240px circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.22), transparent 60%)`
  const glareOpacity = useTransform(glare, (value) => clamp(value, 0, 1))

  const turn = useTransform([rotateY, flip], ([tiltY, flipY]: number[]) => tiltY + flipY)
  // rotate first, then scale, the same order as the source
  const transform = useMotionTemplate`rotateX(${rotateX}deg) rotateY(${turn}deg) scale(${lift})`

  useEffect(() => {
    if (wasFlipped.current === flipped) return
    wasFlipped.current = flipped
    animate(flip, flipped ? 180 : 0, settle(FLIP_SPRING, reduced))
    if (reduced) return
    animate(lift, pressed.current ? PRESS_SCALE : 1, {
      ...LIFT_SPRING,
      velocity: lift.getVelocity() + FLIP_KICK,
    })
  }, [flipped, reduced, flip, lift])

  // letting go anywhere ends the press, like the source's window listener
  useEffect(() => {
    const release = () => {
      if (!pressed.current) return
      pressed.current = false
      animate(lift, 1, settle(LIFT_SPRING, reduced))
    }
    window.addEventListener('pointerup', release)
    window.addEventListener('pointercancel', release)
    return () => {
      window.removeEventListener('pointerup', release)
      window.removeEventListener('pointercancel', release)
    }
  }, [lift, reduced])

  useEffect(
    () => () => {
      flip.stop()
      lift.stop()
    },
    [flip, lift],
  )

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    const nx = clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1)
    const ny = clamp(((event.clientY - rect.top) / rect.height) * 2 - 1, -1, 1)
    pointerX.set((nx + 1) * 50)
    pointerY.set((ny + 1) * 50)
    tiltTargetX.set(-ny * tilt)
    tiltTargetY.set(nx * tilt)
    hovering.set(1)
    glareTarget.set(1)
  }

  function handlePointerLeave() {
    hovering.set(0)
    glareTarget.set(IDLE_GLARE)
  }

  function handlePointerDown() {
    pressed.current = true
    animate(lift, PRESS_SCALE, settle(LIFT_SPRING, reduced))
  }

  return {
    transform,
    imageX,
    imageY,
    textX,
    textY,
    glareImage,
    glareOpacity,
    stageHandlers: {
      onPointerMove: handlePointerMove,
      onPointerLeave: handlePointerLeave,
      onPointerDown: handlePointerDown,
    },
  }
}
