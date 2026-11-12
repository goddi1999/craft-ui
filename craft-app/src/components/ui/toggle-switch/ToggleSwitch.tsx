import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react'

import { cn } from '@/lib/utils'

import {
  INSET,
  KNOB,
  KNOB_COLORS,
  POSITION_SPRING,
  STRETCH,
  STRETCH_KICK,
  STRETCH_SPRING,
  TRACK_COLORS,
  TRACK_WIDTH,
  TRAVEL,
} from './toggle-switch.constants'
import type { ToggleSwitchProps } from './toggle-switch.types'

const clamp01 = (value: number) => Math.max(0, Math.min(1, value))

/**
 * An iOS-style switch. The knob stretches toward where it is going, then lands
 * with a small bounce and rounds back up while the track fills.
 */
export function ToggleSwitch({
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  color = 'green',
  className,
  style,
  onClick,
  ...props
}: ToggleSwitchProps) {
  const reduced = useReducedMotion() ?? false
  const [innerChecked, setInnerChecked] = useState(defaultChecked)
  const isControlled = checkedProp !== undefined
  const checked = isControlled ? checkedProp : innerChecked

  const position = useMotionValue(checked ? 1 : 0)
  const stretch = useMotionValue(0)
  // what the knob last moved to, so the first paint does not animate
  const shown = useRef(checked)

  const grow = useTransform(stretch, [0, 1], [0, STRETCH])
  const knobWidth = useTransform(grow, (g) => KNOB + g)
  // the edge in front leads: turning on, the knob reaches right; turning off, it trails right
  const knobX = useTransform([position, grow], ([p, g]: number[]) =>
    checked ? p * TRAVEL - g * clamp01(p) : p * TRAVEL,
  )
  const fill = useTransform(position, [0, 1], [0, 1])

  useEffect(() => {
    if (shown.current === checked) return
    shown.current = checked
    animate(
      position,
      checked ? 1 : 0,
      reduced
        ? { ...POSITION_SPRING, damping: 2 * Math.sqrt(POSITION_SPRING.stiffness) }
        : POSITION_SPRING,
    )
    // the stretch is decoration, so reduced motion just slides
    if (!reduced) animate(stretch, 0, { ...STRETCH_SPRING, velocity: STRETCH_KICK })
  }, [checked, reduced, position, stretch])

  useEffect(
    () => () => {
      position.stop()
      stretch.stop()
    },
    [position, stretch],
  )

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    if (event.defaultPrevented) return
    if (!isControlled) setInnerChecked(!checked)
    onCheckedChange?.(!checked)
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      data-slot="toggle-switch"
      data-state={checked ? 'checked' : 'unchecked'}
      className={cn(
        'relative inline-flex h-8 shrink-0 cursor-pointer rounded-full bg-foreground/[0.14] outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      style={{ width: TRACK_WIDTH, ...style }}
      onClick={handleClick}
      {...props}
    >
      <motion.span
        aria-hidden
        className={cn('absolute inset-0 rounded-full', TRACK_COLORS[color])}
        style={{ opacity: fill }}
      />
      <motion.span
        aria-hidden
        // a light shadow so the white knob still reads on a light grey track
        className={cn(
          'absolute rounded-full shadow-[0_1px_3px_rgb(0_0_0/0.16)] dark:shadow-none',
          KNOB_COLORS[color],
        )}
        style={{ top: INSET, left: INSET, height: KNOB, width: knobWidth, x: knobX }}
      />
    </button>
  )
}
