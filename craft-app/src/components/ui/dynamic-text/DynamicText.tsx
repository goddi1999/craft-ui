import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'

import { DEFAULT_INTERVAL, DEFAULT_WORDS } from './dynamic-text.constants'
import type { DynamicTextProps } from './dynamic-text.types'
import { holdFor, toWord } from './dynamic-text.utils'
import { DecodeLayer, MorphLayer } from './dynamic-text-parts'
import { useRunning } from './use-running'

/**
 * Text where letters are physical: shared letters glide to their new place on
 * an arc, old ones fall off the baseline, new ones drop in and land, and digits
 * roll like a counter. Also decodes (scramble, lock) or cycles greetings.
 */
export function DynamicText({
  mode = 'morph',
  text,
  words,
  interval,
  loop,
  onComplete,
  lang,
  className,
  ...props
}: DynamicTextProps) {
  // these defaults depend on the mode, so they are filled in here
  const list = (words ?? DEFAULT_WORDS[mode]).map(toWord)
  const hold = interval ?? DEFAULT_INTERVAL[mode]
  const repeat = loop ?? mode !== 'cycle'
  const count = list.length
  const controlled = text !== undefined
  const rootRef = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion() ?? false
  const running = useRunning(rootRef)
  // counts every advance; the shown word is derived from it
  const [step, setStep] = useState(0)
  const index = repeat ? step % Math.max(count, 1) : Math.min(step, count - 1)
  const isDone = !(controlled || repeat) && index === count - 1
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    if (controlled || isDone || !running || count < 2) return
    const timer = setTimeout(() => setStep((current) => current + 1), holdFor(mode, index, count, hold))
    return () => clearTimeout(timer)
  }, [controlled, isDone, running, count, mode, index, hold])

  useEffect(() => {
    if (isDone) onCompleteRef.current?.()
  }, [isDone])

  // an empty words list shows nothing rather than reading past the end
  const current = controlled ? { text } : (list[index] ?? { text: '' })

  return (
    <span
      ref={rootRef}
      data-slot="dynamic-text"
      lang={current.lang ?? lang}
      className={cn('inline-block whitespace-pre tabular-nums', className)}
      {...props}
    >
      {/* only announce text the app sets; words rotating on their own would talk over the reader */}
      <span aria-live={controlled ? 'polite' : 'off'} className="sr-only">
        {current.text}
      </span>
      {mode === 'decode' ? (
        <DecodeLayer text={current.text} running={running} reduced={reduced} />
      ) : (
        <MorphLayer text={current.text} reduced={reduced} />
      )}
    </span>
  )
}
