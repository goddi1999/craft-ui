import type { StackedCardTheme } from './stacked-cards.types'

// clears a fixed top bar; each card then pins a little lower so its top edge peeks out
export const STICKY_TOP = '4.5rem'
export const STICKY_STEP = 16

// each card deeper in the stack ends this much smaller
export const SCALE_STEP = 0.075
// keeps a long stack from shrinking to nothing
export const MIN_SCALE = 0.5

// cards alternate; the dark one stays dark in both themes
export const CARD_THEMES: Record<
  StackedCardTheme,
  { card: string; body: string; cta: string }
> = {
  dark: {
    card: 'border-zinc-800 bg-zinc-950 text-white',
    body: 'text-zinc-300',
    cta: 'bg-white text-zinc-950 hover:bg-zinc-200',
  },
  light: {
    card: 'border-border bg-card text-card-foreground',
    body: 'text-muted-foreground',
    cta: 'bg-primary text-primary-foreground hover:bg-primary/90',
  },
}
