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

export type MarkerTextProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  children: ReactNode
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
