import { motion, useReducedMotion, useTransform } from 'motion/react'
import { useRef, useState, type KeyboardEvent } from 'react'

import { cn } from '@/lib/utils'

import { EASE_OUT, FILL, FILL_MS, PAGE_STEP, PINCH, TRACK } from './control-slider.constants'
import type { ControlSliderProps } from './control-slider.types'
import { clamp01 } from './control-slider.utils'
import { useStretchDrag } from './use-stretch-drag'

/**
 * A Control Center tile slider. Drag anywhere on it to change the level; drag past either end
 * and the tile stretches that way, narrowing a little, then springs back when you let go.
 */
export function ControlSlider({
  value: valueProp,
  defaultValue = 0.5,
  onValueChange,
  onValueCommit,
  label,
  icon,
  toggle = false,
  width = 72,
  height = 168,
  stretch: stretchShare = 0.35,
  step = 0.05,
  className,
  style,
  ...props
}: ControlSliderProps) {
  const reduced = useReducedMotion() ?? false
  const [inner, setInner] = useState(() => clamp01(defaultValue))
  const value = clamp01(valueProp ?? inner)
  // the level a toggle-off returns to
  const lastOn = useRef(value > 0 ? value : 1)

  const set = (next: number) => {
    const clamped = clamp01(next)
    if (clamped > 0) lastOn.current = clamped
    setInner(clamped)
    onValueChange?.(clamped)
  }

  const commit = (next: number) => {
    set(next)
    onValueCommit?.(clamp01(next))
  }

  const flip = () => commit(value > 0 ? 0 : lastOn.current)

  const { stretch, dragging, handlers } = useStretchDrag({
    value,
    height,
    limit: height * stretchShare,
    reduced,
    onChange: set,
    onCommit: (next) => onValueCommit?.(next),
    onTap: () => {
      if (toggle) flip()
    },
  })

  // stretch up grows the top, stretch down grows the bottom; both pinch the sides
  const top = useTransform(stretch, (s) => -Math.max(s, 0))
  const bottom = useTransform(stretch, (s) => Math.min(s, 0))
  const side = useTransform(stretch, (s) => Math.abs(s) * PINCH)

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = {
      ArrowUp: value + step,
      ArrowRight: value + step,
      ArrowDown: value - step,
      ArrowLeft: value - step,
      PageUp: value + PAGE_STEP,
      PageDown: value - PAGE_STEP,
      Home: 0,
      End: 1,
    }
    if (event.key in keys) {
      event.preventDefault()
      commit(keys[event.key])
    } else if (toggle && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault()
      flip()
    }
  }

  const radius = Math.min(width * 0.34, 26)
  const glyph = typeof icon === 'function' ? icon(value) : icon

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-orientation="vertical"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value * 100)}
      aria-valuetext={toggle && value === 0 ? 'Off' : `${Math.round(value * 100)}%`}
      data-slot="control-slider"
      data-dragging={dragging || undefined}
      onKeyDown={onKeyDown}
      {...handlers}
      className={cn(
        'group/control relative shrink-0 cursor-grab touch-none [contain:layout] outline-none select-none [-webkit-tap-highlight-color:transparent] active:cursor-grabbing',
        className,
      )}
      style={{ width, height, ...style }}
      {...props}
    >
      <motion.div
        className={cn(
          'absolute overflow-hidden shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] transition-shadow duration-150 group-focus-visible/control:ring-2 group-focus-visible/control:ring-ring group-focus-visible/control:ring-offset-2 group-focus-visible/control:ring-offset-background',
          TRACK,
        )}
        style={{ top, bottom, left: side, right: side, borderRadius: radius }}
      >
        <div
          aria-hidden
          className={cn('absolute inset-0 origin-bottom', FILL)}
          style={{
            transform: `scaleY(${value})`,
            transition: dragging || reduced ? 'none' : `transform ${FILL_MS}ms ${EASE_OUT}`,
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 grid place-items-center"
          style={{ bottom: Math.round(height * 0.12), height: Math.round(height * 0.26) }}
        >
          {glyph}
        </div>
      </motion.div>
    </div>
  )
}
