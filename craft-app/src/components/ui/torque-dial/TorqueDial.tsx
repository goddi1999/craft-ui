import { useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'

import { INSTANT, SNAP_SPRING } from './torque-dial.constants'
import type { TorqueDialProps } from './torque-dial.types'
import { toAngle, toProgress } from './torque-dial.utils'
import { DialKnob, DialTrack } from './torque-dial-parts'
import { useDialGesture } from './use-dial-gesture'

/**
 * A rotary knob over a 270deg gauge. Drag it round, flick it and it keeps spinning until
 * friction stops it, scroll it, or step it with the keys; double-click puts it in the middle.
 * Adapted from EasyUI.
 */
export function TorqueDial({
  value,
  onChange,
  onChangeEnd,
  min = 0,
  max = 100,
  step = 1,
  label = 'Dial control',
  showValue = true,
  size = 120,
  disabled = false,
  momentum = true,
  unit = '',
  className,
  ...props
}: TorqueDialProps) {
  const reduced = useReducedMotion() ?? false
  const { dialRef, dragging, handlers } = useDialGesture({
    value,
    min,
    max,
    step,
    disabled,
    // a spin that carries on by itself is motion the user did not ask for
    momentum: momentum && !reduced,
    onChange,
    onChangeEnd,
  })

  const progress = toProgress(value, min, max)
  // follow the pointer exactly while dragging, spring to anything else
  const transition = dragging || reduced ? INSTANT : SNAP_SPRING

  return (
    <div
      data-slot="torque-dial"
      className={cn('inline-flex flex-col items-center select-none', className)}
      {...props}
    >
      <div
        ref={dialRef}
        role="slider"
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={unit ? `${value}${unit}` : undefined}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : 0}
        {...handlers}
        style={{ width: size, height: size, touchAction: 'none' }}
        className={cn(
          'relative flex items-center justify-center rounded-full outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring',
          disabled ? 'cursor-not-allowed opacity-40' : 'cursor-grab active:cursor-grabbing',
        )}
      >
        <DialTrack size={size} progress={progress} transition={transition} />
        <DialKnob
          size={size}
          angle={toAngle(progress)}
          dragging={dragging}
          transition={transition}
        />
      </div>

      {showValue && (
        <div className="mt-3 text-center">
          <div className="font-mono text-sm font-semibold tracking-tight text-foreground">
            {value}
            {unit}
          </div>
          <span className="font-mono text-[10px] text-muted-foreground">{label}</span>
        </div>
      )}
    </div>
  )
}
