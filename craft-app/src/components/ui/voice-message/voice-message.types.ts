import type { ComponentProps } from 'react'

export type VoiceMessageSize = 'sm' | 'default' | 'lg'

export type VoiceMessageProps = Omit<ComponentProps<'div'>, 'onEnded'> & {
  /** Audio file. Without one the message plays silently for `duration`. */
  src?: string
  /** Length in seconds when there is no file (or until its metadata loads). @default 53 */
  duration?: number
  /** Bar heights from 0 to 1. Generated from `seed` when omitted. */
  waveform?: number[]
  /** Number of generated bars. @default 40 */
  bars?: number
  /** Seed for the generated waveform, so it is stable across renders. @default 7 */
  seed?: number
  /** Controlled play state. */
  playing?: boolean
  /** Initial play state when uncontrolled. @default false */
  defaultPlaying?: boolean
  onPlayingChange?: (playing: boolean) => void
  onEnded?: () => void
  /** Any CSS color for the light behind the pill. The waveform stays neutral. @default '#FC4C01' */
  accent?: string
  /** @default 'default' */
  size?: VoiceMessageSize
  /** Drag, click or use arrow keys on the waveform to seek. @default true */
  seekable?: boolean
  /** Playback rates the time label cycles through. @default [1, 1.5, 2] */
  speeds?: number[]
  onSpeedChange?: (speed: number) => void
}
