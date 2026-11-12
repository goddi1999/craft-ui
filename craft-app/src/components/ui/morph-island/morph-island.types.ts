import type { ComponentProps, ReactNode } from 'react'

export type MorphIslandState = 'idle' | 'timer' | 'upload' | 'call'

export type MorphIslandProps = Omit<
  ComponentProps<'div'>,
  | 'children'
  | 'defaultValue'
  | 'onPointerDown'
  | 'onAnimationStart'
  | 'onDrag'
  | 'onDragStart'
  | 'onDragEnd'
> & {
  /** The live activity on show. Pass it with `onValueChange` to control the island. */
  value?: MorphIslandState
  /** Starting state when uncontrolled. @default 'idle' */
  defaultValue?: MorphIslandState
  /** Called when the island is tapped (next state) or a call is answered or declined (`idle`). */
  onValueChange?: (value: MorphIslandState) => void
  /** Label next to the timer icon. @default 'Timer' */
  timerLabel?: string
  /** Counts down from here each time the timer opens. @default 299 */
  timerSeconds?: number
  /** First line of the upload. @default 'Uploading' */
  uploadLabel?: string
  /** File name under it. @default 'file.zip' */
  uploadFile?: string
  /** 0 to 1. Leave it out and the ring fills over 2.4s each time the upload opens. */
  uploadProgress?: number
  /** @default 'Unknown caller' */
  callerName?: string
  /** Line under the caller's name. @default 'Incoming call' */
  callerDetail?: string
  /** Replaces the glowing orb, e.g. an `<img>`; it is clipped to a 48px circle. */
  callerAvatar?: ReactNode
  /** Accept button. The island also goes back to `idle`. */
  onAccept?: () => void
  /** Decline button. The island also goes back to `idle`. */
  onDecline?: () => void
}
