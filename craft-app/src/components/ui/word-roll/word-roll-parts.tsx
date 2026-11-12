import { useEffect, useEffectEvent, useLayoutEffect, useRef } from 'react'
import { animate, motion, useMotionValue, usePresence, useTransform } from 'motion/react'

import {
  ENTER_DELAY_MS,
  ENTER_STAGGER_MS,
  EXIT_STAGGER_MS,
  FADE,
  LETTER_SPRING,
  REMOVE_MS,
  SHIFT,
} from './word-roll.constants'
import { clamp, springFor } from './word-roll.utils'

function RollLetter({
  char,
  index,
  present,
  first,
  reduced,
}: {
  char: string
  index: number
  present: boolean
  first: boolean
  reduced: boolean
}) {
  // 1 sits below the slot, 0 on the line, -1 above it
  const step = useMotionValue(first ? 0 : 1)
  const y = useTransform(step, (s) => `${s * SHIFT}%`)
  const opacity = useTransform(step, (s) => clamp(1 - Math.abs(s) * FADE, 0, 1))

  useEffect(() => {
    const delayMs = present ? ENTER_DELAY_MS + index * ENTER_STAGGER_MS : index * EXIT_STAGGER_MS
    const roll = animate(step, present ? 0 : -1, {
      ...springFor(LETTER_SPRING, reduced),
      delay: delayMs / 1000,
    })
    return () => roll.stop()
  }, [present, index, reduced, step])

  return (
    <motion.span className="inline-block whitespace-pre" style={{ y, opacity }}>
      {char}
    </motion.span>
  )
}

/**
 * One word in the slot. It rolls in letter by letter, and when a newer word
 * replaces it, rolls up and out the same way before it unmounts.
 */
export function RollWord({
  word,
  first,
  reduced,
  onMeasure,
}: {
  word: string
  first: boolean
  reduced: boolean
  onMeasure: (width: number) => void
}) {
  const [isPresent, safeToRemove] = usePresence()
  const ref = useRef<HTMLSpanElement>(null)
  const reportWidth = useEffectEvent(onMeasure)
  // safeToRemove changes on every render of AnimatePresence, which would restart the wait
  const remove = useEffectEvent(() => safeToRemove?.())

  // only the word that is staying sizes the slot; a font loading in or the
  // viewport changing the type size measures it again
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || !isPresent) return
    reportWidth(el.offsetWidth)
    const observer = new ResizeObserver(() => reportWidth(el.offsetWidth))
    observer.observe(el)
    return () => observer.disconnect()
  }, [isPresent])

  useEffect(() => {
    if (isPresent) return
    const timer = setTimeout(() => remove(), REMOVE_MS)
    return () => clearTimeout(timer)
  }, [isPresent])

  return (
    <span ref={ref} className="absolute top-0 left-0 flex w-max">
      {Array.from(word, (char, i) => (
        <RollLetter
          key={i}
          char={char}
          index={i}
          present={isPresent}
          first={first}
          reduced={reduced}
        />
      ))}
    </span>
  )
}
