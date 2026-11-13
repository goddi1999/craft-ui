import { motion, useAnimate, useReducedMotion } from 'motion/react'
import {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type KeyboardEvent,
  type Ref,
} from 'react'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

import {
  EMPTY,
  LIFT,
  LIFT_Y,
  RESIZE,
  SETTLE,
  SHAKE,
  SHAKE_X,
  TYPE_DELAY_MS,
  TYPE_STEP_MS,
  VANISH,
} from './blank-text.constants'
import type { BlankCheck, BlankReason, BlankStatus, BlankTextHandle } from './blank-text.types'
import { isMatch } from './blank-text.utils'

/**
 * Types the reason out a character at a time. The full text sets the size up front so the
 * tooltip doesn't grow and jump while it types, and screen readers get it whole.
 */
function Typewriter({ text }: { text: string }) {
  const reduced = useReducedMotion() === true
  const chars = Array.from(text)
  const [typed, setTyped] = useState(0)

  useEffect(() => {
    if (reduced) return
    const timers = Array.from(text).map((_, i) =>
      window.setTimeout(() => setTyped(i + 1), TYPE_DELAY_MS + i * TYPE_STEP_MS),
    )
    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [text, reduced])

  const shown = reduced ? chars.length : typed
  return (
    <span className="grid">
      <span className="sr-only">{text}</span>
      <span aria-hidden className="invisible col-start-1 row-start-1">
        {text}
      </span>
      <span aria-hidden className="col-start-1 row-start-1">
        {chars.slice(0, shown).join('')}
        {shown < chars.length && (
          <span className="ml-px inline-block h-[1.1em] w-px translate-y-[0.2em] bg-current" />
        )}
      </span>
    </span>
  )
}

/**
 * One blank: a grey box that hugs whatever is typed. It starts around the word it replaces,
 * the word dissolves out of it, and Enter (or the handle's `check`) checks the answer.
 */
export function Blank({
  answer,
  matchCase,
  correctColor,
  wrongColor,
  animateIn,
  onCheck,
  onRestore,
  reason,
  reasonDelay,
  handle,
}: {
  answer: string
  matchCase: boolean
  correctColor: string
  wrongColor: string
  /** Play the word-to-blank dissolve; off for blanks that are there from the start. */
  animateIn: boolean
  onCheck: (value: string, correct: boolean) => BlankCheck
  /** Escape, or a second tap, on an empty blank turns it back into the word. */
  onRestore: () => void
  reason?: BlankReason
  reasonDelay: number
  handle?: Ref<BlankTextHandle>
}) {
  const reduced = useReducedMotion() === true
  const [value, setValue] = useState('')
  const [status, setStatus] = useState<BlankStatus>('idle')
  const [showWord, setShowWord] = useState(animateIn && !reduced)
  const [resizing, setResizing] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const [box, animate] = useAnimate<HTMLSpanElement>()

  // a blank made by a tap takes the caret as soon as the word is gone
  useEffect(() => {
    if (animateIn && !showWord) input.current?.focus({ preventScroll: true })
  }, [animateIn, showWord])

  const show = (result: 'correct' | 'wrong') => {
    setStatus(result)
    if (reduced) return
    if (result === 'correct') {
      // up fast, then down with an elastic overshoot
      animate(box.current, { y: LIFT_Y }, LIFT).then(() => animate(box.current, { y: 0 }, SETTLE))
    } else {
      animate(box.current, { x: SHAKE_X }, SHAKE)
    }
  }

  const check = () => {
    if (!value.trim()) return null
    const correct = isMatch(value, answer, matchCase)
    show(correct ? 'correct' : 'wrong')
    return onCheck(value, correct)
  }

  useImperativeHandle(handle, () => ({
    check,
    show,
    reset: () => {
      setValue('')
      setStatus('idle')
    },
  }))

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && value.trim()) {
      event.preventDefault()
      check()
    } else if (event.key === 'Escape' && !value) {
      event.preventDefault()
      onRestore()
    }
  }

  const background =
    status === 'correct' ? correctColor : status === 'wrong' ? wrongColor : undefined
  // a plain reason shows any time; a per-result one only once that result is in
  const reasonText =
    typeof reason === 'string' ? reason : status === 'idle' ? undefined : reason?.[status]

  const blank = (
    <motion.span
      ref={box}
      data-slot="blank"
      data-status={status}
      // the box eases from the word's width to the empty blank's once; typing resizes it instantly
      layout={resizing ? 'size' : false}
      transition={{ layout: RESIZE }}
      onLayoutAnimationComplete={() => setResizing(false)}
      // a second tap on an empty blank that already has the caret brings the word back
      onPointerDown={() => {
        if (!value && document.activeElement === input.current) onRestore()
      }}
      className={cn(
        // same inset as the word's button, so the word doesn't move when the box appears
        'relative -mx-[0.18em] inline-grid min-w-[1.6em] rounded-[0.3em] bg-[color-mix(in_srgb,var(--blank-muted)_22%,transparent)] px-[0.18em] align-baseline transition-[background-color,color] duration-200',
        // white on either result colour; the colour itself only fills the background
        status !== 'idle' && 'text-white',
      )}
      style={background ? { backgroundColor: background } : undefined}
    >
      {/* sets the width: the word while it dissolves, then whatever is typed */}
      <span aria-hidden className="invisible col-start-1 row-start-1 whitespace-pre">
        {showWord ? answer : value || EMPTY}
      </span>

      {showWord && (
        <motion.span
          aria-hidden
          className="col-start-1 row-start-1 whitespace-pre"
          initial={{ opacity: 1, filter: 'blur(0px)', transform: 'scale(1)' }}
          animate={{ opacity: 0, filter: 'blur(3px)', transform: 'scale(0.92)' }}
          transition={VANISH}
          onAnimationComplete={() => {
            setResizing(true)
            setShowWord(false)
          }}
        >
          {answer}
        </motion.span>
      )}

      <input
        ref={input}
        type="text"
        value={value}
        onChange={(event) => {
          setValue(event.target.value)
          // editing after a check goes back to the plain grey box
          if (status !== 'idle') setStatus('idle')
        }}
        onKeyDown={handleKeyDown}
        aria-label="Fill in the blank"
        aria-invalid={status === 'wrong' || undefined}
        enterKeyHint="done"
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        className={cn(
          // laid over the box instead of in it, so only the hidden copy of the text sets the width
          'absolute inset-0 size-full min-w-0 border-0 bg-transparent px-[0.18em] py-0 text-inherit outline-none [font:inherit]',
          showWord && 'opacity-0',
        )}
      />
    </motion.span>
  )

  if (!reasonText) return blank
  return (
    <Tooltip delayDuration={reasonDelay}>
      <TooltipTrigger asChild>{blank}</TooltipTrigger>
      <TooltipContent
        side="top"
        sideOffset={10}
        className="max-w-64 text-left text-[13px] leading-snug"
      >
        {/* keyed so a new reason types out from the start */}
        <Typewriter key={reasonText} text={reasonText} />
      </TooltipContent>
    </Tooltip>
  )
}
