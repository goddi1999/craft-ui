import type { ComponentProps, Key, ReactNode } from 'react'

type CurtainPageTransitionProps = Omit<ComponentProps<'div'>, 'children'> & {
  /** Change this to run the scale-down → slide → scale-in. */
  transitionKey: Key
  children: ReactNode
  /** Seconds for the scale-down. Slide and scale-in are derived. @default 0.8 */
  duration?: number
  /** Stage behind the scaled pages. @default '#121212' */
  curtainColor?: string
  /** Optional caption on the dark stage while pages slide. Pass `null` to hide. */
  brand?: string | null
  onTransitionEnd?: () => void
}

export type { CurtainPageTransitionProps }
