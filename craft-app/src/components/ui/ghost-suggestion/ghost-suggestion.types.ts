import type { ComponentProps } from 'react'

export type GhostSuggestionNote = {
  /** Typed out a letter at a time. */
  text: string
  /** The rest of the sentence, offered in a dim colour. Start it with a space to continue after a word. */
  suggestion: string
}

export type GhostSuggestionProps = Omit<ComponentProps<'div'>, 'children'> & {
  /** Typed one after another; each offers its suggestion, then the next note follows. Renders nothing when empty. */
  notes: readonly GhostSuggestionNote[]
  /** Accept by itself after `acceptAfter`. Off, it waits for Tab or a click. @default true */
  autoAccept?: boolean
  /** How long a suggestion waits before accepting itself, in ms. @default 1500 */
  acceptAfter?: number
  /** Heading in the top left, and the field's accessible name. @default 'Notes' */
  label?: string
  /** Chip in the top right. @default 'Suggestions on' */
  hint?: string
  /** Called with the note whose suggestion was just accepted. */
  onAccept?: (note: GhostSuggestionNote) => void
}

export type GhostPhase = 'typing' | 'offered' | 'accepted'

export type GhostWord =
  | { kind: 'space' }
  | { kind: 'word'; letters: { char: string; index: number }[] }
