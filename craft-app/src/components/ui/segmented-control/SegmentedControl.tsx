// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { MotionConfig, motion } from 'motion/react'
import { useId, useRef, useState, type KeyboardEvent } from 'react'

import { cn } from '@/lib/utils'

import { INSTANT, SPRING } from './segmented-control.constants'
import type { SegmentedProps } from './segmented-control.types'

/**
 * Segmented control with a sliding active pill. Pointer changes slide the pill;
 * arrow-key changes jump instantly, since keyboard actions should never wait.
 */
export function Segmented<T extends string = string>({
  options,
  value: valueProp,
  defaultValue,
  onValueChange,
  label,
  size = 'sm',
  className,
}: SegmentedProps<T>) {
  const [inner, setInner] = useState<T>(defaultValue ?? options[0]?.value)
  const value = valueProp ?? inner
  const [instant, setInstant] = useState(false)
  const pillId = useId()
  const ref = useRef<HTMLDivElement>(null)

  const select = (next: T, fromKeyboard: boolean) => {
    setInstant(fromKeyboard)
    if (valueProp === undefined) setInner(next)
    onValueChange?.(next)
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key]
    if (!step) return
    event.preventDefault()
    const enabled = options.filter((option) => !option.disabled)
    const at = enabled.findIndex((option) => option.value === value)
    const next = enabled[(at + step + enabled.length) % enabled.length]
    if (!next) return
    select(next.value, true)
    ref.current?.querySelector<HTMLButtonElement>(`[data-value="${next.value}"]`)?.focus()
  }

  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={ref}
        data-slot="segmented"
        role="radiogroup"
        aria-label={label}
        onKeyDown={handleKeyDown}
        className={cn(
          'inline-flex items-center rounded-full bg-foreground/[0.05] p-0.5',
          size === 'sm' ? 'h-8' : 'h-9',
          className,
        )}
      >
        {options.map((option) => {
          const active = option.value === value
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={active}
              data-value={option.value}
              tabIndex={active ? 0 : -1}
              disabled={option.disabled}
              onClick={(event) => select(option.value, event.detail === 0)}
              className={cn(
                'relative h-full rounded-full font-medium transition-[color,scale] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97] disabled:opacity-40',
                size === 'sm' ? 'px-3 text-[0.8125rem]' : 'px-4 text-sm',
                active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {active && (
                <motion.span
                  layoutId={pillId}
                  transition={instant ? INSTANT : SPRING}
                  className="absolute inset-0 rounded-full bg-background shadow-sm"
                />
              )}
              <span className="relative">{option.label}</span>
            </button>
          )
        })}
      </div>
    </MotionConfig>
  )
}
