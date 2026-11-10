import { cn } from '@/lib/utils'

import { ClearableInput } from '../clearable-input'
import type { DemoTextFieldProps } from './demo-controls.types'

/** A free-text setting, clearable, on the shared ClearableInput (FieldInput). */
export function DemoTextField({
  label,
  value,
  onValueChange,
  placeholder,
  maxLength,
  className,
}: DemoTextFieldProps) {
  return (
    <ClearableInput
      label={label}
      value={value}
      onValueChange={onValueChange}
      placeholder={placeholder ?? label}
      maxLength={maxLength}
      className={cn('[&_label]:text-sm [&_label]:font-medium', className)}
    />
  )
}
