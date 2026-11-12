import { useId, useState, type ReactNode } from 'react'
import { motion, useReducedMotion, type MotionValue } from 'motion/react'
import { Minus, Plus } from 'lucide-react'

import { cn } from '@/lib/utils'

import {
  BUTTON_FILL,
  NUDGE_KICK,
  NUDGE_PX,
  NUDGE_SPRING,
  SHAKE_KICK,
  SHAKE_PX,
  SHAKE_SPRING,
  SURFACE,
} from './number-stepper.constants'
import type { NumberStepperProps } from './number-stepper.types'
import { stepFrom, widestValue } from './number-stepper.utils'
import { useKick } from './use-kick'
import { useNumberRoll } from './use-number-roll'

/**
 * A row with a − / + stepper. The number rolls the way it moved; at a limit the button
 * dims, and pressing it anyway gives it and the number a small sideways kick.
 */
export function NumberStepper({
  value: valueProp,
  defaultValue = 0,
  onValueChange,
  min = 0,
  max = 99,
  step = 1,
  label,
  description,
  decrementLabel = 'Decrease',
  incrementLabel = 'Increase',
  className,
  ...props
}: NumberStepperProps) {
  const reduced = useReducedMotion() ?? false
  const labelId = useId()
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const value = valueProp === undefined ? uncontrolledValue : valueProp

  const roll = useNumberRoll(value, reduced)
  const decrementShake = useKick(SHAKE_SPRING, SHAKE_PX, reduced)
  const incrementShake = useKick(SHAKE_SPRING, SHAKE_PX, reduced)
  const nudge = useKick(NUDGE_SPRING, NUDGE_PX, reduced)

  const atMin = value <= min
  const atMax = value >= max

  const handleStep = (direction: 1 | -1) => {
    if (direction < 0 ? atMin : atMax) {
      // the button shakes no and the number leans the same way
      if (direction < 0) decrementShake.kick(-SHAKE_KICK)
      else incrementShake.kick(SHAKE_KICK)
      nudge.kick(NUDGE_KICK * direction)
      return
    }
    const next = stepFrom(value, direction, step, min, max)
    if (valueProp === undefined) setUncontrolledValue(next)
    onValueChange?.(next)
  }

  return (
    <div
      role="group"
      aria-labelledby={label ? labelId : undefined}
      data-slot="number-stepper"
      className={cn(
        'flex w-80 max-w-full items-center justify-between gap-4 rounded-3xl py-4 pr-4 pl-5 text-foreground',
        SURFACE,
        className,
      )}
      {...props}
    >
      {label || description ? (
        <div className="min-w-0">
          {label ? (
            <p id={labelId} className="text-base font-medium">
              {label}
            </p>
          ) : null}
          {description ? (
            <p className="mt-0.5 text-xs whitespace-nowrap text-muted-foreground">{description}</p>
          ) : null}
        </div>
      ) : null}

      <div className="flex shrink-0 items-center gap-1.5">
        <StepButton
          label={decrementLabel}
          atLimit={atMin}
          x={decrementShake.x}
          onClick={() => handleStep(-1)}
        >
          <Minus strokeWidth={2.2} />
        </StepButton>

        <motion.div
          className="relative grid h-8 min-w-10 place-items-center overflow-hidden text-2xl font-semibold tabular-nums"
          style={{ x: nudge.x }}
        >
          {/* sizes the box to the widest value, so it never jumps */}
          <span aria-hidden className="invisible px-1">
            {widestValue(value, min, max)}
          </span>
          <motion.span
            aria-live="polite"
            className="absolute inset-0 grid place-items-center"
            style={{ y: roll.incomingY, opacity: roll.incomingOpacity }}
          >
            {roll.current}
          </motion.span>
          <motion.span
            aria-hidden
            className="absolute inset-0 grid place-items-center"
            style={{ y: roll.outgoingY, opacity: roll.outgoingOpacity }}
          >
            {roll.previous}
          </motion.span>
        </motion.div>

        <StepButton
          label={incrementLabel}
          atLimit={atMax}
          x={incrementShake.x}
          onClick={() => handleStep(1)}
        >
          <Plus strokeWidth={2.2} />
        </StepButton>
      </div>
    </div>
  )
}

// stays pressable at the limit so it can shake; aria-disabled tells assistive tech it does nothing
function StepButton({
  label,
  atLimit,
  x,
  onClick,
  children,
}: {
  label: string
  atLimit: boolean
  x: MotionValue<number>
  onClick: () => void
  children: ReactNode
}) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      aria-disabled={atLimit || undefined}
      onClick={onClick}
      className={cn(
        'grid size-10 shrink-0 place-items-center rounded-full text-foreground outline-none transition-opacity duration-200 focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-[18px]',
        BUTTON_FILL,
        atLimit && 'opacity-40',
      )}
      style={{ x }}
    >
      {children}
    </motion.button>
  )
}
