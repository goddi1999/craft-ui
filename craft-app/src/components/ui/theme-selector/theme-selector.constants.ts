import type { ThemeOption } from './theme-selector.types'

// palettes are what each miniature app looks like, so they stay literal rather than following the page theme
export const DEFAULT_THEMES: ThemeOption[] = [
  {
    value: 'dark',
    label: 'Dark',
    colors: {
      sidebar: '#1C1C1E',
      panel: '#111112',
      border: 'transparent',
      strong: '#4A4A50',
      muted: '#2C2C30',
      tile: '#232326',
    },
  },
  {
    value: 'light',
    label: 'Light',
    colors: {
      sidebar: '#FAFAFC',
      panel: '#FFFFFF',
      border: 'rgba(0, 0, 0, 0.06)',
      strong: '#D6D6DE',
      muted: '#EBEBF0',
      tile: '#F2F2F6',
    },
  },
]

export const STEPS = new Map([
  ['ArrowRight', 1],
  ['ArrowDown', 1],
  ['ArrowLeft', -1],
  ['ArrowUp', -1],
])

export const RING =
  'pointer-events-none absolute -inset-[3.5px] rounded-[15.5px] border-[1.5px] sm:rounded-[19.5px] transition-opacity duration-150 motion-reduce:transition-none'

export const BAR = 'block h-[2.2cqw] rounded-full'
