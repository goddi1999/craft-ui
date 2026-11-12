import { motion, useTransform, type MotionValue } from 'motion/react'

import { DOT_COLORS, DOT_SHRINK, HEART_PATH, ROW, SQUASH_LIMIT } from './like-burst.constants'
import { clamp01, dotOffset } from './like-burst.utils'

export function Heart({
  squash,
  fill,
}: {
  squash: MotionValue<number>
  fill: MotionValue<number>
}) {
  // squashed it gets wider, stretched it only gets taller
  const scaleX = useTransform(squash, (s) => s * (2 - Math.min(s, SQUASH_LIMIT)))
  const fillOpacity = useTransform(fill, clamp01)
  // the outline turns red halfway through the fill, not gradually
  const hot = useTransform(fill, (f) => (f > 0.5 ? 1 : 0))
  const cold = useTransform(hot, (h) => 1 - h)

  return (
    <motion.svg
      viewBox="0 0 24 24"
      aria-hidden
      className="absolute inset-0 size-full overflow-visible"
      style={{ scaleX, scaleY: squash }}
    >
      <motion.path
        d={HEART_PATH}
        fill="none"
        strokeWidth={1.9}
        strokeLinejoin="round"
        className="stroke-foreground/80"
        style={{ strokeOpacity: cold }}
      />
      <motion.path
        d={HEART_PATH}
        strokeWidth={1.9}
        strokeLinejoin="round"
        className="fill-(--like-heart) stroke-(--like-heart)"
        style={{ fillOpacity, strokeOpacity: hot }}
      />
    </motion.svg>
  )
}

function BurstDot({
  index,
  color,
  progress,
}: {
  index: number
  color: string
  progress: MotionValue<number>
}) {
  const x = useTransform(progress, (k) => dotOffset(index, k).x)
  const y = useTransform(progress, (k) => dotOffset(index, k).y)
  const scale = useTransform(progress, (k) => 1 - DOT_SHRINK * k)
  const opacity = useTransform(progress, (k) => (k >= 1 ? 0 : 1 - k * k))

  return (
    <motion.span
      className="absolute -top-[3px] -left-[3px] size-1.5 rounded-full"
      style={{ x, y, scale, opacity, backgroundColor: color }}
    />
  )
}

export function BurstDots({ progress }: { progress: MotionValue<number> }) {
  return (
    <span className="absolute top-1/2 left-1/2">
      {DOT_COLORS.map((color, index) => (
        <BurstDot key={index} index={index} color={color} progress={progress} />
      ))}
    </span>
  )
}

export function CountRoll({
  count,
  roll,
  pressed,
}: {
  count: number
  roll: MotionValue<number>
  pressed: boolean
}) {
  const y = useTransform(roll, (r) => -ROW * r)

  return (
    // h-[22px] is ROW: one number shows at a time and the column slides up by one row
    <span className="relative h-[22px] overflow-hidden tabular-nums">
      <motion.span className="flex flex-col" style={{ y }}>
        <span aria-hidden={pressed} className="block h-[22px] leading-[22px]">
          {count.toLocaleString()}
        </span>
        <span aria-hidden={!pressed} className="block h-[22px] leading-[22px]">
          {(count + 1).toLocaleString()}
        </span>
      </motion.span>
    </span>
  )
}
