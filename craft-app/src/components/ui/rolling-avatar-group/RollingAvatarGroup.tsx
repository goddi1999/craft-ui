import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'

import { cn } from '@/lib/utils'

import { INSTANT, RING, SIZES, SLOT, SPRING_MORPH, TIP } from './rolling-avatar-group.constants'
import type { RollingAvatarGroupProps } from './rolling-avatar-group.types'
import { MemberAvatar, OverflowChip } from './rolling-avatar-group-parts'

const SLOT_CLASS = 'group/slot relative inline-flex flex-none items-center pointer-fine:hover:z-1'

/**
 * An overlapping stack of avatars with a +N overflow chip. A person joining or leaving opens or
 * closes their slot so the stack slides, and the count rolls the way it moved. Adapted from uiarc.
 */
export function RollingAvatarGroup({
  members,
  max = 4,
  size = 'md',
  label = 'Team members',
  className,
}: RollingAvatarGroupProps) {
  const reduced = useReducedMotion() === true
  const visible = members.slice(0, Math.max(0, max))
  const overflow = Math.max(0, members.length - visible.length)
  const transition = reduced ? INSTANT : SPRING_MORPH

  // remember which way the count moved, so the number rolls the same way
  const [count, setCount] = useState({ overflow, direction: 1 })
  if (count.overflow !== overflow) {
    setCount({ overflow, direction: overflow < count.overflow ? -1 : 1 })
  }

  return (
    <div
      data-slot="rolling-avatar-group"
      role="group"
      aria-label={label}
      className={cn('inline-flex items-center pl-1.5', SIZES[size].box, className)}
    >
      <AnimatePresence initial={false}>
        {visible.map((member) => (
          <motion.span
            key={member.name}
            className={cn(SLOT_CLASS, SIZES[size].box)}
            {...SLOT}
            transition={transition}
          >
            {/* avatars never move on hover; only the ring and the name answer the pointer */}
            <span className="relative -ml-1.5 inline-flex rounded-full">
              <MemberAvatar member={member} size={size} reduced={reduced} className={RING} />
              <span className={TIP} aria-hidden="true">
                {member.name}
              </span>
            </span>
          </motion.span>
        ))}
        {overflow > 0 ? (
          <motion.span
            key="overflow"
            className={cn(SLOT_CLASS, SIZES[size].box)}
            {...SLOT}
            transition={transition}
          >
            <OverflowChip
              count={overflow}
              direction={count.direction}
              label={label}
              size={size}
              reduced={reduced}
            />
          </motion.span>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
