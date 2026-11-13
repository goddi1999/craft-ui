import { useMemo, useState } from 'react'

import { cn } from '@/lib/utils'

import { CORRECT_COLOR, PALETTE_VARS, REASON_DELAY_MS, WRONG_COLOR } from './blank-text.constants'
import type { BlankTextProps } from './blank-text.types'
import { tokenize } from './blank-text.utils'
import { Blank } from './blank-text-parts'

/**
 * A sentence with one word as a fill-in-the-blank. Tap a word: a grey box appears behind it,
 * the word dissolves, and you type into the box, which grows and shrinks with your text. Tap
 * another word to move the blank there; tap the empty blank again to bring its word back.
 * Enter, or `ref.check()`, checks it — blue with an elastic jump when right, red with a small
 * shake when not.
 */
export function BlankText({
  text,
  blank: blankProp,
  defaultBlank = null,
  onBlankChange,
  onCheck,
  selectable = true,
  matchCase = false,
  correctColor = CORRECT_COLOR,
  wrongColor = WRONG_COLOR,
  reason,
  reasonDelay = REASON_DELAY_MS,
  muted = false,
  ref,
  className,
  ...props
}: BlankTextProps) {
  const tokens = useMemo(() => tokenize(text), [text])
  const [inner, setInner] = useState(defaultBlank)
  const blank = blankProp === undefined ? inner : blankProp
  // the blank there from the start just appears; one made by a tap plays the dissolve
  const [tapped, setTapped] = useState<number | null>(null)
  const [message, setMessage] = useState('')

  const setBlank = (next: number | null) => {
    setTapped(next)
    setInner(next)
    onBlankChange?.(next)
  }

  return (
    <p
      data-slot="blank-text"
      data-muted={muted || undefined}
      className={cn(
        'group/blank-text flex flex-wrap items-baseline gap-x-[0.48em] gap-y-[0.3em]',
        PALETTE_VARS,
        className,
      )}
      {...props}
    >
      {tokens.map((token, index) => (
        <span key={`${index}-${token.word}`} className="whitespace-nowrap">
          <span className="group-data-muted/blank-text:text-(--blank-muted)">{token.lead}</span>
          {index === blank ? (
            <Blank
              // a fresh blank for each word, so text typed for one never carries to the next
              key={index}
              handle={ref}
              answer={token.word}
              matchCase={matchCase}
              correctColor={correctColor}
              wrongColor={wrongColor}
              animateIn={tapped === index}
              reason={typeof reason === 'function' ? reason(token.word) : reason}
              reasonDelay={reasonDelay}
              onCheck={(value, correct) => {
                const result = { index, answer: token.word, value, correct }
                setMessage(correct ? 'Correct' : 'Not quite, try again')
                onCheck?.(result)
                return result
              }}
              onRestore={() => setBlank(null)}
            />
          ) : selectable ? (
            <button
              type="button"
              onClick={() => setBlank(index)}
              aria-label={`Turn “${token.word}” into the blank`}
              className="-mx-[0.18em] rounded-[0.3em] px-[0.18em] group-data-muted/blank-text:text-(--blank-muted) outline-none select-none transition-colors duration-150 [-webkit-tap-highlight-color:transparent] [touch-action:manipulation] hover:bg-foreground/[0.05] focus-visible:ring-2 focus-visible:ring-ring"
            >
              {token.word}
            </button>
          ) : (
            <span className="group-data-muted/blank-text:text-(--blank-muted)">{token.word}</span>
          )}
          <span className="group-data-muted/blank-text:text-(--blank-muted)">{token.trail}</span>
        </span>
      ))}
      <span className="sr-only" aria-live="polite">
        {message}
      </span>
    </p>
  )
}
