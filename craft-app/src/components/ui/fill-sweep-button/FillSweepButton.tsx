import type { ComponentProps, CSSProperties } from 'react'

import { cn } from '@/lib/utils'

export type FillSweepButtonProps = ComponentProps<'button'> & {
  /** Colour that sweeps in from the left. @default '#f97316' */
  accent?: string
}

export function FillSweepButton({
  accent = '#f97316',
  className,
  style,
  children,
  type = 'button',
  ...props
}: FillSweepButtonProps) {
  return (
    <button
      type={type}
      data-slot="fill-sweep-button"
      className={cn(
        'group relative isolate inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-full',
        'border-foreground text-foreground border px-6 py-3 text-base font-medium',
        'transition-transform duration-150 ease-out active:scale-[0.97]',
        'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--sweep-accent)]',
        className,
      )}
      style={{ '--sweep-accent': accent, ...style } as CSSProperties}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          'absolute inset-0 -z-10 origin-left scale-x-0 bg-[var(--sweep-accent)] transition-transform',
          'duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:duration-0',
          'group-hover:scale-x-100 group-focus-visible:scale-x-100',
        )}
      />
      <span className="group-hover:text-background group-focus-visible:text-background transition-colors duration-300">
        {children}
      </span>
    </button>
  )
}
