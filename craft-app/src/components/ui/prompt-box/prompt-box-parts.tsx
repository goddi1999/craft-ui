import type { ComponentProps } from 'react'
import { ArrowUp } from 'lucide-react'
import { motion, useTransform, type MotionValue } from 'motion/react'

import { cn } from '@/lib/utils'

import {
  ARROW_TURN,
  DONE_DOT,
  DOT_FADE,
  MORPH_LIMIT,
  PULSE,
  SHINE,
  SHIMMER_TEXT,
  STATUS_HEIGHT,
} from './prompt-box.constants'
import { clamp } from './prompt-box.utils'

/** The line above the text: a pulsing dot and shimmering label while thinking, green when done. */
export function StatusLine({
  open,
  thinking,
  reduced,
  label,
}: {
  open: MotionValue<number>
  thinking: boolean
  reduced: boolean
  label: string
}) {
  const height = useTransform(open, (v) => Math.max(0, v) * STATUS_HEIGHT)
  const opacity = useTransform(open, (v) => clamp(v, 0, 1))
  // the loops are decoration, reduced motion keeps them still
  const looping = thinking && !reduced

  return (
    <motion.div
      aria-live="polite"
      className="flex items-center gap-2 overflow-hidden text-[13px] font-medium text-muted-foreground"
      style={{ height, opacity }}
    >
      <motion.span
        aria-hidden
        className={cn(
          'size-2 shrink-0 rounded-full transition-colors duration-[250ms] ease-[ease]',
          thinking ? 'bg-foreground' : DONE_DOT,
        )}
        animate={looping ? { scale: [1, 0.55, 1], opacity: [1, 0.5, 1] } : { scale: 1, opacity: 1 }}
        transition={looping ? PULSE : DOT_FADE}
      />
      <motion.span
        className={cn(looping ? SHIMMER_TEXT : thinking ? 'text-muted-foreground' : 'text-foreground/80')}
        animate={{ backgroundPosition: looping ? ['0% 0%', '-200% 0%'] : '0% 0%' }}
        transition={looping ? SHINE : { duration: 0 }}
      >
        {label}
      </motion.span>
    </motion.div>
  )
}

/** Send, or Stop while busy: the arrow spins away as the square grows in. */
export function SendButton({
  morph,
  ready,
  className,
  ...props
}: Omit<ComponentProps<'button'>, 'children'> & {
  morph: MotionValue<number>
  ready: boolean
}) {
  const m = useTransform(morph, (v) => clamp(v, 0, MORPH_LIMIT))
  const arrowScale = useTransform(m, (v) => Math.max(0, 1 - v))
  const arrowRotate = useTransform(m, (v) => v * ARROW_TURN)

  return (
    <button
      type="button"
      className={cn(
        'relative size-8 shrink-0 cursor-pointer rounded-full outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring',
        ready
          ? 'bg-primary text-primary-foreground'
          : 'cursor-default bg-foreground/[0.14] text-muted-foreground',
        className,
      )}
      {...props}
    >
      <motion.span
        aria-hidden
        className="absolute inset-0 grid place-items-center"
        style={{ scale: arrowScale, rotate: arrowRotate }}
      >
        <ArrowUp className="size-4" strokeWidth={2.4} />
      </motion.span>
      <motion.span
        aria-hidden
        className="absolute inset-0 grid place-items-center"
        style={{ scale: m }}
      >
        <span className="size-2.5 rounded-[2.5px] bg-current" />
      </motion.span>
    </button>
  )
}
