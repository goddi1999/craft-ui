import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'

import {
  DEFAULT_GREETINGS,
  FADE,
  FINAL_HOLD,
  MIN_INTERVAL,
  OVERLAY_EXIT,
} from './intro-loader.constants'
import type { IntroLoaderProps } from './intro-loader.types'
import { toGreeting, toSpeed } from './intro-loader.utils'
import {
  Backlight,
  Greeting,
  ProgressLine,
  ReplayButton,
  SkipButton,
} from './intro-loader-parts'
import { useGreetingCycle } from './use-greeting-cycle'

const LAYER = 'flex flex-col items-center justify-center overflow-hidden select-none'

/**
 * An Apple-style welcome splash. Greetings in many languages blur in one after another, a
 * hairline tracks the progress, and Skip or Escape ends it early. Full screen by default; inline
 * it leaves a Replay button behind. Reduced motion skips straight to a fade.
 */
export function IntroLoader({
  greetings = DEFAULT_GREETINGS,
  onComplete,
  fullScreen = true,
  intervalMs = 240,
  showProgress = true,
  showLangBadge = true,
  allowSkip = true,
  speedMultiplier = 1,
  className,
  ...props
}: IntroLoaderProps) {
  const reduced = useReducedMotion() ?? false
  const list = greetings.map(toGreeting)
  const speed = toSpeed(speedMultiplier)
  const { index, playing, run, finish, replay } = useGreetingCycle({
    count: list.length,
    interval: Math.max(MIN_INTERVAL, Math.round(intervalMs / speed)),
    finalHold: Math.round(FINAL_HOLD / speed),
    reduced,
    skippable: allowSkip,
    onComplete,
  })
  // an empty list shows nothing rather than reading past the end
  const current = list[index] ?? { text: '' }
  const progress = list.length ? ((index + 1) / list.length) * 100 : 100

  const exit = reduced ? { opacity: 0 } : { opacity: 0, scale: 1.02, filter: 'blur(12px)' }
  const transition = reduced ? FADE : OVERLAY_EXIT

  const scene = (
    <>
      <Backlight />
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        <span lang={current.lang?.toLowerCase()}>{current.text}</span>
      </div>
      {allowSkip && <SkipButton onSkip={finish} reduced={reduced} />}
      <Greeting greeting={current} index={index} badge={showLangBadge} reduced={reduced} />
      {showProgress && <ProgressLine value={progress} />}
    </>
  )

  if (fullScreen) {
    return (
      <AnimatePresence>
        {playing && (
          <motion.div
            key={run}
            data-slot="intro-loader"
            role="dialog"
            aria-modal
            aria-label="Welcome intro screen"
            initial={{ opacity: 1 }}
            exit={exit}
            transition={transition}
            className={cn(LAYER, 'fixed inset-0 z-[100] bg-background text-foreground', className)}
            {...props}
          >
            {scene}
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  return (
    <div
      data-slot="intro-loader"
      className={cn('relative h-80 w-full text-foreground sm:h-96', className)}
      {...props}
    >
      <AnimatePresence mode="wait">
        {playing ? (
          <motion.div
            key={run}
            role="dialog"
            aria-label="Welcome intro screen"
            initial={{ opacity: 1 }}
            exit={exit}
            transition={transition}
            className={cn(LAYER, 'absolute inset-0')}
          >
            {scene}
          </motion.div>
        ) : (
          <ReplayButton key="replay" onReplay={replay} reduced={reduced} />
        )}
      </AnimatePresence>
    </div>
  )
}
