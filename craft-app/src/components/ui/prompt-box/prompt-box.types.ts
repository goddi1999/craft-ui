import type { ComponentProps } from 'react'

export type PromptBoxProps = Omit<ComponentProps<'div'>, 'children' | 'defaultValue' | 'onSubmit'> & {
  /** The prompt text. Pass it with `onValueChange` to control the field. */
  value?: string
  /** Starting text when uncontrolled. @default '' */
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Called with the trimmed prompt on Enter or Send. The field empties 300ms later. */
  onSubmit?: (prompt: string) => void
  /** An answer is being written: the status line opens and Send turns into Stop. @default false */
  busy?: boolean
  /** Stop was pressed while busy. */
  onStop?: () => void
  /**
   * Status line text. Shimmers while busy; once busy ends it shows with a green dot
   * for 1.6s, then folds away. Defaults to `Thinking` / `Done`.
   */
  status?: string
  /** Also the field's accessible name. @default 'Ask anything' */
  placeholder?: string
}
