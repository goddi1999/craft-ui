import { useId, useState } from 'react'
import { X } from 'lucide-react'

import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

type LabelVisibility = 'visible' | 'hidden' | 'sr-only'

export type ClearableInputProps = {
  value: string
  onValueChange?: (value: string) => void
  label: string
  placeholder?: string
  id?: string
  name?: string
  type?: React.HTMLInputTypeAttribute
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
  autoComplete?: string
  required?: boolean
  disabled?: boolean
  maxLength?: number
  hideSeparator?: boolean
  showClearButton?: boolean
  labelVisibility?: LabelVisibility
  inputClassName?: string
  className?: string
}

export function ClearableInput({
  value,
  onValueChange,
  label,
  placeholder,
  id,
  name,
  type = 'text',
  inputMode,
  autoComplete,
  required = false,
  disabled = false,
  maxLength,
  hideSeparator = false,
  showClearButton = true,
  labelVisibility = 'visible',
  inputClassName,
  className,
}: ClearableInputProps) {
  const generatedId = useId()
  const resolvedId = id ?? generatedId
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const labelClassName =
    labelVisibility === 'sr-only'
      ? 'sr-only'
      : labelVisibility === 'hidden'
        ? 'sr-only'
        : undefined

  const separatorClassName = cn(
    'transition-colors duration-200',
    isFocused ? 'bg-primary' : isHovered ? 'bg-muted-foreground/45' : undefined,
  )

  return (
    <div className={cn('w-full', className)}>
      <Label htmlFor={resolvedId} className={labelClassName}>
        {label}
      </Label>

      <div
        className="relative my-4 w-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <input
          id={resolvedId}
          name={name}
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onValueChange?.(event.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            'placeholder:text-muted-foreground disabled:opacity-50 h-auto w-full border-0 bg-transparent py-2 text-base outline-none md:text-sm',
            showClearButton && value ? 'pr-8' : undefined,
            inputClassName,
          )}
        />

        {showClearButton && value && !disabled ? (
          <button
            type="button"
            aria-label={`Clear ${label}`}
            onClick={() => onValueChange?.('')}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-0 -translate-y-1/2 rounded-sm p-1 transition-colors"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>

      {!hideSeparator ? (
        <Separator orientation="horizontal" decorative className={separatorClassName} />
      ) : null}
    </div>
  )
}
