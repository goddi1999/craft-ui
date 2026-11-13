import { AnimatePresence, motion } from 'motion/react'

import type { EchoKey } from './key-echo.utils'

const IN = { duration: 0.12, ease: [0.23, 1, 0.32, 1] } as const
const OUT = { duration: 0.25, ease: [0.23, 1, 0.32, 1] } as const

/** A screencast-style keycap: pops in on each press and blurs away once the keys go quiet. */
export function KeyEcho({ pressed }: { pressed: EchoKey | null }) {
  return (
    <div aria-hidden className="grid h-12 place-items-center">
      <AnimatePresence mode="popLayout">
        {pressed && (
          <motion.span
            key={pressed.id}
            initial={{ opacity: 0, transform: 'scale(0.92)', filter: 'blur(0px)' }}
            animate={{ opacity: 1, transform: 'scale(1)', filter: 'blur(0px)', transition: IN }}
            exit={{ opacity: 0, transform: 'scale(1)', filter: 'blur(4px)', transition: OUT }}
            className="grid h-11 min-w-12 place-items-center rounded-xl bg-muted px-3 text-lg font-semibold text-foreground"
          >
            {pressed.label}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}
