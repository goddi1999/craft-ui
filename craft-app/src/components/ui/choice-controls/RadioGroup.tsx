// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { createContext, useContext, useRef } from 'react'
import type { KeyboardEvent } from 'react'

import { cn } from '@/lib/utils'

import { ChoiceField } from './choice-controls-parts'
import { EASE, INSET } from './choice-controls.constants'
import type {
  RadioContextValue,
  RadioGroupProps,
  RadioProps,
} from './choice-controls.types'
import { useControllable } from './choice-controls.utils'

const RadioContext = createContext<RadioContextValue | null>(null)

/** Radio group with roving focus: arrow keys move and select, like native radios. */
export function RadioGroup({
  value: valueProp,
  defaultValue,
  onValueChange,
  label,
  className,
  children,
  ...props
}: RadioGroupProps) {
  const [value, setValue] = useControllable(valueProp, defaultValue, (v) => {
    if (v !== undefined) onValueChange?.(v)
  })
  const ref = useRef<HTMLDivElement>(null)

  const onKeyDown = (e: KeyboardEvent) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key]
    if (!step) return
    e.preventDefault()
    const radios = Array.from(
      ref.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]:not(:disabled)') ?? [],
    )
    const at = radios.findIndex((r) => r === document.activeElement)
    const next = radios[(at + step + radios.length) % radios.length]
    next?.focus()
    next?.click()
  }

  return (
    <RadioContext.Provider value={{ value, select: setValue }}>
      <div
        data-slot="choice-radio-group"
        ref={ref}
        role="radiogroup"
        aria-label={label}
        onKeyDown={onKeyDown}
        className={cn('flex flex-col gap-2.5', className)}
        {...props}
      >
        {children}
      </div>
    </RadioContext.Provider>
  )
}

export function Radio({
  value,
  label,
  description,
  className,
  disabled,
  ...props
}: RadioProps) {
  const group = useContext(RadioContext)
  if (!group) throw new Error('<Radio> must be used inside <RadioGroup>')
  const checked = group.value === value
  // The checked radio is the group's tab stop; with none checked, every radio is.
  const tabStop = checked || group.value === undefined

  return (
    <ChoiceField label={label} description={description} className={className}>
      <button
        data-slot="choice-radio"
        type="button"
        role="radio"
        aria-checked={checked}
        tabIndex={tabStop ? 0 : -1}
        disabled={disabled}
        onClick={() => group.select(value)}
        className={cn(
          'flex size-5 shrink-0 items-center justify-center rounded-full transition-[background-color,scale] duration-150 active:scale-[0.92] disabled:opacity-40',
          EASE,
          INSET,
          checked ? 'bg-primary' : 'bg-foreground/[0.12] hover:bg-foreground/[0.18]',
          !label && className,
        )}
        {...props}
      >
        <span
          aria-hidden="true"
          className={cn(
            'size-2 rounded-full bg-primary-foreground transition-[scale,opacity] duration-150',
            EASE,
            checked ? 'scale-100 opacity-100' : 'scale-50 opacity-0',
          )}
        />
      </button>
    </ChoiceField>
  )
}
