import { useEffect } from 'react'
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  type AnimationPlaybackControls,
  type MotionValue,
} from 'motion/react'

import { cn } from '@/lib/utils'

import {
  ACCEPT_STAGGER_MS,
  BLINK_S,
  FADE_SPRING,
  HOP_SPRING,
  HOP_VELOCITY,
  OFFER_STAGGER_MS,
  TAB_MAX,
  TAB_MIN_SCALE,
} from './ghost-suggestion.constants'
import { clamp, springFor } from './ghost-suggestion.utils'

/** One suggested letter: fades in dim, and on accept brightens with a small hop. */
export function GhostLetter({
  char,
  index,
  accepted,
  reduced,
}: {
  char: string
  index: number
  accepted: boolean
  reduced: boolean
}) {
  const opacity = useMotionValue(0)
  const y = useMotionValue(0)
  const delayMs = index * (accepted ? ACCEPT_STAGGER_MS : OFFER_STAGGER_MS)

  useEffect(() => {
    const delay = delayMs / 1000
    const running: AnimationPlaybackControls[] = [
      animate(opacity, 1, { ...springFor(FADE_SPRING, reduced), delay }),
    ]
    // target and rest are both 0, so only the kick moves it
    if (accepted && !reduced) {
      running.push(animate(y, 0, { ...HOP_SPRING, velocity: HOP_VELOCITY, delay }))
    }
    return () => running.forEach((controls) => controls.stop())
  }, [accepted, delayMs, reduced, opacity, y])

  return (
    <motion.span
      className={cn(
        'inline-block whitespace-pre transition-[color] duration-[180ms] ease-[ease]',
        accepted ? 'text-foreground' : 'text-muted-foreground',
      )}
      // the colour waits its turn in the same stagger as the hop
      style={{ opacity, y, transitionDelay: accepted ? `${delayMs}ms` : undefined }}
    >
      {char}
    </motion.span>
  )
}

/** Solid while typing, blinking while a suggestion waits. */
export function Caret({ blinking }: { blinking: boolean }) {
  return (
    <motion.span
      aria-hidden
      className="mx-px inline-block h-[1.15em] w-0.5 rounded-full bg-foreground align-[-0.2em]"
      animate={{ opacity: blinking ? [1, 1, 0, 0] : 1 }}
      transition={
        blinking
          ? { duration: BLINK_S, times: [0, 0.5, 0.5, 1], ease: 'linear', repeat: Infinity }
          : { duration: 0 }
      }
    />
  )
}

/** The Tab keycap; `progress` 0 is hidden and small, 1 is shown. */
export function TabKey({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, (t) => clamp(t, 0, 1))
  const scale = useTransform(
    progress,
    (t) => TAB_MIN_SCALE + (1 - TAB_MIN_SCALE) * clamp(t, 0, TAB_MAX),
  )

  return (
    <motion.span
      aria-hidden
      className="ml-2 inline-block rounded-sm bg-foreground/[0.14] px-[7px] py-px align-[0.08em] text-[11px] leading-[18px] font-semibold text-foreground/80"
      style={{ opacity, scale }}
    >
      Tab
    </motion.span>
  )
}
