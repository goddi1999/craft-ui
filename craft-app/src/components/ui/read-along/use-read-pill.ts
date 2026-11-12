import { animate, useMotionValue, useTransform } from 'motion/react'
import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react'

import {
  FADE_SPRING,
  GONE_OPACITY,
  LEAD_SPRING,
  LINE_SPRING,
  LINE_TOLERANCE,
  TRAIL_SPRING,
} from './read-along.constants'
import { clamp, springFor, wordBox } from './read-along.utils'

type ReadPillOptions = {
  rootRef: RefObject<HTMLDivElement | null>
  wordRefs: RefObject<(HTMLSpanElement | null)[]>
  current: number
  text: string
  reduced: boolean
}

/**
 * Moves the pill behind the current word. Its two edges are separate springs, the one in
 * front of the move quick and the one behind slow, so it stretches as it travels.
 */
export function useReadPill({ rootRef, wordRefs, current, text, reduced }: ReadPillOptions) {
  const left = useMotionValue(0)
  const right = useMotionValue(0)
  const top = useMotionValue(0)
  const fade = useMotionValue(0)
  const width = useTransform(() => Math.max(0, right.get() - left.get()))
  const opacity = useTransform(fade, (v) => clamp(v, 0, 1))
  const lineTop = useRef<number | null>(null)
  const leftTarget = useRef(0)
  const currentRef = useRef(current)

  // layout effect so the measure sees the words where they are about to paint
  useLayoutEffect(() => {
    currentRef.current = current
    if (current < 0) {
      lineTop.current = null
      animate(fade, 0, springFor(FADE_SPRING, reduced))
      return
    }
    const root = rootRef.current
    const word = wordRefs.current[current]
    if (!root || !word) return
    const box = wordBox(root, word)

    const forward = box.left >= leftTarget.current
    if (
      lineTop.current === null ||
      Math.abs(box.top - lineTop.current) > LINE_TOLERANCE ||
      fade.get() < GONE_OPACITY
    ) {
      // first word or a new line: open up from the word's left edge instead of sliding across the text
      left.jump(box.left)
      right.jump(box.left)
      top.jump(box.top)
    }
    lineTop.current = box.top
    leftTarget.current = box.left

    animate(fade, 1, springFor(FADE_SPRING, reduced))
    animate(left, box.left, springFor(forward ? TRAIL_SPRING : LEAD_SPRING, reduced))
    animate(right, box.right, springFor(forward ? LEAD_SPRING : TRAIL_SPRING, reduced))
    animate(top, box.top, springFor(LINE_SPRING, reduced))
  }, [current, text, reduced, rootRef, wordRefs, left, right, top, fade])

  // a resize reflows the text, so put the pill straight back on its word
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    let lastWidth = root.offsetWidth
    const observer = new ResizeObserver(() => {
      if (root.offsetWidth === lastWidth) return
      lastWidth = root.offsetWidth
      const word = wordRefs.current[currentRef.current]
      if (!word) return
      const box = wordBox(root, word)
      left.jump(box.left)
      right.jump(box.right)
      top.jump(box.top)
      lineTop.current = box.top
      leftTarget.current = box.left
    })
    observer.observe(root)
    return () => observer.disconnect()
  }, [rootRef, wordRefs, left, right, top])

  useEffect(() => {
    return () => {
      left.stop()
      right.stop()
      top.stop()
      fade.stop()
    }
  }, [left, right, top, fade])

  return { x: left, y: top, width, opacity }
}
