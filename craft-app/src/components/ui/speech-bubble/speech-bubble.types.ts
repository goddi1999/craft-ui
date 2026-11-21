import type { ComponentProps, ReactNode } from 'react'

import type { SpeechBubbleTone } from './speech-bubble-variants'

export type SpeechBubbleSide = 'left' | 'right'

export type SpeechBubbleProps = {
  children: ReactNode
  className?: string
  /** Blinking caret after the text, as if it is still being typed. */
  showCursor?: boolean
  /** The corner the tail sits on, i.e. the side the speaker is on. */
  side?: SpeechBubbleSide
  tone?: SpeechBubbleTone
}

export type SpeechBubbleRootProps = ComponentProps<'div'> & {
  tone?: SpeechBubbleTone
}

export type SpeechBubbleTailProps = ComponentProps<'svg'> & {
  side?: SpeechBubbleSide
}
