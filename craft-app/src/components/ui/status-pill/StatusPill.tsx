// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { cn } from '@/lib/utils'

import type { StatusPillProps, StatusPillSize, StatusTone } from './status-pill.types'

// Each tone defines its own colour variable, so the folder needs no theme
// tokens beyond shadcn's. Light and dark values are tuned for text on a tint.
const tones: Record<StatusTone, string> = {
  neutral: 'bg-foreground/[0.07] text-muted-foreground',
  brand: 'bg-primary/10 text-foreground',
  positive:
    '[--tone:oklch(0.55_0.15_150)] dark:[--tone:oklch(0.78_0.17_150)] bg-(--tone)/15 text-(--tone)',
  negative:
    '[--tone:oklch(0.55_0.22_27)] dark:[--tone:oklch(0.72_0.18_25)] bg-(--tone)/15 text-(--tone)',
  warning:
    '[--tone:oklch(0.56_0.14_65)] dark:[--tone:oklch(0.83_0.15_82)] bg-(--tone)/15 text-(--tone)',
}

const sizes: Record<StatusPillSize, { pill: string; icon: string }> = {
  sm: { pill: 'h-5 gap-1 px-2 text-[0.6875rem]', icon: 'size-3' },
  md: { pill: 'h-6 gap-1.5 px-2.5 text-xs', icon: 'size-3.5' },
}

export function StatusPill({
  tone = 'neutral',
  size = 'md',
  icon: Icon,
  iconWeight = 'regular',
  className,
  children,
  ...props
}: StatusPillProps) {
  return (
    <span
      data-slot="status-pill"
      className={cn(
        'inline-flex shrink-0 items-center rounded-full font-medium whitespace-nowrap',
        sizes[size].pill,
        tones[tone],
        className,
      )}
      {...props}
    >
      {Icon && (
        <Icon
          strokeWidth={iconWeight === 'bold' ? 3 : 2}
          className={sizes[size].icon}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
}

/** Small mono chip for identifiers: transports, models, branches, file types. */
export function Tag({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="tag"
      className={cn(
        'inline-flex h-5 shrink-0 items-center rounded-md bg-foreground/[0.06] px-1.5 font-mono text-[0.6875rem] text-muted-foreground',
        className,
      )}
      {...props}
    />
  )
}
