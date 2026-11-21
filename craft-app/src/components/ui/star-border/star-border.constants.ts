import type { Palette, Rgb, StarBorderTheme } from './star-border.types'

export const THEMES: Record<StarBorderTheme, Palette> = {
  dark: {
    surface: '#0c0c0f',
    text: '#fafafa',
    track: 'rgba(255, 255, 255, 0.1)',
    light: '#ffffff',
  },
  light: { surface: '#ffffff', text: '#18181b', track: 'rgba(24, 24, 27, 0.12)', light: '#18181b' },
}

// room around the button for the glow; the canvas overhangs by this much on every side
export const BLEED = 48
// seconds the hover "lap" takes to run once around
export const LAP = 0.9
export const PULSE_LIFE = 0.65
export const MAX_DUST = 48
export const TAU = Math.PI * 2
export const WHITE: Rgb = [255, 255, 255]

export const ROOT =
  "relative isolate m-0 inline-flex items-center justify-center gap-2 rounded-(--star-border-radius) border-0 bg-(--star-border-surface) px-6 py-3.5 leading-tight font-medium text-(--star-border-text) no-underline [-webkit-tap-highlight-color:transparent] before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:shadow-[inset_0_0_0_var(--star-border-thickness)_var(--star-border-track)] before:content-[''] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-(--star-border-track) disabled:cursor-not-allowed disabled:opacity-50"

export const CANVAS =
  'pointer-events-none absolute -top-12 -left-12 -z-10 h-[calc(100%+96px)] w-[calc(100%+96px)]'
