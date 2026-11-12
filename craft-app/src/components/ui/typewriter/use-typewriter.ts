import { useEffect, useRef, useState } from 'react'

import {
  CARET_IDLE_MS,
  DEFAULT_TYPO_RATE,
  NEXT_SEQUENCE_DELAY_MS,
  SELECT_HOLD_MS,
  SELECT_SWEEP_MS,
  TYPO_NOTICE_MS,
} from './typewriter.constants'
import type { TypewriterDeleteMode, TypewriterSequence } from './typewriter.types'
import { createRandom, neighbours, typingDelay } from './typewriter.utils'

type Position = { sequence: number; char: number; deleting: boolean }

export type TypewriterScreen = {
  text: string
  /** Characters at the end of `text` shown as selected. */
  selected: number
}

type TypewriterTiming = {
  typingSpeed: number
  deleteSpeed: number
  startDelay: number
  loopDelay: number
  pauseBeforeDelete: number
  autoLoop: boolean
  naturalVariance: boolean
  deleteMode: TypewriterDeleteMode
  typos: boolean | number
  seed: number
  /** False while paused, off screen or with reduced motion. */
  running: boolean
}

// thrown out of a pending wait when the effect is torn down
class Stopped extends Error {}

/**
 * Runs the type, hold, erase loop with timers. Stopping keeps the text and the
 * position, so typing resumes where it left off.
 */
export function useTypewriter(
  sequences: readonly TypewriterSequence[],
  {
    typingSpeed,
    deleteSpeed,
    startDelay,
    loopDelay,
    pauseBeforeDelete,
    autoLoop,
    naturalVariance,
    deleteMode,
    typos,
    seed,
    running,
  }: TypewriterTiming,
) {
  const [screen, setScreen] = useState<TypewriterScreen>({ text: '', selected: 0 })
  const caretRef = useRef<HTMLSpanElement>(null)
  const position = useRef<Position>({ sequence: 0, char: 0, deleting: false })
  const random = useRef(createRandom(seed))
  // content comes through a ref, so a new array with the same phrases does not restart the loop
  const sequencesRef = useRef(sequences)

  useEffect(() => {
    sequencesRef.current = sequences
  }, [sequences])

  useEffect(() => {
    random.current = createRandom(seed)
  }, [seed])

  useEffect(() => {
    if (!running) return

    const typoRate = typeof typos === 'number' ? typos : typos ? DEFAULT_TYPO_RATE : 0
    const pos = position.current
    const timers = new Set<ReturnType<typeof setTimeout>>()
    let idleTimer: ReturnType<typeof setTimeout> | undefined
    let stopped = false

    const wait = (ms: number) =>
      new Promise<void>((resolve, reject) => {
        if (stopped) {
          reject(new Stopped())
          return
        }
        const timer = setTimeout(() => {
          timers.delete(timer)
          if (stopped) reject(new Stopped())
          else resolve()
        }, ms)
        timers.add(timer)
      })

    // every keystroke holds the caret solid; it blinks again once idle
    const keystroke = () => {
      const caret = caretRef.current
      if (!caret) return
      caret.dataset.idle = 'false'
      clearTimeout(idleTimer)
      idleTimer = setTimeout(() => {
        caret.dataset.idle = 'true'
      }, CARET_IDLE_MS)
    }

    const show = (text: string, selected = 0) => setScreen({ text, selected })

    const typeChar = async (text: string) => {
      const wrongKeys = neighbours(text[pos.char])
      if (wrongKeys && random.current() < typoRate) {
        const wrong = wrongKeys[Math.floor(random.current() * wrongKeys.length)]
        show(text.slice(0, pos.char) + wrong)
        keystroke()
        await wait(TYPO_NOTICE_MS + typingSpeed)
        show(text.slice(0, pos.char))
        keystroke()
        await wait(typingSpeed * 1.5)
      }
      pos.char += 1
      show(text.slice(0, pos.char))
      keystroke()
      await wait(typingDelay(typingSpeed, naturalVariance, random.current))
    }

    const erase = async (text: string) => {
      if (deleteMode === 'select') {
        const length = pos.char
        const step = SELECT_SWEEP_MS / Math.max(length, 1)
        for (let selected = 1; selected <= length; selected++) {
          show(text.slice(0, length), selected)
          keystroke()
          await wait(step)
        }
        await wait(SELECT_HOLD_MS)
        pos.char = 0
        show('')
        keystroke()
        return
      }
      while (pos.char > 0) {
        pos.char -= 1
        show(text.slice(0, pos.char))
        keystroke()
        await wait(deleteSpeed)
      }
    }

    /** Moves on to the next phrase. False when the run is over. */
    const advance = async (delay: number) => {
      const isLast = pos.sequence >= sequencesRef.current.length - 1
      if (isLast && !autoLoop) return false
      // advance first, so pausing during the wait cannot retype this one
      pos.sequence = isLast ? 0 : pos.sequence + 1
      pos.char = 0
      pos.deleting = false
      await wait(isLast ? loopDelay : delay)
      show('')
      return true
    }

    const phrase = async () => {
      const list = sequencesRef.current
      // sequences may have shrunk past the current phrase: start over
      if (pos.sequence >= list.length) {
        pos.sequence = 0
        pos.char = 0
        pos.deleting = false
      }
      const sequence = list[pos.sequence]
      if (!sequence) return false
      const { text } = sequence
      pos.char = Math.min(pos.char, text.length)
      // resuming after a pause: put the screen back in step
      show(text.slice(0, pos.char))

      if (!pos.deleting) {
        while (pos.char < text.length) {
          await typeChar(text)
        }
        const pause = sequence.pauseAfter ?? pauseBeforeDelete
        const isLast = pos.sequence === list.length - 1
        // looping deletes the last phrase too, instead of it vanishing
        if (!(sequence.deleteAfter || (isLast && autoLoop))) return advance(pause)
        await wait(pause)
        pos.deleting = true
      }
      await erase(text)
      return advance(NEXT_SEQUENCE_DELAY_MS)
    }

    const run = async () => {
      try {
        await wait(startDelay)
        while (await phrase()) {
          // on to the next phrase
        }
      } catch (error) {
        if (!(error instanceof Stopped)) throw error
      }
    }
    run()

    const caret = caretRef.current
    return () => {
      stopped = true
      for (const timer of timers) clearTimeout(timer)
      clearTimeout(idleTimer)
      if (caret) caret.dataset.idle = 'true'
    }
  }, [
    typingSpeed,
    deleteSpeed,
    pauseBeforeDelete,
    autoLoop,
    loopDelay,
    startDelay,
    naturalVariance,
    deleteMode,
    typos,
    running,
  ])

  return { screen, caretRef }
}
