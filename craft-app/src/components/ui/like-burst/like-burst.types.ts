import type { ComponentProps } from 'react'

export type LikeBurstProps = Omit<ComponentProps<'button'>, 'children' | 'defaultValue'> & {
  /** Liked state, for controlled use. */
  pressed?: boolean
  /** Liked state on mount, for uncontrolled use. @default false */
  defaultPressed?: boolean
  /** Called with the next state when the button is clicked. */
  onPressedChange?: (pressed: boolean) => void
  /** Likes from everyone else; the button adds one while pressed. Leave it out for an icon-only button. */
  count?: number
  /** Throw the ring of coloured dots on like. @default true */
  burst?: boolean
  /** Accessible name, read before the count. @default 'Like' */
  label?: string
}
