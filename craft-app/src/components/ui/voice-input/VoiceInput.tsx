import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

import { usePlayback } from './use-playback'
import { useWaveform } from './use-waveform'
import {
  BAR_COUNT,
  BAR_IDS,
  CLOCK_TICK_MS,
  DEMO_DELAYS_MS,
  EASE_OUT_CSS,
  EDGE_MASK,
  REST_LEVEL,
  SAMPLE_MS,
  SETTLE_STAGGER_MS,
} from './voice-input.constants'
import type { VoiceInputMode, VoiceInputProps } from './voice-input.types'
import { ButtonFaces, Caption, ReviewActions } from './voice-input-parts'
import { mainLabelFor, timerText } from './voice-input.utils'

/**
 * A voice recorder: the waveform scrolls in from the right while you talk, then
 * the whole take settles into the row so you can play it back, send or discard it.
 */
export function VoiceInput({
  demo = false,
  level,
  idleCaption = 'Click to speak',
  listeningCaption = 'Listening…',
  onListeningChange,
  onStop,
  onSend,
  onDiscard,
  className,
  onPointerDownCapture,
  ...props
}: VoiceInputProps) {
  const reduced = useReducedMotion() ?? false
  const [mode, setMode] = useState<VoiceInputMode>('idle')
  const [isDemo, setIsDemo] = useState(demo)
  const [seconds, setSeconds] = useState(0)
  const [duration, setDuration] = useState(0)
  const mainRef = useRef<HTMLButtonElement>(null)
  const startedAtRef = useRef(0)

  const recording = mode === 'recording'
  const reviewing = mode === 'review'
  const { rootRef, rowRef, ringRef, barRefs, playedBarRefs, takeRef } = useWaveform({
    recording,
    reviewing,
    reduced,
    level,
  })
  const { playing, setPlaying, playhead, clipPath, rewind } = usePlayback(duration)
  const hasPlayed = playhead > 0
  // the demo loop is not the user recording, so assistive tech only hears about real actions
  const announce = !isDemo

  useEffect(() => {
    if (!recording) return
    startedAtRef.current = Date.now()
    const id = setInterval(() => {
      setSeconds(Math.floor((Date.now() - startedAtRef.current) / 1000))
    }, CLOCK_TICK_MS)
    return () => clearInterval(id)
  }, [recording])

  // the demo loop passes notify = false, so the callbacks only hear what the user did
  const startRecording = (notify = true) => {
    setPlaying(false)
    setSeconds(0)
    setMode('recording')
    if (notify) onListeningChange?.(true)
  }

  const stopRecording = (notify = true) => {
    const taken = Math.max(
      (Date.now() - startedAtRef.current) / 1000,
      takeRef.current.length * (SAMPLE_MS / 1000),
    )
    setDuration(taken)
    rewind()
    setMode('review')
    if (!notify) return
    onListeningChange?.(false)
    onStop?.(taken)
  }

  const finish = (sent: boolean, notify = true) => {
    setPlaying(false)
    setMode('idle')
    if (!notify) return
    // send and discard leave with the review row, so focus goes back to the record button
    mainRef.current?.focus()
    if (sent) onSend?.(duration)
    else onDiscard?.()
  }

  const togglePlay = () => setPlaying((value) => !value)

  // demo: record, review with a playback sweep, send, rest
  const demoStepRef = useRef(() => {})
  useEffect(() => {
    demoStepRef.current = () => {
      if (mode === 'idle') startRecording(false)
      else if (mode === 'recording') stopRecording(false)
      else if (hasPlayed) finish(true, false)
      else togglePlay()
    }
  })

  useEffect(() => {
    if (!isDemo || playing) return
    const delay = {
      idle: DEMO_DELAYS_MS.idle,
      recording: DEMO_DELAYS_MS.recording,
      review: hasPlayed ? DEMO_DELAYS_MS.played : DEMO_DELAYS_MS.review,
    }[mode]
    const id = setTimeout(() => demoStepRef.current(), delay)
    return () => clearTimeout(id)
  }, [isDemo, mode, hasPlayed, playing])

  // the first press anywhere in the component ends the demo
  const endDemo = () => {
    if (!isDemo) return
    setIsDemo(false)
    setPlaying(false)
    setMode('idle')
  }

  const handleMainClick = () => {
    if (isDemo) {
      endDemo()
      startRecording()
    } else if (recording) stopRecording()
    else if (reviewing) togglePlay()
    else startRecording()
  }

  const faces = {
    mic: mode === 'idle',
    stop: recording,
    play: reviewing && !playing,
    pause: reviewing && playing,
  }
  const timer = timerText(mode, seconds, duration, playing, playhead)
  const edgeMask = recording ? EDGE_MASK : undefined

  return (
    <div
      ref={rootRef}
      data-slot="voice-input"
      className={cn('w-full py-4', className)}
      onPointerDownCapture={(event) => {
        endDemo()
        onPointerDownCapture?.(event)
      }}
      {...props}
    >
      <div className="relative mx-auto flex w-full max-w-xl flex-col items-center gap-2">
        <div className="relative">
          {/* swells with the voice while recording */}
          <span
            ref={ringRef}
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-xl bg-foreground/5 opacity-0"
          />
          <button
            ref={mainRef}
            type="button"
            aria-label={mainLabelFor(mode, playing)}
            aria-pressed={recording && announce}
            onClick={handleMainClick}
            className={cn(
              'relative flex size-16 items-center justify-center rounded-xl outline-none transition-colors duration-150 ease-out focus-visible:ring-2 focus-visible:ring-ring',
              mode === 'idle' ? 'hover:bg-foreground/5' : 'bg-foreground/5',
            )}
          >
            <ButtonFaces visible={faces} />
          </button>
        </div>

        <span
          className={cn(
            'relative text-sm tabular-nums transition-colors duration-300',
            mode === 'idle' ? 'text-foreground/30' : 'text-foreground/70',
          )}
        >
          {/* a steady rec lamp, outside the text so the timer stays centred */}
          <span
            aria-hidden
            className={cn(
              'absolute top-1/2 right-full mr-2 size-1.5 -translate-y-1/2 rounded-full bg-destructive transition-opacity duration-150',
              recording ? 'opacity-100' : 'opacity-0',
            )}
          />
          {timer}
        </span>

        {/* while recording the newest sound enters on the right and the edges fade;
            in review the take sits still and a darker copy, clipped at the playhead,
            shows what has played */}
        <div
          aria-hidden
          className="relative h-8 w-60 overflow-hidden"
          style={{ maskImage: edgeMask, WebkitMaskImage: edgeMask }}
        >
          <div ref={rowRef} className="flex h-full items-center gap-[2px]">
            {BAR_IDS.map((id, i) => (
              <span
                key={id}
                ref={(el) => {
                  barRefs.current[i] = el
                }}
                className={cn(
                  'h-full w-[3px] shrink-0 rounded-full',
                  recording
                    ? 'bg-foreground/60'
                    : 'bg-foreground/15 transition-transform duration-500 motion-reduce:transition-none',
                )}
                style={{
                  transform: `scaleY(${REST_LEVEL})`,
                  // out of recording the bars settle right to left
                  transitionDelay: recording
                    ? undefined
                    : `${(BAR_COUNT - i) * SETTLE_STAGGER_MS}ms`,
                  transitionTimingFunction: EASE_OUT_CSS,
                }}
              />
            ))}
          </div>
          <motion.div
            className={cn(
              'absolute inset-0 flex items-center gap-[2px] transition-opacity duration-200',
              reviewing ? 'opacity-100' : 'opacity-0',
            )}
            style={{ clipPath }}
          >
            {BAR_IDS.map((id, i) => (
              <span
                key={id}
                ref={(el) => {
                  playedBarRefs.current[i] = el
                }}
                className="h-full w-[3px] shrink-0 rounded-full bg-foreground/70"
                style={{ transform: `scaleY(${REST_LEVEL})` }}
              />
            ))}
          </motion.div>
        </div>

        <div className="relative flex h-7 items-center justify-center">
          <AnimatePresence initial={false} mode="popLayout">
            {reviewing ? (
              <ReviewActions
                key="actions"
                onDiscard={() => finish(false)}
                onSend={() => finish(true)}
              />
            ) : (
              <Caption key="caption">{recording ? listeningCaption : idleCaption}</Caption>
            )}
          </AnimatePresence>
        </div>

        {/* <output> is a status region; it stays silent during the demo loop */}
        <output aria-live={announce ? 'polite' : 'off'} className="sr-only">
          {announce && recording ? 'Recording' : ''}
          {announce && reviewing ? 'Recording ready to send' : ''}
        </output>
      </div>
    </div>
  )
}
