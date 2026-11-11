import { motion, useReducedMotion, type MotionValue, type Transition } from 'motion/react'
import type { ReactNode } from 'react'

import {
  CHECK_PATH,
  CIRCLE,
  HINGE,
  ICON,
  LID_OPEN,
  PRESS,
  SETTLE,
  circleMotion,
} from './delete-button.constants'

type DeleteButtonCircleProps = {
  label: string
  onClick: () => void
  children: ReactNode
}

/** A round confirm/cancel action inside the panel; staggers in with it. */
export function DeleteButtonCircle({ label, onClick, children }: DeleteButtonCircleProps) {
  const reduced = useReducedMotion() ?? false

  return (
    <motion.div className="flex" variants={reduced ? undefined : circleMotion}>
      <motion.button
        type="button"
        aria-label={label}
        onClick={onClick}
        whileHover={reduced ? undefined : { scale: 1.03 }}
        whileTap={reduced ? undefined : { scale: 0.84 }}
        transition={PRESS}
        className={CIRCLE}
      >
        <svg {...ICON} width="14" height="14" stroke="currentColor" strokeWidth="3.5">
          {children}
        </svg>
      </motion.button>
    </motion.div>
  )
}

type DeleteButtonBinProps = {
  /** The bin's walls, which drop as the lid lifts. */
  d: MotionValue<string>
  /** Squash for the settle nudge after backing out. */
  scale: MotionValue<number>
  isOpen: boolean
  swap: Transition
  lid: Transition
}

/** The bin icon: walls drawn from a motion value, lid on a hinge. */
export function DeleteButtonBin({ d, scale, isOpen, swap, lid }: DeleteButtonBinProps) {
  return (
    <motion.svg
      {...ICON}
      width="20"
      height="20"
      stroke="currentColor"
      strokeWidth="2"
      className="overflow-visible"
      style={{ scale }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={swap}
    >
      <motion.path d={d} />
      <motion.g
        style={{ transformBox: 'view-box', transformOrigin: HINGE }}
        animate={{ rotate: isOpen ? LID_OPEN : 0 }}
        transition={lid}
      >
        <path d="M3 6h18" />
        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </motion.g>
    </motion.svg>
  )
}

type DeleteButtonDoneProps = {
  color: string
  swap: Transition
  reduced: boolean
}

/** The check that replaces the bin once something is deleted, drawn on. */
export function DeleteButtonDone({ color, swap, reduced }: DeleteButtonDoneProps) {
  return (
    <motion.svg
      {...ICON}
      width="20"
      height="20"
      stroke={color}
      strokeWidth="2.5"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.6 }}
      transition={swap}
    >
      <motion.path
        d={CHECK_PATH}
        initial={reduced ? undefined : { pathLength: 0 }}
        animate={reduced ? undefined : { pathLength: 1 }}
        transition={SETTLE}
      />
    </motion.svg>
  )
}
