import { useRef, type Ref } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'

import {
  APPEAR,
  DEFAULT_SEQUENCES,
  DELETE_SPEED_MS,
  LOOP_DELAY_MS,
  PAUSE_BEFORE_DELETE_MS,
  SEED,
  START_DELAY_MS,
  TYPING_SPEED_MS,
} from './typewriter.constants'
import type { TypewriterProps } from './typewriter.types'
import { useTypewriter } from './use-typewriter'

import './typewriter.css'

/**
 * Types phrases with a human rhythm, holds, then erases them key by key or by
 * selecting and cutting, and loops. The caret blinks only once typing stops.
 */
export function Typewriter({
  sequences = DEFAULT_SEQUENCES,
  typingSpeed = TYPING_SPEED_MS,
  startDelay = START_DELAY_MS,
  autoLoop = true,
  loopDelay = LOOP_DELAY_MS,
  deleteSpeed = DELETE_SPEED_MS,
  pauseBeforeDelete = PAUSE_BEFORE_DELETE_MS,
  naturalVariance = true,
  deleteMode = 'backspace',
  typos = false,
  seed = SEED,
  paused = false,
  as: Component = 'div',
  className,
  textClassName,
  ...props
}: TypewriterProps) {
  const textRef = useRef<HTMLSpanElement>(null)
  const inView = useInView(textRef)
  const reduced = useReducedMotion() ?? false
  const { screen, caretRef } = useTypewriter(sequences, {
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
    running: !paused && inView && !reduced,
  })

  // reduced motion: no typing loop, just the final phrase
  const shown = reduced ? { text: sequences.at(-1)?.text ?? '', selected: 0 } : screen
  const kept = shown.text.slice(0, shown.text.length - shown.selected)
  const selected = shown.text.slice(kept.length)

  return (
    <Component
      data-slot="typewriter"
      className={cn(
        '@container flex w-full items-center justify-center tracking-tight text-foreground',
        className,
      )}
      {...props}
    >
      {/* screen readers get every phrase once instead of whatever partial string is on screen */}
      <span className="sr-only">{sequences.map((sequence) => sequence.text).join(', ')}</span>
      <motion.span
        ref={textRef}
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={APPEAR}
        className={cn(
          // every phrase sits invisibly in the same grid cell, so the box is as
          // wide as the widest one and the text grows from a fixed left edge
          'inline-grid justify-items-start pr-[0.25em] text-4xl leading-[1.2] whitespace-pre @lg:text-5xl @2xl:text-6xl',
          textClassName,
        )}
      >
        {sequences.map((sequence, index) => (
          <span key={index} className="invisible col-start-1 row-start-1">
            {sequence.text}
          </span>
        ))}
        <span className="col-start-1 row-start-1 min-h-[1.2em]">
          {kept}
          <Caret ref={caretRef} />
          {selected && (
            // em radius so the highlight corners scale with the text
            <span className="rounded-[0.08em] bg-primary/25 dark:bg-primary/30">{selected}</span>
          )}
        </span>
      </motion.span>
    </Component>
  )
}

// takes no room, so the text never shifts when the caret moves to the start of a selection
function Caret({ ref }: { ref: Ref<HTMLSpanElement> }) {
  return (
    <span className="relative inline-block w-0">
      <span
        ref={ref}
        data-slot="typewriter-caret"
        data-idle="true"
        className="absolute bottom-[-0.1em] left-[0.04em] h-[1.05em] w-[0.08em] min-w-[2px] bg-current"
      />
    </span>
  )
}
