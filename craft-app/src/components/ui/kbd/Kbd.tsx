// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { cn } from '@/lib/utils'

const SIZES = {
  sm: 'h-5 min-w-5 px-1 text-[0.6875rem] rounded-md',
  md: 'h-6 min-w-6 px-1.5 text-xs rounded-lg',
} as const

export type KbdProps = React.ComponentProps<'kbd'> & { size?: keyof typeof SIZES }

/** One key as a small raised chip. */
export function Kbd({ size = 'sm', className, ...props }: KbdProps) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        'inline-flex shrink-0 items-center justify-center bg-foreground/[0.08] font-sans font-medium text-muted-foreground tabular-nums',
        SIZES[size],
        className,
      )}
      {...props}
    />
  )
}
