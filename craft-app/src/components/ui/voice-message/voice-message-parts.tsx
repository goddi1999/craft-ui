import { memo, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

import type { SIZES } from './voice-message.utils'

// bars never reach the full track height, leaving air above and below
const PEAK_RATIO = 0.68

type Metrics = (typeof SIZES)[keyof typeof SIZES]

/** The waveform. Rendered twice: dim underneath, solid clipped to progress. */
export const VoiceMessageBars = memo(function VoiceMessageBars({
  amplitudes,
  metrics,
  className,
}: {
  amplitudes: number[]
  metrics: Metrics
  className: string
}) {
  return (
    <div className="flex h-full w-full items-center" style={{ gap: metrics.barGap }}>
      {amplitudes.map((amplitude, i) => (
        <span
          key={i}
          className={cn('flex-1 rounded-full', className)}
          style={{
            minWidth: metrics.bar,
            height: `${(amplitude * PEAK_RATIO * 100).toFixed(2)}%`,
          }}
        />
      ))}
    </div>
  )
})

/** Time remaining; doubles as the playback-speed button when there are speeds. */
export function VoiceMessageTime({
  speed,
  text,
  onCycle,
  children,
}: {
  speed: number
  text: string
  onCycle?: () => void
  children: ReactNode
}) {
  const className = cn(
    'flex shrink-0 items-center gap-1 font-semibold tabular-nums text-[#868593]',
    text,
  )

  if (!onCycle) {
    return (
      <span data-slot="voice-message-time" className={className}>
        {children}
      </span>
    )
  }

  return (
    <button
      data-slot="voice-message-time"
      type="button"
      onClick={onCycle}
      aria-label={`Playback speed, ${speed} times. Press to change`}
      className={cn(
        className,
        'cursor-pointer rounded-full outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#868593]',
      )}
    >
      {children}
      {speed !== 1 ? (
        <span className="rounded-full bg-black/10 px-1 py-px text-[0.85em] leading-none text-black/70 dark:bg-white/15 dark:text-white/80">
          {speed}×
        </span>
      ) : null}
    </button>
  )
}
