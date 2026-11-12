import type { ComponentProps } from 'react'

export type GreetingItem = {
  text: string
  /** Language code, shown in the badge and used as the `lang` attribute, such as `'JA'`. */
  lang?: string
}

/**
 * An Apple-style welcome splash that cycles greetings in many languages with a soft blur,
 * a hairline progress bar and a Skip button. Escape skips too.
 */
export type IntroLoaderProps = Omit<
  ComponentProps<'div'>,
  'children' | 'onAnimationStart' | 'onDrag' | 'onDragStart' | 'onDragEnd'
> & {
  /** Greetings to cycle through, as strings or `{ text, lang }`. @default six languages */
  greetings?: (string | GreetingItem)[]
  /** Called once the sequence ends or is skipped. */
  onComplete?: () => void
  /** A fixed overlay over the whole screen, or an inline box. @default true */
  fullScreen?: boolean
  /** Milliseconds each greeting holds. @default 240 */
  intervalMs?: number
  /** Show the hairline progress bar. @default true */
  showProgress?: boolean
  /** Show the language code beside the greeting. @default true */
  showLangBadge?: boolean
  /** Allow skipping with the Skip button or Escape. @default true */
  allowSkip?: boolean
  /** Speeds the whole sequence up or down; 1.5 is half again as fast. @default 1 */
  speedMultiplier?: number
}
