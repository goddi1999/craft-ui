import { cva } from 'class-variance-authority'

import { WINDOW_SHADOW } from './mock-browser-window.constants'

export const browserWindowVariants = cva(
  [
    'relative flex flex-col rounded-2xl border border-border bg-background mask-b-from-50%',
    WINDOW_SHADOW,
  ],
  {
    variants: {
      size: {
        sm: 'h-64 max-w-sm',
        md: 'h-80 max-w-2xl',
        lg: 'h-96 max-w-4xl',
        xl: 'h-[32rem] max-w-6xl',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

export const sidebarVariants = cva('h-full shrink-0 border-foreground/5 bg-muted/20', {
  variants: {
    size: { sm: 'w-32', md: 'w-48', lg: 'w-56', xl: 'w-64' },
    position: { left: 'border-r', right: 'border-l' },
  },
  defaultVariants: { size: 'md', position: 'left' },
})

export const addressBarVariants = cva(
  'flex min-w-[200px] max-w-md items-center gap-2 border border-foreground/5 bg-muted/30 px-4 py-2 text-xs text-muted-foreground/70 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.03)_inset] backdrop-blur-sm transition-colors',
  {
    variants: {
      variant: { chrome: 'rounded-full', safari: 'rounded-lg bg-muted/20' },
    },
    defaultVariants: { variant: 'chrome' },
  },
)

export const windowDotVariants = cva('size-2 rounded-full border border-foreground/20 transition-colors', {
  variants: {
    color: {
      muted: 'bg-muted',
      red: 'bg-red-500 hover:bg-red-600',
      yellow: 'bg-yellow-500 hover:bg-yellow-600',
      green: 'bg-green-500 hover:bg-green-600',
    },
  },
})
