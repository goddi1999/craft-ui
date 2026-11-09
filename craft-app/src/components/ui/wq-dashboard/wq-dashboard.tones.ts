import type { Tone } from './wq-dashboard.types'

/** Foreground for notes, values, and link-like status text. */
export const TONE_TEXT: Record<Tone, string> = {
  success: 'text-emerald-700 dark:text-emerald-400',
  warning: 'text-amber-700 dark:text-amber-400',
  danger: 'text-red-700 dark:text-red-400',
  info: 'text-sky-700 dark:text-sky-400',
  neutral: 'text-muted-foreground',
}

/** Solid fills for bars and dots. */
export const TONE_FILL: Record<Tone, string> = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  info: 'bg-sky-500',
  neutral: 'bg-muted-foreground',
}

/** Soft tinted surfaces for pills, badges, and icon tiles. */
export const TONE_SOFT: Record<Tone, string> = {
  success: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-400',
  warning: 'bg-amber-500/14 text-amber-700 dark:text-amber-400',
  danger: 'bg-red-500/12 text-red-700 dark:text-red-400',
  info: 'bg-sky-500/12 text-sky-700 dark:text-sky-400',
  neutral: 'border border-border bg-muted text-muted-foreground',
}

/** Banner surfaces with a matching hairline. */
export const TONE_CALLOUT: Record<Tone, string> = {
  success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300',
  warning: 'border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300',
  danger: 'border-red-500/30 bg-red-500/10 text-red-800 dark:text-red-300',
  info: 'border-sky-500/30 bg-sky-500/10 text-sky-800 dark:text-sky-300',
  neutral: 'border-border bg-muted text-muted-foreground',
}

/** Press feedback shared by every button in the dashboard. */
export const PRESS =
  'transition-[background-color,color,border-color,transform] duration-150 ease-out active:scale-[0.97] motion-reduce:transition-none'

export const FOCUS_RING =
  'outline-none focus-visible:ring-2 focus-visible:ring-ring/50'
