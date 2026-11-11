import { motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react'
import {
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'

import { cn } from '@/lib/utils'

import { VoiceMessageAurora } from './voice-message-aurora'
import { VoiceMessageGroupContext } from './voice-message-context'
import { VoiceMessageIcon } from './voice-message-icon'
import { VoiceMessageBars, VoiceMessageTime } from './voice-message-parts'
import type { VoiceMessageProps } from './voice-message.types'
import {
  SIZES,
  buildWaveform,
  clamp,
  formatTime,
} from './voice-message.utils'

const TAP = { type: 'spring', duration: 0.25, bounce: 0.3 } as const
const INSTANT = { duration: 0 } as const
const PLAYING_GLOW = 0.62
const DEFAULT_SPEEDS = [1, 1.5, 2]
// all proportional to the bar height, so every size keeps the same look
const CONTROL_RATIO = 0.76
const ICON_RATIO = 0.72
const SEEK_STEP = 5

/**
 * A chat voice message: play/pause that morphs, a seekable waveform that
 * fills as it plays, time left with a speed toggle, and a soft glow that
 * orbits the pill while it plays. Works with or without an audio file.
 */
export function VoiceMessage({
  src,
  duration = 53,
  waveform,
  bars = 40,
  seed = 7,
  playing,
  defaultPlaying = false,
  onPlayingChange,
  onEnded,
  accent = '#FC4C01',
  size = 'default',
  seekable = true,
  speeds = DEFAULT_SPEEDS,
  onSpeedChange,
  className,
  style,
  ...props
}: VoiceMessageProps) {
  const metrics = SIZES[size]
  const control = Math.round(metrics.height * CONTROL_RATIO)
  // the button sits as far from the left edge as from the top and bottom
  const inset = Math.round((metrics.height - control) / 2)
  const reduced = useReducedMotion() ?? false

  const amplitudes = useMemo(
    () => waveform ?? buildWaveform(Math.max(1, bars), seed),
    [waveform, bars, seed],
  )

  const audioRef = useRef<HTMLAudioElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const scrubbing = useRef(false)
  // performance.now() baseline for a message with no audio file behind it
  const startedAt = useRef(0)

  const [metaDuration, setMetaDuration] = useState<number | null>(null)
  const [playingState, setPlayingState] = useState(defaultPlaying)
  const [elapsed, setElapsed] = useState(0)
  const [failed, setFailed] = useState(false)
  const [speed, setSpeed] = useState(speeds[0] ?? 1)

  const id = useId()
  const group = useContext(VoiceMessageGroupContext)

  // a file has to report its length before the bar can be trusted
  const loading = !!src && metaDuration === null && !failed
  const blocked = loading || failed

  const total = metaDuration ?? duration
  const isControlled = playing !== undefined
  const isPlaying = isControlled ? playing : playingState

  const progress = useMotionValue(0)
  const clipPath = useTransform(progress, (p) => `inset(0 ${(1 - p) * 100}% 0 0)`)

  // a new callback identity would otherwise restart the running clip
  const callbacks = useRef({ onEnded, onPlayingChange })
  useEffect(() => {
    callbacks.current = { onEnded, onPlayingChange }
  })

  const commitPlaying = useCallback(
    (next: boolean) => {
      if (!isControlled) setPlayingState(next)
      callbacks.current.onPlayingChange?.(next)
    },
    [isControlled],
  )

  const seekTo = useCallback(
    (ratio: number) => {
      const next = clamp(ratio)
      progress.set(next)
      setElapsed(Math.floor(next * total))
      startedAt.current = performance.now() - (next * total * 1000) / speed
      const audio = audioRef.current
      if (audio && Number.isFinite(total)) audio.currentTime = next * total
    },
    [progress, total, speed],
  )

  const finish = useCallback(() => {
    // the frame loop and the audio element can both report the same end
    if (progress.get() === 0) return
    progress.set(0)
    setElapsed(0)
    const audio = audioRef.current
    if (audio) audio.currentTime = 0
    commitPlaying(false)
    callbacks.current.onEnded?.()
  }, [progress, commitPlaying])

  useEffect(() => {
    if (!isPlaying || total <= 0) return

    const audio = audioRef.current
    if (audio) audio.playbackRate = speed
    audio?.play().catch(() => commitPlaying(false))
    startedAt.current = performance.now() - (progress.get() * total * 1000) / speed

    let frame = 0
    const tick = (now: number) => {
      const seconds = audio
        ? audio.currentTime
        : ((now - startedAt.current) / 1000) * speed
      const ratio = clamp(seconds / total)
      progress.set(ratio)
      // whole seconds only, so the label is the one thing that re-renders
      setElapsed(Math.floor(seconds))
      if (ratio < 1) {
        frame = requestAnimationFrame(tick)
        return
      }
      finish()
    }

    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      audio?.pause()
    }
  }, [isPlaying, total, speed, progress, commitPlaying, finish])

  const scrub = (event: PointerEvent<HTMLDivElement>) => {
    const rect = trackRef.current?.getBoundingClientRect()
    if (rect?.width) seekTo((event.clientX - rect.left) / rect.width)
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!seekable || blocked) return
    event.currentTarget.setPointerCapture(event.pointerId)
    scrubbing.current = true
    scrub(event)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!seekable || blocked || total <= 0) return
    const at = progress.get() * total
    const to = {
      ArrowLeft: at - SEEK_STEP,
      ArrowRight: at + SEEK_STEP,
      Home: 0,
      End: total,
    }[event.key]
    if (to === undefined) return
    event.preventDefault()
    seekTo(to / total)
  }

  const handleControl = () => {
    if (isPlaying) {
      commitPlaying(false)
      return
    }
    commitPlaying(true)
    // taking a turn stops whatever else plays in the same group
    group?.claim(id, () => commitPlaying(false))
  }

  const handleCycleSpeed = () => {
    const next = speeds[(speeds.indexOf(speed) + 1) % speeds.length]
    setSpeed(next)
    onSpeedChange?.(next)
    const audio = audioRef.current
    if (audio) audio.playbackRate = next
  }

  const remaining = total - elapsed
  const slider = seekable
    ? {
        role: 'slider' as const,
        tabIndex: 0,
        'aria-label': 'Seek',
        'aria-valuemin': 0,
        'aria-valuemax': Math.round(total),
        'aria-valuenow': elapsed,
        'aria-valuetext': `${formatTime(elapsed)} of ${formatTime(total)}`,
      }
    : undefined

  return (
    <div
      data-slot="voice-message"
      data-playing={isPlaying || undefined}
      data-loading={loading || undefined}
      data-error={failed || undefined}
      className={cn('relative isolate inline-flex items-center select-none', className)}
      style={{
        height: metrics.height,
        gap: metrics.gap,
        paddingLeft: inset,
        paddingRight: metrics.pad,
        ...style,
      }}
      {...props}
    >
      <div className="absolute inset-0 -z-10 rounded-full bg-[#F4F4F9] dark:bg-[#1C1C1C]" />
      <VoiceMessageAurora
        accent={accent}
        height={metrics.height}
        glow={isPlaying ? PLAYING_GLOW : 0}
        playing={isPlaying}
        reduced={reduced}
      />

      <motion.button
        data-slot="voice-message-control"
        type="button"
        onClick={handleControl}
        disabled={blocked}
        aria-label={isPlaying ? 'Pause voice message' : 'Play voice message'}
        whileTap={reduced || blocked ? undefined : { scale: 0.9 }}
        transition={reduced ? INSTANT : TAP}
        style={{ width: control, height: control }}
        className="z-10 flex shrink-0 cursor-pointer touch-manipulation items-center justify-center rounded-full bg-white text-black outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#868593] disabled:cursor-default disabled:opacity-40 dark:bg-[#0E0E0E] dark:text-white"
      >
        <VoiceMessageIcon
          playing={isPlaying}
          size={Math.round(control * ICON_RATIO)}
          reduced={reduced}
        />
      </motion.button>

      <div
        ref={trackRef}
        data-slot="voice-message-track"
        {...slider}
        onPointerDown={handlePointerDown}
        onPointerMove={(event) => scrubbing.current && scrub(event)}
        onPointerUp={() => (scrubbing.current = false)}
        onPointerCancel={() => (scrubbing.current = false)}
        onKeyDown={handleKeyDown}
        className={cn(
          'relative h-full flex-1 touch-none rounded-sm outline-none transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#868593]',
          seekable && !blocked && 'cursor-pointer',
          blocked && 'opacity-40',
        )}
      >
        <VoiceMessageBars
          amplitudes={amplitudes}
          metrics={metrics}
          className="bg-black/30 dark:bg-white/40"
        />
        <motion.div aria-hidden="true" className="absolute inset-0" style={{ clipPath }}>
          <VoiceMessageBars
            amplitudes={amplitudes}
            metrics={metrics}
            className="bg-black dark:bg-white"
          />
        </motion.div>
      </div>

      <VoiceMessageTime
        speed={speed}
        text={metrics.text}
        onCycle={speeds.length > 1 ? handleCycleSpeed : undefined}
      >
        {formatTime(remaining)}
      </VoiceMessageTime>

      {src ? (
        <audio
          ref={audioRef}
          className="hidden"
          src={src}
          preload="metadata"
          onLoadedMetadata={(event) => {
            const value = event.currentTarget.duration
            setMetaDuration(Number.isFinite(value) ? value : duration)
          }}
          onError={() => setFailed(true)}
          // a file can stop just short of its duration, so the loop may never see the end
          onEnded={finish}
        />
      ) : null}
    </div>
  )
}
