import { useEffect, useEffectEvent, useLayoutEffect, useRef, useState } from 'react'
import { animate, useMotionValue, type MotionValue } from 'motion/react'

import {
  CLEAR_SPRING,
  ENTER_SPRING,
  HOLD_MS,
  LINE,
  NEXT_MS,
  PAD_X,
  PAD_Y,
  QUESTION_MS,
  REPLY_MS,
  REPLY_WIDTH,
  SIZE_SPRING,
  STREAM_MS,
  THINKING_SPRING,
  WORD_STEP_MS,
} from './streaming-reply.constants'
import { springFor } from './streaming-reply.utils'

type StreamingTurnOptions = {
  wordCount: number
  thinkingLabel: string
  reduced: boolean
  /** Clear the thread after the answer and call this; leave it out to keep the turn on screen. */
  onDone?: () => void
}

/**
 * One question and answer: the question rises in, the reply opens as a small
 * "Thinking" pill, then widens and grows a line at a time as words land.
 */
export function useStreamingTurn({ wordCount, thinkingLabel, reduced, onDone }: StreamingTurnOptions) {
  const threadRef = useRef<HTMLDivElement>(null)
  const thinkingRef = useRef<HTMLSpanElement>(null)
  const lastWord = useRef<HTMLElement>(null)
  const [full, setFull] = useState(0)
  const [streaming, setStreaming] = useState(false)
  const [thinkingGone, setThinkingGone] = useState(false)

  const question = useMotionValue(0)
  const reply = useMotionValue(0)
  const thread = useMotionValue(1)
  const width = useMotionValue(0)
  const height = useMotionValue(LINE + PAD_Y * 2)
  const thinking = useMotionValue(1)
  const clears = onDone !== undefined

  const rise = useEffectEvent((value: MotionValue<number>) => {
    animate(value, 1, springFor(ENTER_SPRING, reduced))
  })
  const clearThread = useEffectEvent((to: number) => {
    animate(thread, to, springFor(CLEAR_SPRING, reduced))
  })
  const finish = useEffectEvent(() => onDone?.())

  // the reply opens from the size of the "Thinking" pill
  useLayoutEffect(() => {
    const label = thinkingRef.current
    if (!label || streaming) return
    const target = label.offsetWidth + PAD_X * 2
    if (width.get() === 0) width.jump(target)
    else animate(width, target, springFor(SIZE_SPRING, reduced))
  }, [thinkingLabel, streaming, reduced, width])

  // the reply's lines are as long as the open bubble, so they never re-wrap while it grows
  useEffect(() => {
    const el = threadRef.current
    if (!el) return
    const observer = new ResizeObserver(() => setFull(el.offsetWidth * REPLY_WIDTH))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const timers = [
      setTimeout(() => rise(question), QUESTION_MS),
      setTimeout(() => rise(reply), REPLY_MS),
      setTimeout(() => setStreaming(true), STREAM_MS),
    ]
    return () => timers.forEach(clearTimeout)
  }, [question, reply])

  useEffect(() => {
    if (!streaming) return
    const fade = animate(thinking, 0, {
      ...springFor(THINKING_SPRING, reduced),
      // the shimmer runs forever, so unmount the label once it is out of sight
      onComplete: () => setThinkingGone(true),
    })
    return () => fade.stop()
  }, [streaming, reduced, thinking])

  // open wide; on a resize the reply re-wraps, so follow its last word down
  useEffect(() => {
    if (!streaming) return
    animate(width, full, springFor(SIZE_SPRING, reduced))
    const last = lastWord.current
    if (last) {
      animate(height, last.offsetTop + last.offsetHeight + PAD_Y * 2, springFor(SIZE_SPRING, reduced))
    }
  }, [streaming, full, reduced, width, height])

  useEffect(() => {
    if (!streaming) return
    // looping got turned off mid-clear: bring the thread back
    if (!clears) {
      clearThread(1)
      return
    }
    const end = wordCount * WORD_STEP_MS
    const timers = [
      setTimeout(() => clearThread(0), end + HOLD_MS),
      setTimeout(() => finish(), end + NEXT_MS),
    ]
    return () => timers.forEach(clearTimeout)
  }, [streaming, clears, wordCount])

  useEffect(
    () => () => [question, reply, thread, width, height, thinking].forEach((value) => value.stop()),
    [question, reply, thread, width, height, thinking],
  )

  /** A word just started rising: grow the bubble down to its line. */
  function revealWord(el: HTMLElement) {
    lastWord.current = el
    animate(height, el.offsetTop + el.offsetHeight + PAD_Y * 2, springFor(SIZE_SPRING, reduced))
  }

  return {
    threadRef,
    thinkingRef,
    full,
    streaming,
    thinkingGone,
    question,
    reply,
    thread,
    width,
    height,
    thinking,
    revealWord,
  }
}
