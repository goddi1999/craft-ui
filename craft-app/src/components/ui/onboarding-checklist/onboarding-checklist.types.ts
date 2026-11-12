export type OnboardingStep = {
  id: string
  title: string
  description?: string
  /** Label of the button that does the step. Without it, the step is checked off by hand. */
  actionLabel?: string
  /** Runs the step. Resolve to check it off; throw an Error to keep it open and show the error's message. */
  onAction?: () => void | Promise<void>
}

/**
 * A getting started checklist for a new account or workspace. The ring and count follow every check, finished steps
 * strike through and fold into a completed row that opens again, and the next step opens and takes focus.
 * Use it for a short, one time setup of three to eight steps; use a step form when the order is strict.
 */
export type OnboardingChecklistProps = {
  title: string
  /** Title once every step is done. @default 'You’re all set' */
  doneTitle?: string
  steps: OnboardingStep[]
  /** Ids of the steps already done when it mounts. @default [] */
  defaultCompleted?: string[]
  onCompletedChange?: (completed: string[]) => void
  /** Starts folded down to the header. @default false */
  defaultHidden?: boolean
  onHiddenChange?: (hidden: boolean) => void
  className?: string
}

export type ChecklistState = {
  done: string[]
  /** Done steps that have folded into the completed row. */
  settled: string[]
  expanded: string | null
  pending: string[]
  errors: Record<string, string>
  groupOpen: boolean
  hidden: boolean
  /** Announced through the status region. */
  message: string
}

export type ChecklistAction =
  | { type: 'check' | 'uncheck' | 'settle' | 'expand' | 'start'; id: string; steps: OnboardingStep[] }
  | { type: 'fail'; id: string; message: string }
  | { type: 'group' | 'hide' }
