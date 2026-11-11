import type { ComponentProps } from 'react'

/** What the button shows after the panel closes: a drawn check, or a settling bin. */
export type DeleteButtonStatus = 'idle' | 'deleted' | 'kept'

export type DeleteButtonProps = Omit<
  ComponentProps<'div'>,
  'onAnimationStart' | 'onDrag' | 'onDragStart' | 'onDragEnd'
> & {
  /** Called when the check is pressed. */
  onConfirm?: () => void
  /** Called when the panel closes without deleting: the cross, the bin, or Escape. */
  onCancel?: () => void
  /** Any CSS colour for the confirm check and the done check. @default '#FF5F2E' */
  accentColor?: string
}
