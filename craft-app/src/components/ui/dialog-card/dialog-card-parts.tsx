import { AnimatePresence, motion } from 'motion/react'

import { LINE_MOTION, WORD_MOTION } from './dialog-card.constants'

/** A new status lifts the old line away while its words rise in one after another. */
export function Status({ text, reduced }: { text: string; reduced: boolean }) {
  return (
    <span
      role="status"
      className="relative overflow-x-clip whitespace-nowrap text-muted-foreground tabular-nums"
    >
      <span className="sr-only">{text}</span>
      {/* clips sideways only: a long status ends in an ellipsis while its words rise unclipped */}
      <span className="relative block" aria-hidden="true">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={text}
            className="block overflow-x-clip text-ellipsis"
            variants={LINE_MOTION}
            initial={reduced ? false : 'enter'}
            animate="center"
            exit={reduced ? undefined : 'exit'}
          >
            {text.split(/(\s+)/).map((part, index) => (
              <motion.span
                key={index}
                className="inline-block whitespace-pre"
                custom={index / 2}
                variants={WORD_MOTION}
              >
                {part}
              </motion.span>
            ))}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  )
}
