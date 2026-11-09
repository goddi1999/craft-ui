import type { ReactNode } from 'react'

/**
 * - `line`: the band wraps line by line (inline paragraph)
 * - `sweep`: one band sweeps across the whole block, optionally angled
 * - `vertical`: the band falls top to bottom
 */
export type ShimmerMode = 'line' | 'sweep' | 'vertical'

export type ShimmerStop = {
  /** Any CSS colour for this band. */
  color: string
  /** Band width — `ch` in line/sweep mode, `lh` in vertical mode. */
  spread: number
}

export type ShimmerConfig = {
  mode: ShimmerMode
  /** Reveal speed in characters per second; higher is faster. */
  cps: number
  /** Opacity of the ghost text before it is revealed (0–1). */
  textAlpha: number
  /** Degrees added to 90deg — sweep mode only. */
  angle: number
  /** Extra ch/lh so angled bands clear the edges — sweep and vertical only. */
  offset: number
  /** Coloured bands leading the reveal, innermost last. */
  stops: readonly ShimmerStop[]
}

export type ShimmerPreset = ShimmerConfig & {
  /** Whether the preset shows question icons. */
  icons: boolean
}

export type ShimmerAccordionItem = {
  question: string
  answer: ReactNode
  /** Optional glyph that slides in beside the question. */
  icon?: ReactNode
}

export type ShimmerAccordionProps = Partial<ShimmerConfig> & {
  /** Questions and answers. @default SHIMMER_ACCORDION_ITEMS */
  items?: readonly ShimmerAccordionItem[]
  /** Reveal the question icons. @default true */
  showIcons?: boolean
  /** Index open on first render; omit to start collapsed. */
  defaultOpenIndex?: number
  /** Extra classes for the root element. */
  className?: string
}
