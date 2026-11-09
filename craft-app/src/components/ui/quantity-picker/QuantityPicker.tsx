import { Minus, Plus } from 'lucide-react'
import { useState, type ChangeEvent, type CSSProperties } from 'react'

import { cn } from '@/lib/utils'

import './quantity-picker.css'

import { decimalsOf, rangeLines } from './quantity-picker.utils'

export type QuantityPickerProps = {
  /** Lowest accepted value. @default 0 */
  min?: number
  /** Highest accepted value. @default 100 */
  max?: number
  /** Increment applied by the buttons and used for validity. @default 1 */
  step?: number
  /** Controlled value. */
  value?: number
  /** Initial value when uncontrolled. @default min */
  defaultValue?: number
  /** Called with every valid numeric value, from typing or the buttons. */
  onValueChange?: (value: number) => void
  /** Form field name. @default 'quantity' */
  name?: string
  /** Id for the inner number input. */
  id?: string
  disabled?: boolean
  readOnly?: boolean
  /** Accessible name for the group. @default 'Quantity' */
  label?: string
  /** Extra classes for the root element. */
  className?: string
}

/**
 * A native `<input type="number">` dressed as a stepper: the visible digits are
 * a rolling track of every value in range, and the real input only surfaces
 * when you focus it or type something out of range (which shakes on blur).
 */
export function QuantityPicker({
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue = min,
  onValueChange,
  name = 'quantity',
  id,
  disabled = false,
  readOnly = false,
  label = 'Quantity',
  className,
}: QuantityPickerProps) {
  const [draft, setDraft] = useState(String(value ?? defaultValue))
  const [syncedValue, setSyncedValue] = useState(value)

  // Adopt a new controlled value unless the draft already represents it.
  if (value !== syncedValue) {
    setSyncedValue(value)
    if (value !== undefined && Number(draft) !== value) setDraft(String(value))
  }

  const parsed = draft.trim() === '' ? Number.NaN : Number(draft)
  const current = Number.isFinite(parsed) ? parsed : 0
  const locked = disabled || readOnly
  const canDecrement = !locked && current - step >= min
  const canIncrement = !locked && current + step <= max

  const handleStep = (direction: 1 | -1) => {
    const precision = Math.max(decimalsOf(step), decimalsOf(current))
    const next = Number((current + step * direction).toFixed(precision))
    if (next < min || next > max) return
    setDraft(String(next))
    onValueChange?.(next)
  }

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value
    setDraft(next)
    if (next.trim() !== '' && Number.isFinite(Number(next))) {
      onValueChange?.(Number(next))
    }
  }

  const trackStyle = {
    '--offset': Number.isFinite(parsed) ? Math.ceil(min) - parsed : 0,
  } as CSSProperties

  return (
    <div
      data-slot="quantity-picker"
      role="group"
      aria-label={label}
      className={cn(className)}
    >
      <button
        type="button"
        data-slot="quantity-picker-decrement"
        aria-label="Decrease quantity"
        disabled={!canDecrement}
        onClick={() => handleStep(-1)}
      >
        <Minus aria-hidden="true" />
      </button>
      <div data-slot="quantity-picker-window">
        <input
          id={id}
          type="number"
          name={name}
          min={min}
          max={max}
          step={step}
          value={draft}
          required
          disabled={disabled}
          readOnly={readOnly}
          onChange={handleInput}
        />
        <div
          aria-hidden="true"
          data-slot="quantity-picker-track"
          data-low={min - step}
          data-high={max + step}
          style={trackStyle}
        >
          {rangeLines(min, max)}
        </div>
      </div>
      <button
        type="button"
        data-slot="quantity-picker-increment"
        aria-label="Increase quantity"
        disabled={!canIncrement}
        onClick={() => handleStep(1)}
      >
        <Plus aria-hidden="true" />
      </button>
    </div>
  )
}
