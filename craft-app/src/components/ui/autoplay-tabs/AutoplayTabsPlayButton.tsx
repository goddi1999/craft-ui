import { motion } from 'motion/react'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

import {
  ICON_STROKE_WIDTH,
  ICON_TRANSITION,
  INSTANT_TRANSITION,
  PAUSE_ICON,
  PLAY_ICON,
} from './autoplay-tabs.constants'
import { useAutoplayTabs } from './autoplay-tabs.context'

export function AutoplayTabsPlayButton({
  className,
  onClick,
  ...props
}: ComponentProps<'button'>) {
  const { isPlaying, prefersReducedMotion, play, pause } = useAutoplayTabs()
  // The icon names the action, so a playing run shows pause.
  const icon = isPlaying ? PAUSE_ICON : PLAY_ICON
  const transition = prefersReducedMotion ? INSTANT_TRANSITION : ICON_TRANSITION

  return (
    <button
      type="button"
      aria-label={isPlaying ? 'Pause' : 'Play'}
      data-slot="autoplay-tabs-play-button"
      className={cn(
        'flex size-14 items-center justify-center rounded-full bg-muted text-foreground group-data-[size=sm]/autoplay-tabs:size-11',
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
        className="size-6 group-data-[size=sm]/autoplay-tabs:size-5"
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
