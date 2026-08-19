export const RecorderState = {
  IDLE: 'IDLE',
  RECORDING: 'RECORDING',
  REVIEWING: 'REVIEWING',
  PLAYING: 'PLAYING',
} as const

export type RecorderState = (typeof RecorderState)[keyof typeof RecorderState]

export type VoiceNoteProps = {
  /** Longest take, in seconds. Recording stops itself on reaching it. */
  maxDuration?: number
  onSend?: (payload: { durationSeconds: number }) => void
  onCancel?: () => void
  className?: string
}
