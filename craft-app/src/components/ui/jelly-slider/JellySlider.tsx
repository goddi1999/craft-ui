import { motion, useReducedMotion, useTransform } from 'motion/react'
import { useEffect, useId, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

import {
  DROP_RADIUS,
  GOO_OVERHANG_X,
  GOO_OVERHANG_Y,
  THUMB_DRAWN_RADIUS,
  THUMB_RADIUS,
  TRACK_CENTER,
} from './jelly-slider.constants'
import type { JellySliderProps } from './jelly-slider.types'
import { GooFilter, JellyScale } from './jelly-slider-parts'
import { useJellyThumb } from './use-jelly-thumb'

const formatNumber = (value: number) => String(Number(value.toFixed(2)))

/**
 * A slider whose thumb stretches with speed. While you drag, a value drop rises out
 * of the thumb through a goo filter and melts back in when you let go.
 */
export function JellySlider({
  min = 0,
  max = 100,
  step = 1,
  value: valueProp,
  defaultValue = min,
  onValueChange,
  onValueCommit,
  formatValue = formatNumber,
  showScale = true,
  disabled = false,
  className,
  'aria-label': ariaLabel = 'Value',
  'aria-labelledby': ariaLabelledBy,
  ...props
}: JellySliderProps) {
  const reduced = useReducedMotion() ?? false
  const [uncontrolled, setUncontrolled] = useState(defaultValue)
  const isControlled = valueProp !== undefined
  const value = isControlled ? valueProp : uncontrolled

  // a drag reports the same value many times in a row, only pass on real changes
  const lastValue = useRef(value)
  useEffect(() => {
    lastValue.current = value
  }, [value])

  function handleChange(next: number) {
    if (next === lastValue.current) return
    lastValue.current = next
    if (!isControlled) setUncontrolled(next)
    onValueChange?.(next)
  }

  const { railRef, thumbRef, values, railHandlers, thumbHandlers } = useJellyThumb({
    value,
    min,
    max,
    step,
    disabled,
    reduced,
    onChange: handleChange,
    onCommit: (next) => onValueCommit?.(next),
  })

  const filterId = `jelly-slider-goo-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const thumbX = useTransform(values.x, (px) => px - THUMB_DRAWN_RADIUS + GOO_OVERHANG_X)
  const dropGooX = useTransform(values.dropX, (px) => px - DROP_RADIUS + GOO_OVERHANG_X)
  const dropGooY = useTransform(values.dropY, (py) => py - DROP_RADIUS + GOO_OVERHANG_Y)
  const labelX = useTransform(values.dropX, (px) => px - DROP_RADIUS)
  const labelY = useTransform(values.dropY, (py) => py - DROP_RADIUS)
  const label = useTransform(values.shown, formatValue)
  const focusX = useTransform(values.x, (px) => px - THUMB_RADIUS)

  return (
    <div
      data-slot="jelly-slider"
      data-disabled={disabled ? '' : undefined}
      className={cn(
        'relative w-full max-w-80 select-none data-disabled:pointer-events-none data-disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <GooFilter id={filterId} />

      <div ref={railRef} className="relative h-8 cursor-pointer touch-none" {...railHandlers}>
        <div className="absolute inset-x-0 top-[13px] h-1.5 overflow-hidden rounded-full bg-foreground/[0.14]">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-primary"
            style={{ width: values.fillWidth }}
          />
        </div>

        {/* thumb and drop share one goo layer, so the drop peels off like liquid */}
        <div
          className="pointer-events-none absolute -inset-x-10 -top-20 h-[140px]"
          style={{ filter: `url(#${filterId})` }}
        >
          <motion.div
            className="absolute top-0 left-0 size-9 rounded-full bg-primary will-change-transform"
            style={{
              x: dropGooX,
              y: dropGooY,
              rotate: values.lean,
              scale: values.dropScale,
            }}
          />
          <motion.div
            className="absolute top-0 left-0 size-7 rounded-full bg-primary will-change-transform"
            style={{
              x: thumbX,
              y: TRACK_CENTER - THUMB_DRAWN_RADIUS + GOO_OVERHANG_Y,
              scaleX: values.thumbScaleX,
              scaleY: values.thumbScaleY,
            }}
          />
        </div>

        <motion.div
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 grid size-9 place-items-center text-xs font-semibold text-primary-foreground tabular-nums will-change-transform"
          style={{
            x: labelX,
            y: labelY,
            rotate: values.lean,
            scale: values.dropScale,
            opacity: values.labelOpacity,
          }}
        >
          {label}
        </motion.div>

        <motion.div
          ref={thumbRef}
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-label={ariaLabelledBy ? undefined : ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={formatValue(value)}
          aria-orientation="horizontal"
          aria-disabled={disabled || undefined}
          className="absolute top-1 left-0 size-6 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
          style={{ x: focusX }}
          {...thumbHandlers}
        />
      </div>

      {showScale ? (
        <JellyScale shown={values.shown} range={{ min, max, step }} format={formatValue} />
      ) : null}
    </div>
  )
}
