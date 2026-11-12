import { useId, useState, type FocusEvent, type KeyboardEvent, type MouseEvent } from 'react'
import { motion, useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'

import { ACCEPT_AFTER_MS } from './ghost-suggestion.constants'
import type { GhostSuggestionProps } from './ghost-suggestion.types'
import { toGhostWords } from './ghost-suggestion.utils'
import { Caret, GhostLetter, TabKey } from './ghost-suggestion-parts'
import { useGhostCycle } from './use-ghost-cycle'

/**
 * A note that finishes your sentence in a dim colour with a Tab key beside it.
 * Tab or a click accepts: each letter brightens with a small hop, left to right.
 */
export function GhostSuggestion(props: GhostSuggestionProps) {
  // nothing to type without a note
  if (props.notes.length === 0) return null
  return <GhostSuggestionField {...props} />
}

function GhostSuggestionField({
  notes,
  autoAccept = true,
  acceptAfter = ACCEPT_AFTER_MS,
  label = 'Notes',
  hint = 'Suggestions on',
  onAccept,
  onKeyDown,
  onClick,
  onFocus,
  onBlur,
  className,
  ...props
}: GhostSuggestionProps) {
  const reduced = useReducedMotion() ?? false
  const hintId = useId()
  const [focused, setFocused] = useState(false)
  const { note, typed, phase, caretAtEnd, fade, tab, accept } = useGhostCycle({
    notes,
    autoAccept,
    acceptAfter,
    reduced,
    onAccept,
  })

  const typedText = Array.from(note.text).slice(0, typed).join('')
  const words = phase === 'typing' ? [] : toGhostWords(note.suggestion)
  const accepted = phase === 'accepted'
  const caret = <Caret blinking={phase !== 'typing' && !reduced} />
  // the field's value for screen readers, and the suggestion read out only while focused
  const value = accepted ? note.text + note.suggestion : typedText
  const status = focused && phase === 'offered' ? `Suggestion: ${note.suggestion.trim()}` : ''

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event)
    if (event.defaultPrevented || phase !== 'offered') return
    // Tab only accepts while there is something to accept; otherwise it moves focus as usual
    if (event.key !== 'Tab' || event.shiftKey || event.altKey || event.ctrlKey || event.metaKey) {
      return
    }
    event.preventDefault()
    accept()
  }

  function handleClick(event: MouseEvent<HTMLDivElement>) {
    onClick?.(event)
    if (!event.defaultPrevented) accept()
  }

  function handleFocus(event: FocusEvent<HTMLDivElement>) {
    onFocus?.(event)
    setFocused(true)
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    onBlur?.(event)
    setFocused(false)
  }

  return (
    <div
      data-slot="ghost-suggestion"
      role="textbox"
      aria-readonly
      aria-label={label}
      aria-describedby={hintId}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={cn(
        'w-full max-w-[380px] cursor-text rounded-3xl bg-muted px-[18px] pt-3.5 pb-[18px] outline-none select-none focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
      {...props}
    >
      <div
        aria-hidden
        className="mb-2.5 flex items-center justify-between gap-3 text-xs font-medium text-muted-foreground"
      >
        <span className="truncate">{label}</span>
        <span className="shrink-0 rounded-full bg-foreground/[0.09] px-[9px] py-[3px]">
          {hint}
        </span>
      </div>

      <motion.p
        aria-hidden
        className="min-h-[3em] text-[17px] leading-normal tracking-[-0.01em] text-foreground"
        style={{ opacity: fade }}
      >
        <span>{typedText}</span>
        {!caretAtEnd && caret}
        <span>
          {words.map((word, w) =>
            word.kind === 'space' ? (
              ' '
            ) : (
              // one unbreakable span per word, so a line only wraps between words
              <span key={w} className="whitespace-nowrap">
                {word.letters.map((letter) => (
                  <GhostLetter
                    key={letter.index}
                    char={letter.char}
                    index={letter.index}
                    accepted={accepted}
                    reduced={reduced}
                  />
                ))}
              </span>
            ),
          )}
        </span>
        {caretAtEnd && caret}
        <TabKey progress={tab} />
      </motion.p>

      <span className="sr-only">{value}</span>
      <span role="status" className="sr-only">
        {status}
      </span>
      <span id={hintId} hidden>
        Press Tab to accept a suggestion.
      </span>
    </div>
  )
}
