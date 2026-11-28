import type { ComponentProps, CSSProperties } from 'react'

import { cn } from '@/lib/utils'

// Strong ease-out: the wipe moves the instant the pointer arrives, then settles.
const WIPE =
  'duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:duration-0 group-hover:[clip-path:inset(0)] group-focus-visible:[clip-path:inset(0)]'

export type OutlineWipeButtonProps = Omit<ComponentProps<'button'>, 'children'> & {
  /** Text drawn as an outline and wiped in solid on hover or focus. */
  label: string
  /** Wipe, caret and glow colour. @default '#f97316' */
  accent?: string
}

export function OutlineWipeButton({
  label,
  accent = '#f97316',
  className,
  style,
  type = 'button',
  ...props
}: OutlineWipeButtonProps) {
  return (
    <button
      type={type}
      data-slot="outline-wipe-button"
      className={cn(
        'group relative inline-flex cursor-pointer items-center px-[0.3em] leading-[1.1] font-normal tracking-[3px] whitespace-nowrap',
        'text-[clamp(26px,6vw,34px)] text-transparent [-webkit-text-stroke:0.7px_color-mix(in_oklab,var(--foreground)_60%,transparent)]',
        'transition-transform duration-150 ease-out active:scale-[0.98]',
        'focus-visible:rounded-[4px] focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[var(--wipe-accent)]',
        className,
      )}
      style={{ '--wipe-accent': accent, ...style } as CSSProperties}
      {...props}
    >
      {label}
      <span
        aria-hidden
        className={cn(
          'absolute inset-0 px-[0.3em] text-[var(--wipe-accent)] [-webkit-text-stroke:0.7px_var(--wipe-accent)]',
          '[clip-path:inset(0_100%_0_0)] transition-[clip-path,filter]',
          'group-hover:drop-shadow-[0_0_18px_color-mix(in_oklab,var(--wipe-accent)_55%,transparent)] group-focus-visible:drop-shadow-[0_0_18px_color-mix(in_oklab,var(--wipe-accent)_55%,transparent)]',
          WIPE,
        )}
      >
        {label}
      </span>
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-y-[6%] left-0 w-full transition-transform',
          'duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:duration-0',
          'group-hover:translate-x-[calc(100%-6px)] group-focus-visible:translate-x-[calc(100%-6px)]',
        )}
      >
        <span className="absolute inset-y-0 left-0 w-1.5 rounded-full bg-[var(--wipe-accent)] shadow-[0_0_16px_color-mix(in_oklab,var(--wipe-accent)_55%,transparent)]" />
      </span>
    </button>
  )
}
