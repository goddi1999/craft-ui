import type { ElementType, HTMLAttributes, ReactNode } from 'react'

export type MarkType = 'highlight' | 'underline' | 'circle' | 'box' | 'strike'

export type MarkProps = Omit<HTMLAttributes<HTMLElement>, 'children' | 'color'> & {
  children: ReactNode
  /** How the phrase is marked. @default 'highlight' */
  type?: MarkType
  /** Any CSS colour. Leave it out for the type's own ink. */
  color?: string
  /** Pen width in px. Leave it out for a width that suits the font size. */
  strokeWidth?: number
}

/** Which words of a sentence get marked, and how. */
export type MarkerSpec = {
  /**
   * The words to mark, as written in the sentence. A string is one word or
   * phrase; an array marks each entry. Matching ignores case unless told otherwise.
   */
  words: string | readonly string[]
  /** @default 'highlight' */
  type?: MarkType
  /** Any CSS colour. Leave it out for the type's own ink. */
  color?: string
  /** Pen width in px. Leave it out for a width that suits the font size. */
  strokeWidth?: number
  /**
   * Which match to mark when a word appears more than once: `'all'`, or a
   * 0-based index (`-1` is the last match).
   * @default 'all'
   */
  occurrence?: 'all' | number
  /** @default false */
  caseSensitive?: boolean
  /** Match whole words only, so "art" does not mark "start". @default true */
  wholeWord?: boolean
  className?: string
}

/** A sentence to render, optionally with marks that apply to it alone. */
export type MarkerSentence =
  | string
  | {
      text: string
      marks?: readonly MarkerSpec[]
      className?: string
    }

/** A word that was found and marked. */
export type MarkedWord = {
  /** The text as written in the sentence. */
  text: string
  type: MarkType
  /** Index into `sentences`. */
  sentence: number
  /** Character range inside that sentence. */
  start: number
  end: number
}

export type MarkerResult = {
  matched: MarkedWord[]
  /** Words that were asked for but are not in their sentence. */
  missed: string[]
}

/** A colour per mark type, for every mark in a `MarkerText` that has no colour of its own. */
export type MarkColors = Partial<Record<MarkType, string>>

export type MarkerTextProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  /**
   * Any CSS colour per type, e.g. `{ highlight: '#a5f3fc', strike: 'tomato' }`.
   * A mark's own `color` wins; types left out keep their default ink.
   */
  colors?: MarkColors
  /** Text with `Mark` phrases at any depth. Rendered after `sentences`. */
  children?: ReactNode
  /**
   * Sentences to render, each with the words to mark. Use this instead of
   * writing `Mark` by hand when the text comes from data.
   */
  sentences?: readonly MarkerSentence[]
  /** Marks applied to every sentence, after each sentence's own marks. */
  marks?: readonly MarkerSpec[]
  /** Element each sentence renders as; sentences in a `span` are joined by a space. @default 'span' */
  sentenceAs?: ElementType
  /** Called with the words that were found and the ones that were not. */
  onMarks?: (result: MarkerResult) => void
  /**
   * Controlled. `true` draws the marks, `false` hides them. Leave it out and
   * they draw once, the first time the text is mostly on screen.
   */
  show?: boolean
  /** Milliseconds between one mark finishing and the next one starting. @default 140 */
  gap?: number
  /** Called after the last mark lands. */
  onDrawn?: () => void
  /** Element to render as. @default 'div' */
  as?: ElementType
}

export type Point = [number, number]

export type Box = { left: number; top: number; right: number; bottom: number }

export type MarkEntry = {
  el: HTMLElement
  type: MarkType
  color?: string
  strokeWidth?: number
}

export type MarkerRegistry = {
  /** Colour per type from the enclosing `MarkerText`. */
  colors?: MarkColors
  add: (id: string, entry: MarkEntry) => () => void
}

export type Stroke = {
  key: string
  type: MarkType
  /** The ink, a filled outline. */
  shape: string
  /** The pen's path, used as a mask that uncovers the ink as it travels. */
  pen: string
  penWidth: number
  length: number
  /** Custom colour; without one the type's default ink applies. */
  color?: string
  /** Behind the text (highlights) or over it (everything else). */
  under: boolean
  /** Highlighter ink is see-through; pens are solid. */
  alpha: number
  delay: number
  duration: number
}

export type StrokeShape = Omit<Stroke, 'delay' | 'duration'>
