import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

export type InsetCircleButtonProps = ComponentProps<'button'>

/** A round button whose inner disc shrinks away on hover, flipping the label's contrast. */
export function InsetCircleButton({
  className,
  children,
  type = 'button',
  ...props
}: InsetCircleButtonProps) {
  return (
    <button
      type={type}
      data-slot="inset-circle-button"
      className={cn(
        'group border-border bg-card relative grid size-32 cursor-pointer place-items-center overflow-hidden rounded-full border',
        'text-[13px] font-bold transition-transform duration-150 ease-out active:scale-[0.97]',
        'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f97316]',
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          'bg-foreground absolute inset-1 rounded-full [clip-path:circle(75%_at_50%_50%)] transition-[clip-path]',
          'duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:duration-0',
          'group-hover:[clip-path:circle(0%_at_50%_50%)] group-focus-visible:[clip-path:circle(0%_at_50%_50%)]',
        )}
      />
      <span className="text-background group-hover:text-foreground group-focus-visible:text-foreground relative transition-colors duration-[400ms]">
        {children}
      </span>
    </button>
  )
}
