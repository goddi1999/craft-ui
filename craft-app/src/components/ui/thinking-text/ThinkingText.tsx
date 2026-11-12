import { useEffect, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'

import { cn } from '@/lib/utils'

import {
  DEFAULT_TEXTS,
  ELAPSED_TICK_MS,
  INTERVAL_MS,
  LETTER_VARIANTS,
  WAVE_STEP,
  WORD_VARIANTS,
} from './thinking-text.constants'
import type { ThinkingTextProps } from './thinking-text.types'

import './thinking-text.css'

/**
 * A status line for an assistant at work: each word rises in letter by letter
 * out of a blur, a brightness wave runs through it, then it blurs away upward.
 */
export function ThinkingText({
  texts = DEFAULT_TEXTS,
  interval = INTERVAL_MS,
  label = 'Loading',
  showElapsed = false,
  className,
  ...props
}: ThinkingTextProps) {
  const [step, setStep] = useState(0)
  // modulo again, so a shorter texts list never reads past the end
  const index = texts.length > 0 ? step % texts.length : 0
  const text = texts.length > 0 ? texts[index] : ''

  useEffect(() => {
    if (texts.length < 2) return
    const timer = setInterval(() => setStep((current) => (current + 1) % texts.length), interval)
    return () => clearInterval(timer)
  }, [interval, texts.length])

  return (
    <output
      aria-live="polite"
      data-slot="thinking-text"
      className={cn(
        'flex items-baseline justify-center gap-3 text-3xl font-bold text-foreground',
        className,
      )}
      {...props}
    >
      <span className="sr-only">{label}</span>
      {/* with reduced motion the words swap with a fade only, and the css wave holds still */}
      <MotionConfig reducedMotion="user">
        <span aria-hidden className="relative flex justify-center">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={index}
              variants={WORD_VARIANTS}
              initial="enter"
              animate="shown"
              exit="exit"
              className="flex min-w-max justify-center whitespace-pre"
            >
              {Array.from(text).map((char, i) => (
                <motion.span key={i} variants={LETTER_VARIANTS} className="inline-block">
                  <span
                    data-slot="thinking-text-letter"
                    className="inline-block"
                    style={{ animationDelay: `${i * WAVE_STEP}s` }}
                  >
                    {char}
                  </span>
                </motion.span>
              ))}
            </motion.span>
          </AnimatePresence>
        </span>
      </MotionConfig>
      {showElapsed && <Elapsed />}
    </output>
  )
}

// its own component so turning the timer on always counts from zero
function Elapsed() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const startedAt = Date.now()
    const timer = setInterval(
      () => setSeconds(Math.floor((Date.now() - startedAt) / 1000)),
      ELAPSED_TICK_MS,
    )
    return () => clearInterval(timer)
  }, [])

  return (
    <span aria-hidden className="text-base font-medium text-muted-foreground tabular-nums">
      {seconds}s
    </span>
  )
}
