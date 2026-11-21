import { cva, type VariantProps } from 'class-variance-authority'

/**
 * Colour system: the grokbots.ai studio palette (ink → sand, first twelve) plus twelve more
 * in the same flat, soft-saturated style. It's the same palette as BOT_COLORS in agent-computer-icon,
 * copied here so this folder stays self-contained.
 *
 * Text is white wherever it reaches at least 3:1 contrast (WCAG AA for large, bold text).
 * The ten light tones (orange, amber, green, turquoise, grey, cream, coral, cyan, lime, sand) fall
 * below that with white, so they use ink text instead. Swap their --speech-bubble-fg to white to override.
 *
 * Every tone only sets the two variables the bubble parts read, so a parent can still retint it.
 */
export const speechBubbleVariants = cva('', {
  variants: {
    tone: {
      default: '[--speech-bubble-bg:var(--foreground)] [--speech-bubble-fg:var(--background)]',
      ink: '[--speech-bubble-bg:#0a0a0c] [--speech-bubble-fg:white]',
      brown: '[--speech-bubble-bg:#8b5e3c] [--speech-bubble-fg:white]',
      red: '[--speech-bubble-bg:#e8483f] [--speech-bubble-fg:white]',
      orange: '[--speech-bubble-bg:#f08a24] [--speech-bubble-fg:#0a0a0c]',
      amber: '[--speech-bubble-bg:#f0b429] [--speech-bubble-fg:#0a0a0c]',
      green: '[--speech-bubble-bg:#3ecf8e] [--speech-bubble-fg:#0a0a0c]',
      turquoise: '[--speech-bubble-bg:#2fbfa0] [--speech-bubble-fg:#0a0a0c]',
      blue: '[--speech-bubble-bg:#3b93f0] [--speech-bubble-fg:white]',
      purple: '[--speech-bubble-bg:#8b5cf6] [--speech-bubble-fg:white]',
      pink: '[--speech-bubble-bg:#e152b0] [--speech-bubble-fg:white]',
      grey: '[--speech-bubble-bg:#a3a3a3] [--speech-bubble-fg:#0a0a0c]',
      cream: '[--speech-bubble-bg:#f1efe9] [--speech-bubble-fg:#0a0a0c]',
      coral: '[--speech-bubble-bg:#f47560] [--speech-bubble-fg:#0a0a0c]',
      rose: '[--speech-bubble-bg:#ec4f7a] [--speech-bubble-fg:white]',
      orchid: '[--speech-bubble-bg:#c25ed8] [--speech-bubble-fg:white]',
      indigo: '[--speech-bubble-bg:#5a5cf0] [--speech-bubble-fg:white]',
      navy: '[--speech-bubble-bg:#27408b] [--speech-bubble-fg:white]',
      cyan: '[--speech-bubble-bg:#1fb5d4] [--speech-bubble-fg:#0a0a0c]',
      lime: '[--speech-bubble-bg:#9ccc3c] [--speech-bubble-fg:#0a0a0c]',
      moss: '[--speech-bubble-bg:#6b8e3a] [--speech-bubble-fg:white]',
      pine: '[--speech-bubble-bg:#2f7d5b] [--speech-bubble-fg:white]',
      plum: '[--speech-bubble-bg:#7c3a73] [--speech-bubble-fg:white]',
      slate: '[--speech-bubble-bg:#5d6b7e] [--speech-bubble-fg:white]',
      sand: '[--speech-bubble-bg:#d6b88a] [--speech-bubble-fg:#0a0a0c]',
    },
  },
  defaultVariants: { tone: 'default' },
})

export type SpeechBubbleVariantProps = VariantProps<typeof speechBubbleVariants>
export type SpeechBubbleTone = NonNullable<SpeechBubbleVariantProps['tone']>

// every tone in palette order, for pickers and demos
export const SPEECH_BUBBLE_TONES: readonly SpeechBubbleTone[] = [
  'default',
  'ink',
  'brown',
  'red',
  'orange',
  'amber',
  'green',
  'turquoise',
  'blue',
  'purple',
  'pink',
  'grey',
  'cream',
  'coral',
  'rose',
  'orchid',
  'indigo',
  'navy',
  'cyan',
  'lime',
  'moss',
  'pine',
  'plum',
  'slate',
  'sand',
]
