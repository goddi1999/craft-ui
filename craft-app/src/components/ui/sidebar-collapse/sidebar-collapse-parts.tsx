import { useEffect, type ReactNode } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'motion/react'

import { cn } from '@/lib/utils'

import { LABEL_DELAY_MS, LABEL_SHIFT, LABEL_SPRING } from './sidebar-collapse.constants'
import { clamp01, settle } from './sidebar-collapse.utils'

/** A label on its own spring, so opening can start each one a little later down the list. */
export function NavLabel({
  open,
  index,
  stagger,
  reduced,
  className,
  children,
}: {
  open: boolean
  index: number
  stagger: number
  reduced: boolean
  className?: string
  children: ReactNode
}) {
  const reveal = useMotionValue(open ? 1 : 0)
  const opacity = useTransform(reveal, clamp01)
  const x = useTransform(reveal, (r) => (1 - clamp01(r)) * LABEL_SHIFT)

  useEffect(() => {
    // opening cascades down the list, closing hides every label at once
    const delay = open ? (LABEL_DELAY_MS + index * stagger) / 1000 : 0
    const controls = animate(reveal, open ? 1 : 0, { ...settle(LABEL_SPRING, reduced), delay })
    return () => controls.stop()
  }, [open, index, stagger, reduced, reveal])

  return (
    <motion.span
      className={cn('inline-block shrink-0 truncate whitespace-nowrap', className)}
      style={{ opacity, x }}
    >
      {children}
    </motion.span>
  )
}

export function Monogram({ title }: { title: string }) {
  return (
    <span
      aria-hidden
      className="grid size-7 place-items-center rounded-lg bg-primary text-[13px] font-semibold text-primary-foreground"
    >
      {title.charAt(0)}
    </span>
  )
}
