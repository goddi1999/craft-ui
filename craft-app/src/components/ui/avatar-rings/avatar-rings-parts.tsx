import { motion } from 'motion/react'
import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '@/lib/utils'

import type { RingTone } from './avatar-rings.types'
import { TONE_CLASS } from './avatar-rings.utils'

type RingFaceProps = {
  tone: RingTone
  src: string
  name: string
  ringWidth: number
  selected: boolean
  reduced: boolean
}

/** The coloured disc: padding is the ring, the image fills what is left. */
export function RingFace({ tone, src, name, ringWidth, selected, reduced }: RingFaceProps) {
  const width = selected ? ringWidth + 3 : ringWidth
  return (
    <motion.span
      data-slot="avatar-rings-ring"
      className={cn(
        'relative block size-(--avatar-size) rounded-full bg-(--ring-tone)',
        TONE_CLASS[tone],
      )}
      initial={false}
      animate={{ padding: width }}
      transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 30 }}
    >
      <img
        src={src}
        alt={name}
        draggable={false}
        className="block size-full rounded-full bg-[color-mix(in_oklch,var(--ring-tone)_22%,var(--background))] object-cover"
      />
      <motion.span
        data-slot="avatar-rings-check"
        aria-hidden
        className="absolute -right-0.5 -bottom-0.5 flex size-[28%] items-center justify-center rounded-full bg-(--ring-tone) text-white ring-2 ring-background"
        initial={false}
        animate={{ scale: selected ? 1 : 0, opacity: selected ? 1 : 0 }}
        transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 600, damping: 22 }}
      >
        <svg viewBox="0 0 12 12" className="size-3/5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2.5 6.5 5 9l4.5-5.5" />
        </svg>
      </motion.span>
    </motion.span>
  )
}

export function OverflowChip({
  count,
  className,
  ...props
}: ComponentPropsWithoutRef<'span'> & { count: number }) {
  return (
    <span
      data-slot="avatar-rings-overflow"
      role="img"
      aria-label={`${count} more`}
      className={cn(
        'flex size-(--avatar-size) items-center justify-center rounded-full bg-muted font-medium text-muted-foreground tabular-nums',
        className,
      )}
      {...props}
    >
      +{count}
    </span>
  )
}
