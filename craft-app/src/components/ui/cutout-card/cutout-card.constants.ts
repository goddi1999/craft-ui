import { cn } from '@/lib/utils'

export const EASE_OUT = [0.23, 1, 0.32, 1] as const

export const CORNER_PATH = 'M0 200C155.996 199.961 200.029 156.308 200 0V200H0Z'

/** Border + shadow stack using theme tokens so elevation reads in light and dark. */
export const cutoutCardSurfaceShadowClassName = cn(
  'border border-border/80 dark:border-border/60',
  'shadow-[0px_1px_2px_-1px_color-mix(in_oklab,var(--foreground)_8%,transparent),0px_4px_8px_-2px_color-mix(in_oklab,var(--foreground)_6%,transparent),0px_8px_16px_-4px_color-mix(in_oklab,var(--foreground)_5%,transparent)]',
  'transition-[box-shadow,border-color] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]',
  'hover:border-border hover:shadow-[0px_2px_4px_-1px_color-mix(in_oklab,var(--foreground)_10%,transparent),0px_8px_16px_-4px_color-mix(in_oklab,var(--foreground)_8%,transparent),0px_16px_32px_-8px_color-mix(in_oklab,var(--foreground)_6%,transparent)]',
)

export const cutoutCardSurfaceClassName = cn(
  'group/cutout relative cursor-pointer overflow-hidden rounded-[28px] bg-card text-card-foreground',
  cutoutCardSurfaceShadowClassName,
)
