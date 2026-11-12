import type { ComponentProps } from 'react'

export type VoiceInputMode = 'idle' | 'recording' | 'review'

export type VoiceInputProps = Omit<ComponentProps<'div'>, 'children' | 'ref'> & {
  /** Loops record, review and send on its own until the first press. @default false */
  demo?: boolean
  /**
   * Live input level from 0 to 1, e.g. from your own audio analyser. Leave it
   * out and the waveform plays a simulated voice.
   */
  level?: number
  /** Caption while idle. @default 'Click to speak' */
  idleCaption?: string
  /** Caption while recording. @default 'Listening…' */
  listeningCaption?: string
  /** Called with the new state when the user starts or stops recording. */
  onListeningChange?: (listening: boolean) => void
  /** Called with the take's length in seconds when recording stops. */
  onStop?: (duration: number) => void
  /** Called with the take's length in seconds when the user sends it. */
  onSend?: (duration: number) => void
  /** Called when the user throws the take away. */
  onDiscard?: () => void
}
