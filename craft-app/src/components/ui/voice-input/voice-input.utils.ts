import { BAR_COUNT, REST_LEVEL, STILL_LEVELS } from './voice-input.constants'
import type { VoiceInputMode } from './voice-input.types'

/**
 * Speech-like level without a microphone: syllables at about 4-5 per second,
 * grouped into words and phrases with pauses between them.
 */
export function createVoiceSimulator() {
  let speaking = false
  let switchAt = 0
  let gate = 0
  return (time: number) => {
    if (time >= switchAt) {
      speaking = !speaking
      switchAt = time + (speaking ? 700 + Math.random() * 1600 : 180 + Math.random() * 500)
    }
    // the gate eases in and out, so words swell and fade instead of cutting
    gate += ((speaking ? 1 : 0) - gate) * 0.35
    const t = time / 1000
    const syllable = Math.abs(Math.sin(t * Math.PI * 4.4 + Math.sin(t * 1.7) * 2))
    const grain = 0.65 + Math.random() * 0.35
    return REST_LEVEL + gate * syllable * grain * (1 - REST_LEVEL)
  }
}

/** Squeezes a whole take into BAR_COUNT bars, keeping each slice's peak. */
export function condense(take: number[]) {
  if (take.length === 0) return STILL_LEVELS.slice(0, BAR_COUNT)
  return Array.from({ length: BAR_COUNT }, (_, i) => {
    const from = Math.floor((i / BAR_COUNT) * take.length)
    const to = Math.max(from + 1, Math.floor(((i + 1) / BAR_COUNT) * take.length))
    return Math.max(REST_LEVEL, ...take.slice(from, to))
  })
}

export function formatTime(seconds: number) {
  const whole = Math.floor(seconds)
  const mins = Math.floor(whole / 60)
  const secs = whole % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

/** Writes bar heights straight to the DOM; the condensed take is one bar short, that bar rests. */
export function setScales(bars: (HTMLSpanElement | null)[], levels: readonly number[]) {
  bars.forEach((bar, i) => {
    if (!bar) return
    const level = i < levels.length ? levels[i] : REST_LEVEL
    bar.style.transform = `scaleY(${level.toFixed(3)})`
  })
}

export function mainLabelFor(mode: VoiceInputMode, playing: boolean) {
  if (mode === 'recording') return 'Stop recording'
  if (mode === 'review') return playing ? 'Pause playback' : 'Play recording'
  return 'Start recording'
}

export function timerText(
  mode: VoiceInputMode,
  seconds: number,
  duration: number,
  playing: boolean,
  playhead: number,
) {
  if (mode === 'review') return formatTime(playing || playhead > 0 ? playhead : duration)
  return formatTime(mode === 'recording' ? seconds : 0)
}

export const toClipPath = (progress: number) =>
  `inset(0 ${((1 - progress) * 100).toFixed(2)}% 0 0)`
