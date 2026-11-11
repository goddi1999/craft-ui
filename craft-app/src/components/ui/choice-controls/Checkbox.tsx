// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { Check, Minus } from 'lucide-react'

import { cn } from '@/lib/utils'

import { ChoiceField } from './choice-controls-parts'
import { EASE, INSET } from './choice-controls.constants'
import type { CheckboxProps } from './choice-controls.types'
import { useControllable } from './choice-controls.utils'

/** Borderless checkbox: a tinted square that fills with a bold check. */
export function Checkbox({
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  label,
  description,
  className,
  disabled,
  ...props
}: CheckboxProps) {
  const [checked, setChecked] = useControllable<boolean | 'mixed'>(
    checkedProp,
    defaultChecked,
    (v) => onCheckedChange?.(v === true),
  )
  const on = checked !== false

  return (
    <ChoiceField label={label} description={description} className={className}>
      <button
        data-slot="choice-checkbox"
        type="button"
        role="checkbox"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => setChecked(checked !== true)}
        className={cn(
          'flex size-5 shrink-0 items-center justify-center rounded-[6px] transition-[background-color,scale] duration-150 active:scale-[0.92] disabled:opacity-40',
          EASE,
          INSET,
          on
            ? 'bg-primary text-primary-foreground'
            : 'bg-foreground/[0.12] hover:bg-foreground/[0.18]',
          !label && className,
        )}
        {...props}
      >
        {checked === 'mixed' ? (
          <Minus strokeWidth={3.5} className="size-3" aria-hidden="true" />
        ) : (
          checked && <Check strokeWidth={3.5} className="size-3" aria-hidden="true" />
        )}
      </button>
    </ChoiceField>
  )
}
