import { useTransform, type MotionValue } from 'motion/react'

import { INSET } from './image-compare.constants'
import type { Metrics } from './image-compare.types'
import { clamp, fade, halfPlane, lerp, soften } from './image-compare.utils'

type Values = {
  /** The committed position, in percent. */
  pos: MotionValue<number>
  /** A catch-up offset added to the position while the divider glides to a press. */
  lag: MotionValue<number>
  /** The divider's angle: 0 is a vertical line, 90 a horizontal one. */
  theta: MotionValue<number>
  metrics: MotionValue<Metrics>
}

const pct = (value: number) => `${value.toFixed(3)}%`

/**
 * Everything the divider draws, derived from its position and angle. At rest every style is a
 * percentage, so a resize never lags; only a turn in progress uses pixels.
 */
export function useDividerStyles({ pos, lag, theta, metrics }: Values) {
  const shown = useTransform(() => pos.get() + lag.get())
  const turn = useTransform(() => clamp(theta.get() / 90, 0, 1))

  // the divider's pivot in px, blending from the horizontal to the vertical layout as it turns
  const center = (p: number, m: Metrics): [number, number] => [
    lerp((p / 100) * m.w, m.w / 2, turn.get()),
    lerp(m.h / 2, (p / 100) * m.h, turn.get()),
  ]
  const atRest = (angle: number, m: Metrics) => angle === 0 || angle === 90 || !m.w

  const clipPath = useTransform(() => {
    const angle = theta.get()
    const p = clamp(shown.get(), 0, 100)
    const m = metrics.get()
    if (angle === 0 || !m.w) {
      return angle >= 45 ? `inset(0 0 ${pct(100 - p)} 0)` : `inset(0 ${pct(100 - p)} 0 0)`
    }
    if (angle === 90) return `inset(0 0 ${pct(100 - p)} 0)`
    return halfPlane(m.w, m.h, center(p, m), (angle * Math.PI) / 180)
  })

  const pivotX = useTransform(() => {
    const angle = theta.get()
    const m = metrics.get()
    if (!atRest(angle, m)) return `${center(shown.get(), m)[0]}px`
    return angle >= 45 ? '50%' : `${shown.get()}%`
  })
  const pivotY = useTransform(() => {
    const angle = theta.get()
    const m = metrics.get()
    if (!atRest(angle, m)) return `${center(shown.get(), m)[1]}px`
    return angle >= 45 ? `${shown.get()}%` : '50%'
  })

  // how far the handle sits from the line along the drag axis, so it stays whole near an edge
  const offset = () => {
    const m = metrics.get()
    if (!m.w) return 0
    const p = shown.get()
    const x = (p / 100) * m.w
    const y = (p / 100) * m.h
    return lerp(soften(x, m.w) - x, soften(y, m.h) - y, turn.get())
  }
  const handleX = useTransform(() => offset() * Math.cos((theta.get() * Math.PI) / 180))
  const handleY = useTransform(() => offset() * Math.sin((theta.get() * Math.PI) / 180))

  // captions fade as the divider reaches them, and hand over mid-turn when the after caption
  // changes corner
  const beforeOpacity = useTransform(() => {
    const m = metrics.get()
    const k = turn.get()
    const p = clamp(shown.get(), 0, 100)
    const across = clamp(1 - k * 3, 0, 1)
    const down = clamp(k * 3 - 2, 0, 1)
    if (!m.w) return across + down
    return (
      across * fade((p / 100) * m.w - (INSET + m.bw + 8)) +
      down * fade((p / 100) * m.h - (INSET + m.bh + 8))
    )
  })
  const afterAcross = useTransform(() => {
    const m = metrics.get()
    const k = clamp(1 - turn.get() * 3, 0, 1)
    if (!m.w) return k
    return k * fade(m.w - INSET - m.aw - 8 - (clamp(shown.get(), 0, 100) / 100) * m.w)
  })
  const afterDown = useTransform(() => {
    const m = metrics.get()
    const k = clamp(turn.get() * 3 - 2, 0, 1)
    if (!m.w) return k
    return k * fade(m.h - INSET - m.ah - 8 - (clamp(shown.get(), 0, 100) / 100) * m.h)
  })

  return { clipPath, pivotX, pivotY, handleX, handleY, beforeOpacity, afterAcross, afterDown }
}
