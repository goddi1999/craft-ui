import { AnimatePresence, motion } from 'motion/react'
import { useLayoutEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

import {
  DURATION,
  EASE_ENTER,
  FADE,
  INSTANT,
  RING,
  RISE,
  SIZES,
  SPRING_SNAPPY,
  STATUS,
} from './rolling-avatar-group.constants'
import type { RollingAvatarGroupMember, RollingAvatarGroupSize } from './rolling-avatar-group.types'
import { initialsOf } from './rolling-avatar-group.utils'

/** uiarc's avatar, vendored: initials until a photo loads, and an optional presence dot. */
export function MemberAvatar({
  member,
  size,
  reduced,
  className,
}: {
  member: RollingAvatarGroupMember
  size: RollingAvatarGroupSize
  reduced: boolean
  className?: string
}) {
  const { name, src, status } = member
  const image = useRef<HTMLImageElement>(null)
  const [failedSrc, setFailedSrc] = useState<string>()

  // a photo that is already decoded shows at once; one still loading waits, then fades in from a blur
  useLayoutEffect(() => {
    const node = image.current
    if (node && !node.complete) node.dataset.loading = ''
  }, [src])

  const showImage = src && failedSrc !== src

  return (
    <span
      role="img"
      aria-label={`${name}${status ? `, ${status}` : ''}`}
      className={cn(
        'relative inline-grid flex-none place-items-center rounded-full border border-border bg-muted font-medium text-foreground',
        SIZES[size].avatar,
        className,
      )}
    >
      {showImage ? (
        <img
          key={src}
          ref={image}
          src={src}
          alt=""
          decoding="async"
          loading="lazy"
          onLoad={(event) => {
            delete event.currentTarget.dataset.loading
          }}
          onError={() => setFailedSrc(src)}
          className="pointer-events-none absolute inset-0 size-full rounded-[inherit] object-cover transition-[opacity,filter] duration-240 ease-[cubic-bezier(.16,1,.3,1)] data-loading:opacity-0 data-loading:blur-[4px] data-loading:transition-none motion-reduce:transition-none motion-reduce:data-loading:blur-none"
        />
      ) : (
        // initials fade in only when they replace a photo that failed
        <motion.span
          aria-hidden="true"
          initial={src && !reduced ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: DURATION.standard, ease: EASE_ENTER }}
        >
          {initialsOf(name)}
        </motion.span>
      )}
      <AnimatePresence initial={false}>
        {status ? (
          <motion.i
            key={status}
            aria-hidden="true"
            className={cn(
              'absolute right-0 bottom-0 z-2 rounded-full border-card ring-1 ring-border/70',
              SIZES[size].dot,
              STATUS[status],
            )}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{
              opacity: 0,
              scale: 0.6,
              transition: { duration: reduced ? 0 : DURATION.fast },
            }}
            transition={reduced ? INSTANT : SPRING_SNAPPY}
          />
        ) : null}
      </AnimatePresence>
    </span>
  )
}

/** The +N chip; its number rolls up when it grows and down when it shrinks. */
export function OverflowChip({
  count,
  direction,
  label,
  size,
  reduced,
}: {
  count: number
  direction: number
  label: string
  size: RollingAvatarGroupSize
  reduced: boolean
}) {
  return (
    <span
      role="img"
      aria-label={`${count} more ${label.toLowerCase()}`}
      className={cn(
        'relative -ml-1.5 inline-grid place-items-center overflow-hidden rounded-full bg-muted font-medium text-muted-foreground tabular-nums',
        SIZES[size].avatar,
        RING,
      )}
    >
      <AnimatePresence mode="popLayout" initial={false} custom={direction}>
        <motion.span
          key={count}
          aria-hidden="true"
          className="inline-block"
          custom={direction}
          variants={reduced ? FADE : RISE}
          initial="hidden"
          animate="shown"
          exit="gone"
        >
          +{count}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
