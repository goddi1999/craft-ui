import type { CSSProperties, HTMLAttributes } from 'react'

export type TextRevealSize = 'sm' | 'default' | 'lg'

/** How much scroll distance the reveal is spread across. */
export type TextRevealLength = 'compact' | 'default' | 'long'

/** Colour of the leading highlight edge that sweeps through the text. */
export type TextRevealAccent = 'cyan' | 'amber' | 'magenta' | 'plain'

export type TextRevealProps = {
  /** The line that fills in as the reader scrolls. */
  text: string
  size?: TextRevealSize
  length?: TextRevealLength
  accent?: TextRevealAccent
  /** Outline the element driving the timeline. */
  debug?: boolean
  className?: string
  style?: CSSProperties
} & Omit<HTMLAttributes<HTMLElement>, 'children'>
