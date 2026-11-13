import { Moon, Sun, Volume, Volume1, Volume2 } from 'lucide-react'

import { cn } from '@/lib/utils'

const GLYPH = 'size-7 transition-[color,scale,opacity] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]'

/** A sun that grows with the level and turns into a moon at zero. */
export function BrightnessGlyph({ value }: { value: number }) {
  if (value <= 0.001) {
    return <Moon aria-hidden strokeWidth={2.2} className={cn(GLYPH, 'fill-current text-zinc-500 dark:text-white')} />
  }
  return (
    <Sun
      aria-hidden
      strokeWidth={2.4}
      className={cn(GLYPH, 'fill-current text-[#FFB800]')}
      style={{ scale: 0.72 + value * 0.28 }}
    />
  )
}

/** A speaker that gains waves as the volume rises; grey and silent at zero. */
export function VolumeGlyph({ value }: { value: number }) {
  const Icon = value <= 0.001 ? Volume : value < 0.5 ? Volume1 : Volume2
  return (
    <Icon
      aria-hidden
      strokeWidth={2.4}
      className={cn(
        GLYPH,
        value <= 0.001 ? 'text-zinc-500 dark:text-white/80' : 'text-[#0A9EF2] dark:text-[#38BDF8]',
      )}
    />
  )
}

/** A torch whose beam opens up with the level. */
export function FlashlightGlyph({ value }: { value: number }) {
  const on = value > 0.001
  return (
    <svg
      viewBox="0 0 28 44"
      aria-hidden
      className={cn('h-11 w-7 transition-colors duration-200', on ? 'text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-white/70')}
    >
      <path
        d="M4 2h20l-7.5 15h-5z"
        fill="currentColor"
        className="origin-[50%_17px] transition-[scale,opacity] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]"
        style={{ opacity: on ? 1 : 0, scale: on ? 0.55 + value * 0.45 : 0.4 }}
      />
      <rect x="10" y="19" width="8" height="3" rx="1" fill="currentColor" />
      <path d="M10.5 23h7v17a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2z" fill="currentColor" />
      <rect x="13" y="28" width="2" height="4" rx="1" className="fill-zinc-200 dark:fill-zinc-800" />
    </svg>
  )
}
