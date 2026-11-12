import { useEffect, type MouseEvent } from 'react'
import { animate, motion, useMotionValue, useTransform, type MotionValue } from 'motion/react'

import { cn } from '@/lib/utils'

import {
  BADGE_FILL,
  CROSS_DEGREES,
  CROSS_OVERSHOOT,
  LINE_OFFSET,
  LINK_RISE,
  LINK_SPRING,
} from './dynamic-menu.constants'
import type { DynamicMenuItem } from './dynamic-menu.types'
import { clamp, linkDelay, withReducedMotion } from './dynamic-menu.utils'

const LINE = 'absolute inset-x-[3px] top-[11px] h-0.5 rounded-[2px] bg-current'

/** Two lines 8px apart that meet in the middle and turn into a cross. */
export function ToggleIcon({ progress }: { progress: MotionValue<number> }) {
  // a little overshoot is the bounce; past that the lines would cross over
  const cross = useTransform(progress, (t) => clamp(t, -CROSS_OVERSHOOT, 1 + CROSS_OVERSHOOT))
  const topY = useTransform(cross, (x) => -LINE_OFFSET * (1 - x))
  const bottomY = useTransform(cross, (x) => LINE_OFFSET * (1 - x))
  const topRotate = useTransform(cross, (x) => CROSS_DEGREES * x)
  const bottomRotate = useTransform(cross, (x) => -CROSS_DEGREES * x)

  return (
    <span aria-hidden className="relative size-6 shrink-0">
      <motion.span className={LINE} style={{ y: topY, rotate: topRotate }} />
      <motion.span className={LINE} style={{ y: bottomY, rotate: bottomRotate }} />
    </span>
  )
}

/** One link row: rises in after its turn when the menu opens, drops away in reverse. */
export function MenuLink({
  item,
  index,
  count,
  open,
  reduced,
  onSelect,
}: {
  item: DynamicMenuItem
  index: number
  count: number
  open: boolean
  reduced: boolean
  onSelect: (item: DynamicMenuItem, event: MouseEvent<HTMLAnchorElement>) => void
}) {
  const progress = useMotionValue(open ? 1 : 0)
  const opacity = useTransform(progress, (p) => clamp(p, 0, 1))
  const y = useTransform(progress, (p) => (1 - p) * LINK_RISE)

  // a timer, not a transition delay: until its turn the row keeps moving the way it was going
  useEffect(() => {
    const timer = window.setTimeout(() => {
      animate(progress, open ? 1 : 0, withReducedMotion(LINK_SPRING, reduced))
    }, linkDelay(index, count, open))
    return () => window.clearTimeout(timer)
  }, [open, index, count, reduced, progress])

  useEffect(() => () => progress.stop(), [progress])

  return (
    <motion.li style={{ opacity, y }}>
      <a
        href={item.href}
        onClick={(event) => onSelect(item, event)}
        className="flex h-12 items-center justify-between gap-3 rounded-xl px-2.5 text-[22px] font-semibold tracking-[-0.02em] outline-none hover:bg-foreground/5 focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="truncate">{item.label}</span>
        {item.badge === undefined ? null : (
          <span
            className={cn(
              'shrink-0 rounded-full px-2 py-[3px] text-xs font-medium tracking-normal text-muted-foreground',
              BADGE_FILL,
            )}
          >
            {item.badge}
          </span>
        )}
      </a>
    </motion.li>
  )
}
