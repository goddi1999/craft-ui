import { useCallback, useEffect, useRef } from 'react'

import { MAX_FRAME_S, STEP_S } from './pin-shatter.constants'
import { paintBalls } from './pin-shatter.paint'
import { createBalls, stepBalls, type Ball, type Point } from './pin-shatter.physics'

/**
 * Owns one canvas and a frame loop that runs only while balls are visible.
 * `shatter` pops a pin of `pinRadius` at `origin` (canvas px) into rubber balls
 * of colour `fill`; `onComplete` fires when the last one has faded.
 * Nothing here touches React state per frame.
 */
export function usePinShatter(onComplete?: () => void) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(0)
  const completeRef = useRef(onComplete)
  completeRef.current = onComplete

  useEffect(() => () => cancelAnimationFrame(frameRef.current), [])

  const shatter = useCallback(
    (origin: Point, pinRadius: number, fill: string) => {
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (!canvas || !ctx) return false

      const ratio = window.devicePixelRatio || 1
      const bounds = { width: canvas.clientWidth, height: canvas.clientHeight }
      canvas.width = Math.round(bounds.width * ratio)
      canvas.height = Math.round(bounds.height * ratio)

      let balls: Ball[] = createBalls(origin, pinRadius)
      let last = performance.now()
      let carry = 0
      cancelAnimationFrame(frameRef.current)

      const tick = (now: number) => {
        carry += Math.min((now - last) / 1000, MAX_FRAME_S)
        last = now
        while (carry >= STEP_S) {
          balls = stepBalls(balls, STEP_S, bounds)
          carry -= STEP_S
        }
        paintBalls(ctx, balls, fill, ratio)
        if (balls.length > 0) {
          frameRef.current = requestAnimationFrame(tick)
        } else {
          completeRef.current?.()
        }
      }
      frameRef.current = requestAnimationFrame(tick)
      return true
    },
    [],
  )

  return { canvasRef, shatter }
}
