import type { ComponentProps } from 'react'

export type StepPlayerStep = {
  /** How long this step plays, in ms. Falls back to the player's `duration`. */
  duration?: number
  /** Accessible name of the step's seek button. */
  label?: string
}

export type StepPlayerControlPosition = 'left' | 'right'

export type StepPlayerProps = Omit<
  ComponentProps<'div'>,
  | 'defaultValue'
  | 'onDrag'
  | 'onDragStart'
  | 'onDragEnd'
  | 'onAnimationStart'
  | 'onAnimationEnd'
> & {
  /** A step count, or one entry per step with its own duration and label. @default 4 */
  steps?: number | StepPlayerStep[]
  /** Controlled active step (0-based). */
  value?: number
  /** Initial step when uncontrolled. @default 0 */
  defaultValue?: number
  onValueChange?: (value: number) => void
  /** Controlled play state. */
  playing?: boolean
  /** Initial play state when uncontrolled. @default false */
  defaultPlaying?: boolean
  onPlayingChange?: (playing: boolean) => void
  /** Default length of each step, in ms. @default 4000 */
  duration?: number
  /** Start over after the last step instead of stopping. @default false */
  loop?: boolean
  /** Called when the last step finishes. */
  onComplete?: () => void
  /** Track height in px; every other measure scales from it. @default 48 */
  size?: number
  /** Show the play / pause / replay button. @default true */
  showControl?: boolean
  /** Which side the button sits on. @default 'right' */
  controlPosition?: StepPlayerControlPosition
  /** Let each dot be clicked to jump to its step. @default false */
  seekable?: boolean
}
