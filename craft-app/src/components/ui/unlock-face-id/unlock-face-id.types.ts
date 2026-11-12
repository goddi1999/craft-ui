import type { ComponentProps, ReactNode } from 'react'

export type UnlockStatus = 'idle' | 'scanning' | 'success' | 'error'

export type UnlockFaceIdProps = Omit<ComponentProps<'div'>, 'children'> & {
  /** Content gated behind the scan: blurred while locked, sharp once unlocked. */
  children?: ReactNode
  /** Controlled status. Leave it out and a press scans for `scanDuration`, then unlocks. */
  status?: UnlockStatus
  /** Starting status when uncontrolled. @default 'idle' */
  defaultStatus?: UnlockStatus
  /**
   * Called with the status a press asks for (`scanning`, or `idle` after an
   * error) and, when uncontrolled, with `success` once the scan resolves.
   */
  onStatusChange?: (status: UnlockStatus) => void
  /** Called whenever the trigger is pressed. */
  onScan?: () => void
  /** Called when an uncontrolled scan resolves. */
  onComplete?: () => void
  /** How long an uncontrolled scan takes, in ms. @default 1800 */
  scanDuration?: number
  /** Rendered size of the glyph, in px. @default 128 */
  size?: number
  /** Accessible label for the scan trigger. @default 'Scan to unlock' */
  label?: string
  /** Message shown when the status is `error`. @default 'Face not recognized. Try again.' */
  errorMessage?: string
}
