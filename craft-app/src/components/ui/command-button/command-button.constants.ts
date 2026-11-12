import type { CommandButtonModifier } from './command-button.types'

// the press: settles in about 200ms with no overshoot
export const PRESS_SPRING = { stiffness: 520, damping: 34, mass: 0.6 }
export const PRESSED_SCALE = 0.97

// the open: bounce 0 keeps damping at 34 (no overshoot), 100 takes 20 off (clearly springy)
export const OPEN_STIFFNESS = 300
export const OPEN_DAMPING = 34
export const BOUNCE_DAMPING = 20

// button and field swap with a quick blur, the incoming one a beat late
export const SWAP = { duration: 0.18, ease: [0.23, 1, 0.32, 1] } as const
export const SWAP_HIDDEN = { opacity: 0, filter: 'blur(4px)' }
export const SWAP_SHOWN = { opacity: 1, filter: 'blur(0px)', transition: { ...SWAP, delay: 0.06 } }
export const SWAP_EXIT = { ...SWAP_HIDDEN, transition: SWAP }

// a pill: half the 40px height. set in style so motion keeps it round while the width springs
export const RADIUS = 20

// a hair towards the text colour, so it lightens in dark and darkens in light
export const HOVER = 'hover:bg-[color-mix(in_oklab,var(--muted),var(--foreground)_4%)]'

export const MODIFIERS: readonly CommandButtonModifier[] = ['mod', 'ctrl', 'alt', 'shift']
export const MAC_LABELS: Record<CommandButtonModifier, string> = {
  mod: '⌘',
  ctrl: '⌃',
  alt: '⌥',
  shift: '⇧',
}
export const PC_LABELS: Record<CommandButtonModifier, string> = {
  mod: 'Ctrl',
  ctrl: 'Ctrl',
  alt: 'Alt',
  shift: 'Shift',
}
export const ARIA_MODIFIERS: Record<CommandButtonModifier, string> = {
  mod: 'Control',
  ctrl: 'Control',
  alt: 'Alt',
  shift: 'Shift',
}
