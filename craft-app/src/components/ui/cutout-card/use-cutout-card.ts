import { createContext, useContext } from 'react'
import { useReducedMotion } from 'motion/react'

import { EASE_OUT } from './cutout-card.constants'
import type { CutoutCardContextValue } from './cutout-card.types'

export const CutoutCardContext = createContext<CutoutCardContextValue | null>(null)

export function useCutoutCard() {
  const ctx = useContext(CutoutCardContext)
  if (!ctx) throw new Error('useCutoutCard must be used within <CutoutCard>')
  return ctx
}

export function useOptionalCutoutCard() {
  return useContext(CutoutCardContext)
}

/** Staggered text/footer entrance inside `CutoutCardContent` — use with `motion.div` children. */
export function useCutoutContentStaggerVariants() {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return {
      container: {
        hidden: {},
        show: { transition: { staggerChildren: 0.03, delayChildren: 0 } },
      },
      item: {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.2, ease: EASE_OUT } },
      },
    } as const
  }
  return {
    container: {
      hidden: {},
      show: { transition: { staggerChildren: 0.055, delayChildren: 0.06 } },
    },
    item: {
      hidden: { opacity: 0, y: 12, filter: 'blur(5px)' },
      show: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: { type: 'spring', duration: 0.48, bounce: 0.14 },
      },
    },
  } as const
}
