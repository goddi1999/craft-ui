import { useEffect, useState } from 'react'

import { RecorderState } from './voice-note.types'

const TICK_MS = 1000

/**
 * Drives the recorder's state machine. Each timer lives in an effect keyed on
 * the state that owns it, so leaving that state always tears the timer down —
 * and the auto-transitions happen inside the tick rather than on re-render.
 */
export function useVoiceRecorder(maxDuration: number) {
  const [state, setState] = useState<RecorderState>(RecorderState.IDLE)
  const [duration, setDuration] = useState(0)
  const [playbackTime, setPlaybackTime] = useState(0)

  useEffect(() => {
    if (state !== RecorderState.RECORDING) return

    let elapsed = 0
    const timer = setInterval(() => {
      elapsed += 1
      setDuration(elapsed)
      if (elapsed >= maxDuration) setState(RecorderState.REVIEWING)
    }, TICK_MS)

    return () => clearInterval(timer)
  }, [state, maxDuration])

  useEffect(() => {
    if (state !== RecorderState.PLAYING) return

    let remaining = duration
    const timer = setInterval(() => {
      remaining -= 1
      setPlaybackTime(Math.max(remaining, 0))
      if (remaining <= 0) setState(RecorderState.REVIEWING)
    }, TICK_MS)

    return () => clearInterval(timer)
  }, [state, duration])

  const startRecording = () => {
    setDuration(0)
    setPlaybackTime(0)
    setState(RecorderState.RECORDING)
  }

  const stopRecording = () => setState(RecorderState.REVIEWING)

  const startPlayback = () => {
    setPlaybackTime(duration)
    setState(RecorderState.PLAYING)
  }

  const stopPlayback = () => {
    setPlaybackTime(0)
    setState(RecorderState.REVIEWING)
  }

  const reset = () => {
    setDuration(0)
    setPlaybackTime(0)
    setState(RecorderState.IDLE)
  }

  return {
    state,
    duration,
    playbackTime,
    startRecording,
    stopRecording,
    startPlayback,
    stopPlayback,
    reset,
  }
}
