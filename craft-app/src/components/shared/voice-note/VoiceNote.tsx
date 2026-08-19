import { useState } from 'react'
import {
  AnimatePresence,
  motion,
  MotionConfig,
  type Transition,
} from 'motion/react'
import { Check, Mic, Play, Send, Square, X } from 'lucide-react'

import { cn } from '@/lib/utils'

import { AnimatedNumber } from './AnimatedNumber'
import { useVoiceRecorder } from './use-voice-recorder'
import { RecorderState, type VoiceNoteProps } from './voice-note.types'

const SPRING: Transition = { type: 'spring', stiffness: 400, damping: 40 }

const WAVEFORM_BAR_COUNT = 6

const ACTION_BUTTON_CLASS =
  'flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-[1.6px] border-[#E8E7EF] bg-[#fefefe] transition-colors duration-300 dark:border-white/5 dark:bg-neutral-900'

/** Random keyframes per bar so the waveform doesn't pulse in lockstep. */
function buildWaveformKeyframes(): number[][] {
  return Array.from({ length: WAVEFORM_BAR_COUNT }, () => [
    8 + Math.random() * 6,
    18 + Math.random() * 10,
    12 + Math.random() * 8,
    24 + Math.random() * 12,
    10 + Math.random() * 6,
  ])
}

export function VoiceNote({
  maxDuration = 4,
  onSend,
  onCancel,
  className,
}: VoiceNoteProps) {
  const {
    state,
    duration,
    playbackTime,
    startRecording,
    stopRecording,
    startPlayback,
    stopPlayback,
    reset,
  } = useVoiceRecorder(maxDuration)

  // Rolled once on mount so the bars keep their shape across re-renders.
  const [waveformKeyframes] = useState(buildWaveformKeyframes)

  const isIdle = state === RecorderState.IDLE
  const isRecording = state === RecorderState.RECORDING
  const isPlaying = state === RecorderState.PLAYING
  const isReviewing = state === RecorderState.REVIEWING

  const handleCancel = () => {
    reset()
    onCancel?.()
  }

  const handleSend = () => {
    onSend?.({ durationSeconds: duration })
    reset()
  }

  return (
    <div
      className={cn(
        'flex w-full flex-col items-center justify-center p-8',
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <MotionConfig transition={SPRING}>
          <AnimatePresence mode="popLayout">
            {!isIdle && (
              <motion.button
                key="cancel"
                type="button"
                aria-label="Discard recording"
                initial={{ opacity: 0, filter: 'blur(4px)', x: 95 }}
                animate={{ opacity: 1, filter: 'blur(0px)', x: 0 }}
                exit={{ opacity: 1, filter: 'blur(4px)', x: 95 }}
                onClick={handleCancel}
                className={ACTION_BUTTON_CLASS}
              >
                <X className="size-7 text-slate-700 dark:text-neutral-100" />
              </motion.button>
            )}
          </AnimatePresence>

          <motion.div
            animate={{ width: isIdle ? 65 : 110 }}
            style={{ borderRadius: 32 }}
            className={cn(
              'relative z-20 flex h-16 items-center justify-center overflow-hidden border-[1.6px] transition-colors duration-300',
              isIdle ? 'w-16' : 'px-6',
              isRecording
                ? 'border-transparent bg-[#FEE5E4] dark:bg-[#441010]'
                : 'border-[#E8E7EF] bg-[#fefefe] dark:border-[#2d2d33] dark:bg-[#1a1a1e]',
            )}
          >
            <AnimatePresence mode="popLayout">
              {isRecording && (
                <motion.svg
                  key="progress-ring"
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  initial={{ opacity: 0, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, filter: 'blur(8px)' }}
                >
                  <motion.rect
                    x="2"
                    y="2"
                    rx="30"
                    width="calc(100% - 4px)"
                    height="calc(100% - 4px)"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="3"
                    pathLength={1}
                    strokeDasharray="1"
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: 1 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: maxDuration, ease: 'linear' }}
                  />
                </motion.svg>
              )}
            </AnimatePresence>

            <AnimatePresence mode="popLayout" initial={false}>
              {isIdle && (
                <motion.button
                  key="mic"
                  type="button"
                  aria-label="Start recording"
                  initial={{ opacity: 0, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, filter: 'blur(8px)' }}
                  onClick={startRecording}
                  className="flex items-center justify-center"
                >
                  <Mic className="size-7 text-slate-800 dark:text-neutral-100" />
                </motion.button>
              )}

              {isRecording && (
                <motion.div
                  key="waveform"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="z-10 flex items-center gap-1.5"
                >
                  {waveformKeyframes.map((keyframes, index) => (
                    <motion.div
                      key={index}
                      animate={{ height: keyframes }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear',
                        delay: index * 0.08,
                      }}
                      style={{ originY: 1 }}
                      className="w-1.5 rounded-full bg-[#FC3229]"
                    />
                  ))}
                </motion.div>
              )}

              {(isReviewing || isPlaying) && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="z-10 flex items-center gap-2"
                >
                  <motion.button
                    type="button"
                    aria-label={isPlaying ? 'Stop playback' : 'Play recording'}
                    onClick={isPlaying ? stopPlayback : startPlayback}
                    initial={{ opacity: 0, filter: 'blur(4px)', scale: 0.25 }}
                    animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                    exit={{ opacity: 0, filter: 'blur(4px)', scale: 0.25 }}
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full transition-colors',
                      isPlaying
                        ? 'text-red-500 dark:text-red-400'
                        : 'text-slate-800 dark:text-neutral-100',
                    )}
                  >
                    {isPlaying ? (
                      <Square className="size-5.5 fill-current" />
                    ) : (
                      <Play className="size-5.5 fill-current" />
                    )}
                  </motion.button>

                  <span className="flex items-center justify-center gap-0.5 text-[20px] font-bold text-[#282828] tabular-nums transition-colors dark:text-neutral-100">
                    <AnimatedNumber value={isPlaying ? playbackTime : duration} />
                    <motion.span layout>s</motion.span>
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <AnimatePresence mode="popLayout">
            {!isIdle && (
              <motion.button
                key="confirm"
                type="button"
                aria-label={isRecording ? 'Stop recording' : 'Send voice note'}
                onClick={isRecording ? stopRecording : handleSend}
                initial={{ opacity: 0, filter: 'blur(4px)', x: -95 }}
                animate={{ opacity: 1, filter: 'blur(0px)', x: 0 }}
                exit={{ opacity: 0, filter: 'blur(4px)', x: -95 }}
                className={ACTION_BUTTON_CLASS}
              >
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={isRecording ? 'stop' : 'send'}
                    initial={{ opacity: 0, filter: 'blur(4px)', scale: 0.25 }}
                    animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                    exit={{ opacity: 0, filter: 'blur(4px)', scale: 0.25 }}
                  >
                    {isRecording ? (
                      <Check className="size-6.5 text-slate-700 dark:text-neutral-100" />
                    ) : (
                      <Send className="size-6.5 text-[#272727] dark:text-neutral-100" />
                    )}
                  </motion.span>
                </AnimatePresence>
              </motion.button>
            )}
          </AnimatePresence>
        </MotionConfig>
      </div>
    </div>
  )
}
