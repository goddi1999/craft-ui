// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { useState } from 'react'

import { cn } from '@/lib/utils'

import { ChoiceField } from './choice-controls-parts'
import { EASE, INSET } from './choice-controls.constants'
import type { SwitchProps } from './choice-controls.types'
import { useControllable } from './choice-controls.utils'

/** Switch with I / O glyphs so the state never relies on color alone. */
export function Switch({
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  label,
  description,
  className,
  disabled,
  ...props
}: SwitchProps) {
  const [checked, setChecked] = useControllable(
    checkedProp,
    defaultChecked,
    onCheckedChange,
  )
  // Keyboard toggles skip the slide; pointer toggles get it.
  const [instant, setInstant] = useState(false)

  const control = (
    <button
      data-slot="choice-switch"
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      data-instant={instant || undefined}
      onClick={(e) => {
        setInstant(e.detail === 0)
        setChecked(!checked)
      }}
      className={cn(
        'group relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 disabled:opacity-40 data-instant:transition-none',
        EASE,
        // Switch green, brighter than the text-safe positive token.
        INSET,
        checked ? 'bg-[#34c759] dark:bg-[#30d158]' : 'bg-foreground/[0.12]',
        !label && className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          'absolute top-1/2 left-[11px] h-2.5 w-[2px] -translate-y-1/2 rounded-full bg-white/80 transition-opacity duration-150',
          !checked && 'opacity-0',
        )}
      />
      <svg
        aria-hidden="true"
        viewBox="0 0 10 10"
        className={cn(
          'absolute top-1/2 right-[8px] size-2.5 -translate-y-1/2 text-foreground/40 transition-opacity duration-150',
          checked && 'opacity-0',
        )}
      >
        <circle cx="5" cy="5" r="3.75" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <span
        aria-hidden="true"
        className={cn(
          'absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-[linear-gradient(180deg,#ffffff,#e2e2e2)] shadow-[0_2px_3px_rgba(0,0,0,0.18)] transition-[translate,width] duration-250 group-enabled:group-active:w-7 group-data-instant:transition-none motion-reduce:transition-none',
          EASE,
          checked
            ? 'translate-x-5 group-enabled:group-active:translate-x-4'
            : 'dark:bg-[linear-gradient(180deg,#a8a8a8,#7a7a7a)]',
        )}
      />
    </button>
  )

  return (
    <ChoiceField label={label} description={description} className={className}>
      {control}
    </ChoiceField>
  )
}
