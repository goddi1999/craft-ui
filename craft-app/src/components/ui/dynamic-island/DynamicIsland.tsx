import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'

import { CONTENT_SPRING, ISLAND_SPRING, MIN_SIDE_OFFSET } from './dynamic-island.constants'
import type { DynamicIslandProps, DynamicPartProps } from './dynamic-island.types'
import { useDynamicIslandSize } from './use-dynamic-island'

export function DynamicIsland({ id, className, children }: DynamicIslandProps) {
  const { state, presets } = useDynamicIslandSize()
  const reduceMotion = useReducedMotion()
  const { width, height, borderRadius } = presets[state.size]
  const x =
    state.size === 'minimalLeading' ? -MIN_SIDE_OFFSET : state.size === 'minimalTrailing' ? MIN_SIDE_OFFSET : 0

  return (
    <div className="z-10 flex w-full items-end justify-center bg-transparent">
      <motion.div
        id={id}
        className={cn('mx-auto h-0 w-0 overflow-hidden bg-black text-center text-white', className)}
        initial={false}
        animate={{ width, height, borderRadius, x }}
        transition={reduceMotion ? { duration: 0 } : ISLAND_SPRING}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={state.size}
            className="h-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.12 } }}
            transition={reduceMotion ? { duration: 0 } : { ...CONTENT_SPRING, delay: 0.05 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

const fadeUp = {
  initial: { opacity: 0, y: 6, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: CONTENT_SPRING,
}

export function DynamicContainer({ className, children }: DynamicPartProps) {
  return (
    <motion.div {...fadeUp} className={className}>
      {children}
    </motion.div>
  )
}

export function DynamicTitle({ className, children }: DynamicPartProps) {
  return (
    <motion.h3 {...fadeUp} className={className}>
      {children}
    </motion.h3>
  )
}

export function DynamicDescription({ className, children }: DynamicPartProps) {
  return (
    <motion.p {...fadeUp} className={className}>
      {children}
    </motion.p>
  )
}

export function DynamicDiv({ className, children }: DynamicPartProps) {
  return (
    <motion.div {...fadeUp} className={className}>
      {children}
    </motion.div>
  )
}
