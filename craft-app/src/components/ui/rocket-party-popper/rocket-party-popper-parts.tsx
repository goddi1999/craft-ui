import { RotateCcw, Rocket, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'

import { cn } from '@/lib/utils'

import {
  FADE,
  FLICKER,
  FOCUS_RING,
  HOVER,
  LIFT_OFF,
  SPRING_GENTLE,
  THRUST,
} from './rocket-party-popper.constants'

const BUTTON =
  'inline-flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2.5 text-xs shadow-sm transition active:scale-[0.97] motion-reduce:active:scale-100'

export function Launchpad({
  launching,
  label,
  reduced,
  autoFocus,
  onLaunch,
}: {
  launching: boolean
  label: string
  reduced: boolean
  autoFocus: boolean
  onLaunch: () => void
}) {
  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: reduced ? 1 : 0.98, transition: { duration: 0.18 } }}
      className="flex flex-col items-center justify-center p-4 text-center sm:p-6"
    >
      {/* the rocket's flight track */}
      <div className="relative mb-4 flex h-24 w-20 items-end justify-center">
        <div className="absolute bottom-0 h-1.5 w-14 rounded-full border border-border bg-muted" />

        <motion.div
          animate={launching ? LIFT_OFF : reduced ? undefined : HOVER}
          onClick={onLaunch}
          className="relative z-10 flex cursor-pointer flex-col items-center"
        >
          <div className="relative flex size-12 items-center justify-center rounded-xl border border-border bg-background shadow-inner transition-colors hover:border-foreground/30">
            <Rocket className="size-6 -rotate-45 text-foreground" strokeWidth={1.75} aria-hidden />
          </div>

          {launching ? (
            <motion.div
              key="thrust"
              initial={{ scale: 0, opacity: 0 }}
              animate={THRUST}
              className="-mt-1 h-8 w-3.5 rounded-full bg-linear-to-b from-amber-300 via-orange-500 to-transparent blur-[0.5px]"
            />
          ) : (
            <motion.div
              key="pilot"
              animate={reduced ? { opacity: 0.55 } : FLICKER}
              className="-mt-0.5 h-3 w-2 rounded-full bg-linear-to-b from-amber-400/70 to-transparent blur-[0.5px]"
            />
          )}
        </motion.div>
      </div>

      <div className="pt-1">
        <button
          type="button"
          autoFocus={autoFocus}
          onClick={onLaunch}
          disabled={launching}
          className={cn(
            BUTTON,
            'bg-primary font-semibold text-primary-foreground hover:bg-primary/90 disabled:cursor-default disabled:opacity-50',
            FOCUS_RING,
          )}
        >
          <Sparkles className="size-3.5" aria-hidden />
          <span>{launching ? 'Launching...' : label}</span>
        </button>
      </div>
    </motion.div>
  )
}

export function Celebration({
  title,
  description,
  metric,
  reduced,
  autoFocus,
  onReset,
}: {
  title?: string
  description?: string
  metric?: string
  reduced: boolean
  autoFocus: boolean
  onReset: () => void
}) {
  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
      transition={reduced ? FADE : SPRING_GENTLE}
      className="flex flex-col items-center justify-center gap-5 py-4 text-center"
    >
      {(metric || title || description) && (
        <div className="flex max-w-xs flex-col items-center gap-1.5">
          {metric && (
            <span className="mb-1 rounded-full border border-border bg-muted px-2.5 py-1 font-mono text-[11px] leading-none text-muted-foreground">
              {metric}
            </span>
          )}
          {title && (
            <p className="text-base font-semibold tracking-tight text-foreground">{title}</p>
          )}
          {description && (
            <p className="text-sm text-pretty text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      <button
        type="button"
        autoFocus={autoFocus}
        onClick={onReset}
        className={cn(
          BUTTON,
          'border border-border bg-card font-medium text-foreground hover:border-foreground/20 hover:bg-muted',
          FOCUS_RING,
        )}
      >
        <RotateCcw className="size-3.5" aria-hidden />
        <span>Launch again</span>
      </button>
    </motion.div>
  )
}
