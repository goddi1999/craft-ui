import type { ComponentProps, Ref } from 'react'

export type BlankStatus = 'idle' | 'correct' | 'wrong'

export type BlankReason = string | { correct?: string; wrong?: string }

export type BlankCheck = {
  /** Index of the word in the sentence. */
  index: number
  /** The word that was turned into the blank. */
  answer: string
  /** What was typed. */
  value: string
  correct: boolean
}

/** Drive the blank from outside, e.g. from a Check button. */
export type BlankTextHandle = {
  /** Checks what is typed against the hidden word; `null` when there is nothing to check. */
  check: () => BlankCheck | null
  /** Plays a result without checking, e.g. to preview it. */
  show: (status: 'correct' | 'wrong') => void
  /** Empties the blank and puts it back to grey. */
  reset: () => void
}

export type BlankTextProps = Omit<ComponentProps<'p'>, 'children' | 'ref'> & {
  /** The sentence. Punctuation stays outside the blank. */
  text: string
  /** Controlled: index of the word that is the blank, or `null` for none. One at a time. */
  blank?: number | null
  /** The word that starts as the blank. */
  defaultBlank?: number | null
  onBlankChange?: (blank: number | null) => void
  /** Called each time the blank is checked, by Enter or `check()`. */
  onCheck?: (check: BlankCheck) => void
  /** Tap a word to make it the blank; tap another to move it; tap the empty blank again to bring the word back. @default true */
  selectable?: boolean
  /** Compare case too. Accents always count. @default false */
  matchCase?: boolean
  /** Box colour when right. Any CSS colour. @default green, `#128238` light / `#34A85F` dark */
  correctColor?: string
  /** Box colour when wrong. Any CSS colour. @default deep red, `#A50B0B` light / `#D9473F` dark */
  wrongColor?: string
  /** Set every word but the blank in the palette's grey, so the blank stands out. @default false */
  muted?: boolean
  /**
   * Why the answer is what it is, typed out in a tooltip when the pointer rests on the blank.
   * A string shows any time; `{ correct, wrong }` shows the one matching the last check. A
   * function gets the hidden word, so each word can have its own reason.
   */
  reason?: BlankReason | ((answer: string) => BlankReason | undefined)
  /** Ms the pointer rests on the blank before the reason opens. @default 700 */
  reasonDelay?: number
  ref?: Ref<BlankTextHandle>
}
