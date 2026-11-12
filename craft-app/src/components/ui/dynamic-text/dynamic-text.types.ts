import type { ComponentProps } from 'react'

export type DynamicTextWord = {
  text: string
  /** BCP 47 language tag, so screen readers pronounce each word correctly. */
  lang?: string
}

/**
 * `morph`: letters travel, fall and land. `decode`: monospace cells scramble
 * and lock left to right. `cycle`: morphs through `words` with a greeting
 * rhythm (a long first word, faster middle words, a hold on the last).
 */
export type DynamicTextMode = 'morph' | 'decode' | 'cycle'

export type DynamicTextProps = Omit<ComponentProps<'span'>, 'children' | 'ref'> & {
  /** How the text changes. @default 'morph' */
  mode?: DynamicTextMode
  /** The string to show. Change it to animate. When set, `words` is ignored. */
  text?: string
  /** Words to rotate through when `text` is not set. Defaults depend on `mode`. */
  words?: readonly (string | DynamicTextWord)[]
  /**
   * Milliseconds each word holds. In `cycle` mode this is the first word's
   * hold; the middle words speed up from there. @default 2200 morph, 2800 decode, 900 cycle
   */
  interval?: number
  /** Start over after the last word. @default true, false in `cycle` */
  loop?: boolean
  /** Called once the last word is shown. Never called when looping. */
  onComplete?: () => void
}
