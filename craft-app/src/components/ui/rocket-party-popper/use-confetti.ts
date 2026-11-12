import { useEffect, useRef } from 'react'

import { createConfetti, type Confetti } from './rocket-party-popper.utils'

/** Gives a canvas a confetti burst; the frames stop when the component unmounts. */
export function useConfetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const confetti = useRef<Confetti | null>(null)

  useEffect(() => () => confetti.current?.stop(), [])

  const burst = (count: number, top: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    confetti.current ??= createConfetti(canvas)
    confetti.current.burst(count, top)
  }

  const clear = () => confetti.current?.stop()

  return { canvasRef, burst, clear }
}
