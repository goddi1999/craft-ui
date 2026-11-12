import { RotateCw, X } from 'lucide-react'
import { motion } from 'motion/react'

import { cn } from '@/lib/utils'

import { FOCUS_RING, GREETING_IN, PROGRESS, SKIP_IN, SPRING_GENTLE } from './intro-loader.constants'
import type { GreetingItem } from './intro-loader.types'

// a soft glow behind the greeting
export function Backlight() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
    >
      <div className="size-72 rounded-full bg-foreground/[0.035] blur-[80px] sm:size-96" />
    </div>
  )
}

export function SkipButton({ onSkip, reduced }: { onSkip: () => void; reduced: boolean }) {
  return (
    <motion.button
      type="button"
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={SKIP_IN}
      onClick={onSkip}
      aria-label="Skip welcome sequence"
      className={cn(
        'absolute top-4 right-4 z-20 flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-card/90 px-3 py-1.5 font-mono text-[11px] text-muted-foreground shadow-sm backdrop-blur-md transition-colors hover:border-foreground/20 hover:bg-muted hover:text-foreground sm:top-6 sm:right-6',
        FOCUS_RING,
      )}
    >
      <span>Skip</span>
      <kbd className="hidden rounded border border-border bg-muted px-1 text-[9px] text-muted-foreground sm:inline-block">
        ESC
      </kbd>
      <X className="size-3 sm:hidden" aria-hidden />
    </motion.button>
  )
}

export function Greeting({
  greeting,
  index,
  badge,
  reduced,
}: {
  greeting: GreetingItem
  index: number
  badge: boolean
  reduced: boolean
}) {
  return (
    <div className="relative z-10 mx-auto flex max-w-lg flex-col items-center justify-center px-4 text-center">
      {/* keyed so every greeting blurs in fresh */}
      <motion.div
        key={index}
        initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 10, filter: 'blur(8px)' }}
        animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
        transition={GREETING_IN}
        className="relative flex items-center justify-center text-center"
      >
        <span
          lang={greeting.lang?.toLowerCase()}
          className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl md:text-5xl"
        >
          {greeting.text}
        </span>
        {/* hangs off the right edge so the greeting stays centred */}
        {badge && greeting.lang && (
          <span
            aria-hidden
            className="absolute top-1/2 left-full ml-3 -translate-y-1/2 rounded-md border border-border bg-muted px-1.5 py-1 font-mono text-[10px] leading-none font-medium tracking-wider text-muted-foreground"
          >
            {greeting.lang}
          </span>
        )}
      </motion.div>
    </div>
  )
}

// an apple-style hairline under the greeting
export function ProgressLine({ value }: { value: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-8 bottom-6 h-[2px] overflow-hidden rounded-full bg-foreground/[0.08] sm:inset-x-1/3 sm:bottom-8"
    >
      <motion.div
        className="h-full rounded-full bg-linear-to-r from-foreground/40 via-foreground to-foreground/70"
        animate={{ width: `${value}%` }}
        transition={PROGRESS}
      />
    </div>
  )
}

export function ReplayButton({ onReplay, reduced }: { onReplay: () => void; reduced: boolean }) {
  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={SPRING_GENTLE}
      className="flex size-full items-center justify-center"
    >
      <button
        type="button"
        onClick={onReplay}
        aria-label="Replay intro animation"
        className={cn(
          'inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-medium text-foreground shadow-sm transition hover:border-foreground/20 hover:bg-muted active:scale-95 motion-reduce:active:scale-100',
          FOCUS_RING,
        )}
      >
        <RotateCw className="size-3.5" aria-hidden />
        <span>Replay Intro</span>
      </button>
    </motion.div>
  )
}
