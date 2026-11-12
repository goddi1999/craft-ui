import type { ComponentProps, ReactNode } from 'react'

export type LoadingSuccessStatus = 'idle' | 'loading' | 'success'

export type LoadingSuccessButtonProps = Omit<
  ComponentProps<'button'>,
  'children' | 'onAnimationStart' | 'onDrag' | 'onDragStart' | 'onDragEnd'
> & {
  /**
   * Runs on click. The button spins while the promise is pending, turns green
   * when it resolves and goes back to idle if it rejects.
   */
  action?: () => Promise<unknown>
  /** Controlled status. */
  status?: LoadingSuccessStatus
  /** Starting status when uncontrolled. @default 'idle' */
  defaultStatus?: LoadingSuccessStatus
  /** Called with every status the button moves to, including the return to idle. */
  onStatusChange?: (status: LoadingSuccessStatus) => void
  /** Idle label. @default 'Submit' */
  children?: ReactNode
  /** Shown next to the check. @default 'Done' */
  successLabel?: ReactNode
  /** Read out by screen readers while loading. @default 'Loading' */
  loadingLabel?: string
  /** Milliseconds success stays before going back to idle; `Infinity` keeps it. @default 2000 */
  successDuration?: number
}
