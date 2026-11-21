import type { SpeechBubbleSide, SpeechBubbleTone } from '@/components/ui/speech-bubble'

export type MorphingSpeechBubbleProps = {
  /** The current message. Changing it morphs the bubble to fit the new text. */
  message: string
  avatarSrc: string
  /** Who is speaking; used as the avatar's alt text. */
  name: string
  tone?: SpeechBubbleTone
  /** Which side the avatar sits on; the tail points at it. */
  side?: SpeechBubbleSide
  /** Seconds the bubble takes to settle into its new size. */
  duration?: number
  /** Spring overshoot, 0 (none) to 0.5 (playful). */
  bounce?: number
  /** Blur the outgoing and incoming text so the swap reads as one shape. */
  blur?: boolean
  /** Longest line in px before the text wraps. */
  maxWidth?: number
  avatarSize?: number
  className?: string
}

export type Size = { width: number; height: number }
