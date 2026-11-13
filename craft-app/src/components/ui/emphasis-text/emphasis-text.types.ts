import type { ComponentProps } from 'react'

export type EmphasisWeight = { name: string; value: number }

export type EmphasisTextProps = Omit<ComponentProps<'div'>, 'children' | 'onChange'> & {
  /** The sentence; words are split on spaces. */
  text: string
  /** Controlled weight per word, by index. */
  weights?: number[]
  onWeightsChange?: (weights: number[]) => void
  /** Weights a word cycles through on repeated taps; the first is the resting weight. Needs a variable font to animate. @default Regular → Bold → Light */
  steps?: EmphasisWeight[]
  /** Accessible name for the group. @default 'Set emphasis' */
  label?: string
}
