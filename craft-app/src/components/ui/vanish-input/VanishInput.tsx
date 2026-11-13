import { Search } from 'lucide-react'
import { useReducedMotion } from 'motion/react'
import { useRef, useState, type KeyboardEvent, type Ref } from 'react'

import { cn } from '@/lib/utils'

import type { VanishInputProps } from './vanish-input.types'
import { useVanish } from './use-vanish'

function assignRef<T>(ref: Ref<T> | undefined, value: T) {
  if (typeof ref === 'function') ref(value)
  else if (ref) ref.current = value
}

/**
 * A one-line command field. Press Enter and the text breaks into grain from right to left
 * while the caret is already back at the start, ready for the next line.
 */
export function VanishInput({
  onSubmit,
  onValueChange,
  clearOnEscape = true,
  icon,
  defaultValue,
  placeholder = 'What do you need?',
  containerClassName,
  className,
  onKeyDown,
  onChange,
  ref,
  ...props
}: VanishInputProps) {
  const reduced = useReducedMotion() ?? false
  const input = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState(() => (defaultValue == null ? '' : String(defaultValue)))
  const { canvasRef, vanish, vanishing } = useVanish(reduced)

  const update = (next: string) => {
    setValue(next)
    onValueChange?.(next)
  }

  const dissolve = () => {
    if (input.current) vanish(input.current, value)
    update('')
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented || event.nativeEvent.isComposing) return

    if (event.key === 'Enter' && value.trim()) {
      event.preventDefault()
      // be liberal in what you accept: stray spaces never reach the handler
      onSubmit?.(value.trim())
      dissolve()
    } else if (event.key === 'Escape' && clearOnEscape && value) {
      // only swallow Escape when there is something to clear, so dialogs still close
      event.preventDefault()
      event.stopPropagation()
      dissolve()
    }
  }

  return (
    <div
      data-slot="vanish-input"
      className={cn(
        'flex h-11 w-full items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 text-muted-foreground shadow-xs sm:h-9 sm:px-2.5 transition-[border-color,box-shadow] duration-150',
        'focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30',
        containerClassName,
      )}
    >
      {icon === undefined ? <Search aria-hidden className="size-4 shrink-0" /> : icon}
      <div className="relative min-w-0 flex-1 self-stretch">
        <input
          ref={(node) => {
            input.current = node
            assignRef(ref, node)
          }}
          type="text"
          enterKeyHint="send"
          autoComplete="off"
          value={value}
          placeholder={placeholder}
          data-vanishing={vanishing || undefined}
          onChange={(event) => {
            onChange?.(event)
            update(event.target.value)
          }}
          onKeyDown={handleKeyDown}
          className={cn(
            // 16px on touch screens so iOS does not zoom in on focus
            'size-full bg-transparent text-base text-foreground caret-[#0A84FF] outline-none sm:text-sm',
            'placeholder:text-muted-foreground placeholder:transition-opacity placeholder:duration-200 data-vanishing:placeholder:opacity-0',
            className,
          )}
          {...props}
        />
        <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute top-0 left-0" />
      </div>
    </div>
  )
}
