import { useEffect, useEffectEvent, useState } from 'react'
import { animate, useMotionValue, type AnimationPlaybackControls } from 'motion/react'

import {
  ACCEPT_STAGGER_MS,
  FADE_SPRING,
  HOLD_MS,
  NEXT_MS,
  OFFER_PAUSE_MS,
  TAB_DROP_VELOCITY,
  TAB_SPRING,
  TYPE_DELAY_MS,
  TYPE_STEP_MS,
} from './ghost-suggestion.constants'
import type { GhostPhase, GhostSuggestionNote } from './ghost-suggestion.types'
import { countLetters, springFor } from './ghost-suggestion.utils'

type GhostCycleOptions = {
  notes: readonly GhostSuggestionNote[]
  autoAccept: boolean
  acceptAfter: number
  reduced: boolean
  onAccept?: (note: GhostSuggestionNote) => void
}

/**
 * Runs one note at a time: type it out, offer the rest, accept (by itself or
 * on Tab), park the caret at the end, fade, next note.
 */
export function useGhostCycle({
  notes,
  autoAccept,
  acceptAfter,
  reduced,
  onAccept,
}: GhostCycleOptions) {
  const [cycle, setCycle] = useState(0)
  const [typed, setTyped] = useState(0)
  const [phase, setPhase] = useState<GhostPhase>('typing')
  const [caretAtEnd, setCaretAtEnd] = useState(false)
  // the body's opacity for the fade between notes, and the Tab key's 0–1 pop
  const fade = useMotionValue(1)
  const tab = useMotionValue(0)
  const note = notes[cycle % notes.length]
  const letters = countLetters(note.suggestion)

  function accept() {
    if (phase !== 'offered') return
    setPhase('accepted')
    onAccept?.(note)
  }

  const acceptOnTimer = useEffectEvent(accept)

  // type the note out a letter at a time, then offer the rest
  useEffect(() => {
    if (phase !== 'typing') return
    fade.jump(1)
    tab.jump(0)
    const count = Array.from(note.text).length
    const timers = Array.from({ length: count }, (_, i) =>
      setTimeout(() => setTyped(i + 1), TYPE_DELAY_MS + i * TYPE_STEP_MS),
    )
    timers.push(
      setTimeout(
        () => setPhase('offered'),
        TYPE_DELAY_MS + count * TYPE_STEP_MS + OFFER_PAUSE_MS,
      ),
    )
    return () => timers.forEach(clearTimeout)
  }, [phase, note.text, fade, tab])

  // the key pops in, and the suggestion accepts itself if nobody does
  useEffect(() => {
    if (phase !== 'offered') return
    const pop = animate(tab, 1, springFor(TAB_SPRING, reduced))
    const timer = autoAccept ? setTimeout(() => acceptOnTimer(), acceptAfter) : undefined
    return () => {
      pop.stop()
      clearTimeout(timer)
    }
  }, [phase, autoAccept, acceptAfter, reduced, tab])

  // the letters brighten one by one, then the caret jumps to the end, then on to the next note
  useEffect(() => {
    if (phase !== 'accepted') return
    const run = letters * ACCEPT_STAGGER_MS
    const running: AnimationPlaybackControls[] = [
      animate(tab, 0, { ...springFor(TAB_SPRING, reduced), velocity: TAB_DROP_VELOCITY }),
    ]
    const timers = [
      setTimeout(() => setCaretAtEnd(true), run),
      setTimeout(
        () => running.push(animate(fade, 0, springFor(FADE_SPRING, reduced))),
        run + HOLD_MS,
      ),
      setTimeout(() => {
        setCycle((current) => current + 1)
        setTyped(0)
        setCaretAtEnd(false)
        setPhase('typing')
      }, run + NEXT_MS),
    ]
    return () => {
      timers.forEach(clearTimeout)
      running.forEach((controls) => controls.stop())
    }
  }, [phase, letters, reduced, fade, tab])

  return { note, typed, phase, caretAtEnd, fade, tab, accept }
}
