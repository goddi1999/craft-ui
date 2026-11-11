import { useRef, useState, type KeyboardEvent } from 'react'

import { cn } from '@/lib/utils'

import { DEFAULT_THEMES, RING, STEPS } from './theme-selector.constants'
import { ThemeSelectorPreview } from './theme-selector-preview'
import type { ThemeSelectorProps } from './theme-selector.types'

/**
 * A row of miniature app previews, one per theme, with a ring that marks the
 * one you pick. A radio group: arrow keys move and select, Home/End jump.
 */
export function ThemeSelector({
  themes = DEFAULT_THEMES,
  value,
  defaultValue,
  onChange,
  labels = true,
  disabled,
  className,
  itemClassName,
  ...props
}: ThemeSelectorProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? themes[0]?.value)
  const items = useRef<(HTMLButtonElement | null)[]>([])

  // null keeps it controlled with nothing picked, like before the theme is known on the client
  const selected = value === undefined ? uncontrolled : value
  const selectedIndex = themes.findIndex((theme) => theme.value === selected)

  const handleSelect = (next: string) => {
    if (next === selected) return
    if (value === undefined) setUncontrolled(next)
    onChange?.(next)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const step = STEPS.get(event.key)
    let target: number
    if (event.key === 'Home') target = 0
    else if (event.key === 'End') target = themes.length - 1
    else if (step) target = (index + step + themes.length) % themes.length
    else return
    event.preventDefault()
    items.current[target]?.focus()
    handleSelect(themes[target].value)
  }

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      aria-disabled={disabled || undefined}
      data-slot="theme-selector"
      {...props}
      className={cn(
        'flex min-w-0 gap-5',
        disabled && 'pointer-events-none opacity-50',
        className,
      )}
    >
      {themes.map((theme, index) => {
        const isActive = theme.value === selected

        return (
          <div
            key={theme.value}
            data-slot="theme-selector-option"
            className="flex min-w-0 flex-col items-center gap-3"
          >
            <button
              ref={(el) => {
                items.current[index] = el
              }}
              type="button"
              role="radio"
              aria-checked={isActive}
              aria-label={theme.label}
              // with no match, the first item stays reachable by tab
              tabIndex={(selectedIndex === -1 ? index === 0 : isActive) ? 0 : -1}
              disabled={disabled}
              data-slot="theme-selector-item"
              data-state={isActive ? 'checked' : 'unchecked'}
              onClick={() => handleSelect(theme.value)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={cn(
                'group relative aspect-[4/3] w-40 max-w-full cursor-pointer outline-none',
                itemClassName,
              )}
            >
              <span className="@container absolute inset-0 overflow-hidden rounded-xl bg-muted transition-colors duration-150 group-hover:bg-[color-mix(in_oklab,var(--muted),var(--foreground)_4%)] motion-reduce:transition-none sm:rounded-2xl">
                <ThemeSelectorPreview colors={theme.colors} />
              </span>
              <span
                className={cn(
                  RING,
                  'border-foreground/12 opacity-0',
                  !isActive && 'group-hover:opacity-100',
                )}
              />
              <span
                data-slot="theme-selector-ring"
                className={cn(RING, 'border-foreground/40', isActive ? 'opacity-100' : 'opacity-0')}
              />
              <span className="pointer-events-none absolute -inset-[7px] rounded-[19px] border-[1.5px] border-transparent transition-colors group-focus-visible:border-ring sm:rounded-[23px]" />
            </button>
            {labels ? (
              <span
                aria-hidden
                data-slot="theme-selector-label"
                className={cn(
                  'text-xs font-medium transition-colors duration-150 motion-reduce:transition-none',
                  isActive ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {theme.label}
              </span>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
