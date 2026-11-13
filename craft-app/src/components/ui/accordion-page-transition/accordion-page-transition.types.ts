import type { ComponentProps, Key, ReactNode } from 'react'

type AccordionPageTransitionProps = Omit<ComponentProps<'div'>, 'children'> & {
  /** Change this to run the accordion cover → swap → reveal. */
  transitionKey: Key
  children: ReactNode
  /** Number of vertical slats. @default 15 */
  slats?: number
  /** Seconds for each half (cover, then reveal). @default 1 */
  duration?: number
  /** Slat fill. @default '#ffffff' */
  slatColor?: string
  /** Stage and curve fill. @default '#020202' */
  stageColor?: string
  onTransitionEnd?: () => void
}

export type { AccordionPageTransitionProps }
