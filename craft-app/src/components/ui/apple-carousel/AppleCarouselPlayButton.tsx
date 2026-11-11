import { motion } from 'motion/react'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

import {
  ICON_STROKE_WIDTH,
  ICON_TRANSITION,
  INSTANT_TRANSITION,
  PAUSE_ICON,
  PLAY_ICON,
} from './apple-carousel.constants'
import { useAppleCarousel } from './apple-carousel.context'

export function AppleCarouselPlayButton({
  className,
  onClick,
  ...props
}: ComponentProps<'button'>) {
  const { isPlaying, prefersReducedMotion, play, pause } = useAppleCarousel()
  // The icon names the action, so a playing gallery shows pause.
  const icon = isPlaying ? PAUSE_ICON : PLAY_ICON
  const transition = prefersReducedMotion ? INSTANT_TRANSITION : ICON_TRANSITION

  return (
    <button
      type="button"
      aria-label={isPlaying ? 'Pause gallery' : 'Play gallery'}
      data-slot="apple-carousel-play-button"
      className={cn(
        'flex size-14 items-center justify-center rounded-full bg-muted text-foreground group-data-[size=sm]/apple-carousel-controls:size-11',
        'transition-[background-color,scale] duration-150 ease-out hover:bg-muted/80 active:scale-97 motion-reduce:active:scale-100',
        'focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring',
        className,
      )}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        if (isPlaying) pause()
        else play()
      }}
      {...props}
    >
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={ICON_STROKE_WIDTH}
        strokeLinejoin="round"
        className="size-6 group-data-[size=sm]/apple-carousel-controls:size-5"
      >
        <motion.path initial={false} animate={{ d: icon.left }} transition={transition} />
        <motion.path
          initial={false}
          animate={{ d: icon.right }}
          transition={transition}
        />
      </svg>
    </button>
  )
}
