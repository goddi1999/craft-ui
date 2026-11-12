import { Fragment, useEffect, useEffectEvent, useRef, type ReactNode, type Ref } from 'react'
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from 'motion/react'

import { cn } from '@/lib/utils'

import {
  PAD_X,
  QUESTION_SCALE,
  RISE,
  SHARP,
  SHIMMER_S,
  WORD_BLUR,
  WORD_RISE,
  WORD_SPRING,
  WORD_STEP_MS,
} from './streaming-reply.constants'
import type { StreamingReplyTurn } from './streaming-reply.types'
import { clamp, springFor } from './streaming-reply.utils'
import { useStreamingTurn } from './use-streaming-turn'

const opaque = (v: number) => clamp(v, 0, 1)

/** One word: it rises 6px and sharpens out of a blur on its own spring. */
function StreamWord({
  children,
  delay,
  streaming,
  reduced,
  onReveal,
}: {
  children: ReactNode
  delay: number
  streaming: boolean
  reduced: boolean
  onReveal: (el: HTMLElement) => void
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const progress = useMotionValue(0)
  const opacity = useTransform(progress, opaque)
  const y = useTransform(progress, (v) => (1 - v) * WORD_RISE)
  // no filter before it starts or once it is sharp, so waiting words cost nothing
  const filter = useTransform(progress, (v) =>
    v <= 0 || v >= SHARP ? 'none' : `blur(${(1 - opaque(v)) * WORD_BLUR}px)`,
  )

  const reveal = useEffectEvent(() => {
    animate(progress, 1, springFor(WORD_SPRING, reduced))
    if (ref.current) onReveal(ref.current)
  })

  useEffect(() => {
    if (!streaming) return
    const timer = setTimeout(() => reveal(), delay)
    return () => clearTimeout(timer)
  }, [streaming, delay])

  useEffect(() => () => progress.stop(), [progress])

  return (
    <motion.span ref={ref} className="inline-block" style={{ opacity, y, filter }}>
      {children}
    </motion.span>
  )
}

/** The pill's label, with a highlight sweeping across it. */
function ThinkingLabel({
  ref,
  children,
  opacity,
  reduced,
}: {
  ref: Ref<HTMLSpanElement>
  children: ReactNode
  opacity: MotionValue<number>
  reduced: boolean
}) {
  return (
    <motion.span
      ref={ref}
      className={cn(
        'absolute top-[9px] left-3.5 font-medium whitespace-nowrap',
        reduced
          ? 'text-muted-foreground'
          : 'bg-linear-to-r from-muted-foreground from-20% via-foreground via-50% to-muted-foreground to-80% bg-[length:200%_100%] bg-clip-text text-transparent',
      )}
      style={{ opacity }}
      animate={reduced ? undefined : { backgroundPosition: ['0% 0%', '-200% 0%'] }}
      transition={{ duration: SHIMMER_S, ease: 'linear', repeat: Infinity }}
    >
      {children}
    </motion.span>
  )
}

/** One question and its streamed answer, from the question rising in to the thread clearing. */
export function StreamingTurn({
  turn,
  thinkingLabel,
  onDone,
}: {
  turn: StreamingReplyTurn
  thinkingLabel: string
  onDone?: () => void
}) {
  const reduced = useReducedMotion() ?? false
  const words = turn.answer.split(' ')
  const {
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
  } = useStreamingTurn({ wordCount: words.length, thinkingLabel, reduced, onDone })

  const threadOpacity = useTransform(thread, opaque)
  const questionOpacity = useTransform(question, opaque)
  const questionY = useTransform(question, (v) => (1 - v) * RISE)
  const questionScale = useTransform(question, (v) => QUESTION_SCALE + (1 - QUESTION_SCALE) * v)
  const replyOpacity = useTransform(reply, opaque)
  const replyY = useTransform(reply, (v) => (1 - v) * RISE)
  const thinkingOpacity = useTransform(thinking, opaque)
  // the reply's lines keep the open bubble's length from the first word
  const textWidth = Math.max(0, full - PAD_X * 2)

  return (
    <motion.div
      ref={threadRef}
      className="flex flex-col gap-2.5"
      style={{ opacity: threadOpacity }}
    >
      <motion.div
        className="max-w-[85%] self-end rounded-3xl bg-primary px-3.5 py-[9px] font-medium text-primary-foreground"
        style={{ opacity: questionOpacity, y: questionY, scale: questionScale }}
      >
        {turn.question}
      </motion.div>

      <motion.div
        aria-hidden
        className="relative self-start overflow-hidden rounded-3xl bg-muted text-foreground"
        style={{ opacity: replyOpacity, y: replyY, width, height }}
      >
        {!thinkingGone && (
          <ThinkingLabel ref={thinkingRef} opacity={thinkingOpacity} reduced={reduced}>
            {thinkingLabel}
          </ThinkingLabel>
        )}
        <p className="absolute top-[9px] left-3.5" style={{ width: textWidth }}>
          {words.map((word, i) => (
            <Fragment key={i}>
              {i > 0 && ' '}
              <StreamWord
                delay={i * WORD_STEP_MS}
                streaming={streaming}
                reduced={reduced}
                onReveal={revealWord}
              >
                {word}
              </StreamWord>
            </Fragment>
          ))}
        </p>
      </motion.div>

      <span role="status" className="sr-only">
        {streaming ? turn.answer : `${thinkingLabel}…`}
      </span>
    </motion.div>
  )
}
