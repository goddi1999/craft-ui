import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

import { StepPlayerIcon, type StepPlayerIconState } from './step-player-icon'
import type { StepPlayerProps, StepPlayerStep } from './step-player.types'

const WIDTH_SPRING = { type: 'spring', duration: 0.42, bounce: 0.14 } as const
const TAP_SPRING = { type: 'spring', duration: 0.25, bounce: 0.3 } as const
const INSTANT = { duration: 0 } as const

// proportions traced from the iOS reference
const RATIO = { dot: 0.115, barPerDot: 8.2, gap: 0.18, icon: 0.64 } as const
const MIN_HIT = 44

const metricsFor = (size: number) => {
  const track = Math.max(12, size)
  const dot = Math.max(2, Math.round(track * RATIO.dot))
  return {
    track,
    dot,
    bar: Math.round(dot * RATIO.barPerDot),
    gap: Math.max(2, Math.round(track * RATIO.gap)),
    // the same inset the dot leaves top and bottom
    pad: Math.round((track - dot) / 2),
    icon: Math.round(track * RATIO.icon),
    // invisible hit area so tiny dots still meet the 44px touch target
    hit: Math.max(0, (Math.max(MIN_HIT, track) - dot) / 2),
  }
}

const toSteps = (steps: number | StepPlayerStep[]): StepPlayerStep[] =>
  typeof steps === 'number'
    ? Array.from({ length: Math.max(1, steps) }, () => ({}))
    : steps

/**
 * An iOS-style story progress bar: dots for each step, the active one
 * stretched into a filling bar, and a play / pause / replay button whose
 * icon morphs between states.
 */
export function StepPlayer({
  steps = 4,
  value,
  defaultValue = 0,
  onValueChange,
  playing,
  defaultPlaying = false,
  onPlayingChange,
  duration = 4000,
  loop = false,
  onComplete,
  size = 48,
  showControl = true,
  controlPosition = 'right',
  seekable = false,
  className,
  style,
  ...props
}: StepPlayerProps) {
  const items = toSteps(steps)
  const count = items.length

  const isValueControlled = value !== undefined
  const isPlayingControlled = playing !== undefined
  const [indexState, setIndexState] = useState(() =>
    Math.min(Math.max(0, defaultValue), count - 1),
  )
  const [playingState, setPlayingState] = useState(defaultPlaying)
  const [finished, setFinished] = useState(false)

  const index = Math.min(isValueControlled ? value : indexState, count - 1)
  const isPlaying = isPlayingControlled ? playing : playingState

  const reduced = useReducedMotion() ?? false
  const metrics = metricsFor(size)
  const progress = useMotionValue(0)
  const fillWidth = useTransform(progress, (p) => `${p * 100}%`)
  const stepDuration = items[index]?.duration ?? duration

  // read through refs so a new callback identity never restarts the running step
  const callbacks = useRef({ onComplete, onValueChange, onPlayingChange })
  useEffect(() => {
    callbacks.current = { onComplete, onValueChange, onPlayingChange }
  })

  const commitIndex = useCallback(
    (next: number) => {
      progress.set(0)
      setFinished(false)
      if (!isValueControlled) setIndexState(next)
      callbacks.current.onValueChange?.(next)
    },
    [isValueControlled, progress],
  )

  const commitPlaying = useCallback(
    (next: boolean) => {
      if (!isPlayingControlled) setPlayingState(next)
      callbacks.current.onPlayingChange?.(next)
    },
    [isPlayingControlled],
  )

  useEffect(() => {
    if (!isPlaying || stepDuration <= 0) return
    let frame = 0
    const start = performance.now() - progress.get() * stepDuration
    const tick = (now: number) => {
      const elapsed = Math.min(1, (now - start) / stepDuration)
      progress.set(elapsed)
      if (elapsed < 1) {
        frame = requestAnimationFrame(tick)
        return
      }
      if (index < count - 1) {
        commitIndex(index + 1)
        return
      }
      callbacks.current.onComplete?.()
      if (loop) {
        commitIndex(0)
        return
      }
      setFinished(true)
      commitPlaying(false)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [isPlaying, index, count, stepDuration, loop, commitIndex, commitPlaying, progress])

  const handleControl = () => {
    if (finished) {
      commitIndex(0)
      commitPlaying(true)
      return
    }
    commitPlaying(!isPlaying)
  }

  const minTrack =
    metrics.pad * 2 + metrics.bar + (count - 1) * (metrics.dot + metrics.gap)
  const iconState: StepPlayerIconState = finished
    ? 'replay'
    : isPlaying
      ? 'pause'
      : 'play'
  const widthTransition = reduced ? INSTANT : WIDTH_SPRING
  const controlLabel = finished ? 'Replay' : isPlaying ? 'Pause' : 'Play'

  return (
    <div
      data-slot="step-player"
      data-playing={isPlaying || undefined}
      data-finished={finished || undefined}
      className={cn(
        'inline-flex items-center text-muted-foreground',
        controlPosition === 'right' && 'flex-row-reverse',
        className,
      )}
      style={{ gap: metrics.gap, ...style }}
      {...props}
    >
      {showControl ? (
        <motion.button
          data-slot="step-player-control"
          type="button"
          onClick={handleControl}
          aria-label={controlLabel}
          whileTap={reduced ? undefined : { scale: 0.88 }}
          transition={reduced ? INSTANT : TAP_SPRING}
          style={{ width: metrics.track, height: metrics.track }}
          className="flex shrink-0 cursor-pointer touch-manipulation select-none items-center justify-center rounded-full bg-muted outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <StepPlayerIcon state={iconState} size={metrics.icon} reduced={reduced} />
        </motion.button>
      ) : null}

      <div
        data-slot="step-player-track"
        role="group"
        aria-label={`Step ${index + 1} of ${count}`}
        style={{
          height: metrics.track,
          paddingInline: metrics.pad,
          gap: metrics.gap,
          minWidth: minTrack,
        }}
        className="flex flex-1 items-center justify-center rounded-full bg-muted"
      >
        {items.map((step, i) => {
          const state = i === index ? 'active' : i < index ? 'past' : 'pending'
          return (
            <motion.div
              key={i}
              data-slot="step-player-step"
              data-state={state}
              initial={false}
              animate={{ width: state === 'active' ? metrics.bar : metrics.dot }}
              whileHover={
                seekable && state !== 'active' && !reduced ? { scale: 1.35 } : undefined
              }
              whileTap={seekable && !reduced ? { scale: 0.85 } : undefined}
              transition={widthTransition}
              style={{ height: metrics.dot, borderRadius: 999 }}
              className={cn(
                'relative shrink-0 transition-colors duration-300 motion-reduce:transition-none',
                state === 'past' ? 'bg-foreground/80' : 'bg-muted-foreground/60',
                seekable &&
                  'has-focus-visible:outline-2 has-focus-visible:outline-offset-4 has-focus-visible:outline-ring',
              )}
            >
              {state === 'active' ? (
                <motion.span
                  data-slot="step-player-fill"
                  style={{ width: fillWidth, borderRadius: 999 }}
                  className="absolute inset-y-0 left-0 bg-foreground/80"
                />
              ) : null}
              {seekable ? (
                <button
                  type="button"
                  aria-label={step.label ?? `Step ${i + 1}`}
                  aria-current={state === 'active' ? 'step' : undefined}
                  onClick={() => {
                    commitIndex(i)
                    commitPlaying(true)
                  }}
                  style={{ top: -metrics.hit, bottom: -metrics.hit }}
                  className="absolute inset-x-0 cursor-pointer touch-manipulation outline-none"
                />
              ) : null}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
