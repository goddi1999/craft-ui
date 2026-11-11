import { motion } from 'motion/react'
import { useState, type CSSProperties } from 'react'

import { cn } from '@/lib/utils'

import {
  ACCENT_VAR,
  CARD,
  DEFAULT_ACCENT,
  FILLED,
  FLICK,
  FOCUS,
  INSTANT,
  NUDGE,
  SIZES,
  STAGE,
  STRUCK,
  type Stage,
} from './task-list.constants'
import { useTiming } from './task-list-hooks'
import { TaskCheck, TaskLabel } from './task-list-parts'
import type { TaskItemProps } from './task-list.types'

/**
 * One checklist row. Ticking runs in sequence — the circle fills and draws
 * its tick, the label strikes through, then the row flicks sideways — and
 * unticking plays the same steps backwards.
 */
export function TaskItem({
  label,
  checked,
  defaultChecked = false,
  size = 'md',
  accent = DEFAULT_ACCENT,
  onCheckedChange,
  onSettled,
  onReverted,
  className,
  onClick,
  style,
  ...props
}: TaskItemProps) {
  const timing = useTiming()
  const [own, setOwn] = useState(defaultChecked)
  const done = checked ?? own

  const [stage, setStage] = useState<Stage>(done ? STAGE.settled : STAGE.idle)
  const [was, setWas] = useState(done)

  // turn around in the same render the tick flips, so the row never paints stale
  if (was !== done) {
    setWas(done)
    setStage(done ? STAGE.tick : STAGE.unstrike)
  }

  const handleDrawn = () => {
    if (stage === STAGE.tick) setStage(STAGE.strike)
    if (stage === STAGE.untick) {
      setStage(STAGE.idle)
      onReverted?.()
    }
  }

  const handleStruck = () => {
    if (stage === STAGE.strike) setStage(STAGE.nudge)
    if (stage === STAGE.unstrike) setStage(STAGE.untick)
  }

  const handleFlicked = () => {
    if (stage !== STAGE.nudge) return
    setStage(STAGE.settled)
    onSettled?.()
  }

  return (
    <motion.button
      type="button"
      role="checkbox"
      aria-checked={done}
      data-slot="task-item"
      data-state={done ? 'checked' : 'unchecked'}
      style={{ [ACCENT_VAR]: accent, ...style } as CSSProperties}
      onClick={(event) => {
        onClick?.(event)
        if (checked === undefined) setOwn(!done)
        onCheckedChange?.(!done)
      }}
      animate={{ x: stage === STAGE.nudge ? FLICK : 0 }}
      transition={stage === STAGE.nudge ? timing(NUDGE) : INSTANT}
      onAnimationComplete={handleFlicked}
      className={cn(
        'flex w-fit max-w-full cursor-pointer items-start text-left transition-[filter,box-shadow] duration-300',
        SIZES[size].row,
        CARD,
        FOCUS,
        className,
      )}
      {...props}
    >
      <TaskCheck filled={FILLED.includes(stage)} size={size} onDrawn={handleDrawn} />
      <TaskLabel
        label={label}
        struck={STRUCK.includes(stage)}
        size={size}
        onStruck={handleStruck}
      />
    </motion.button>
  )
}
