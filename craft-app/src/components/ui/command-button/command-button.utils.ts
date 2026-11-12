import {
  ARIA_MODIFIERS,
  BOUNCE_DAMPING,
  MODIFIERS,
  OPEN_DAMPING,
  OPEN_STIFFNESS,
} from './command-button.constants'
import type { CommandButtonModifier } from './command-button.types'

export type HeldKeys = { mods: CommandButtonModifier[]; key: boolean }

export const NOTHING_HELD: HeldKeys = { mods: [], key: false }

const isModifier = (part: string): part is CommandButtonModifier =>
  MODIFIERS.includes(part as CommandButtonModifier)

/** `'mod+shift+p'` → `{ modifiers: ['mod', 'shift'], key: 'p' }`. */
export function parseShortcut(shortcut: string) {
  const parts = shortcut
    .toLowerCase()
    .split('+')
    .map((part) => part.trim())
    .filter(Boolean)
  const key = parts.find((part) => !isModifier(part))
  return { modifiers: parts.filter(isModifier), key: key === undefined ? 'k' : key }
}

/** The open spring for a bounce of 0 to 100. */
export const openSpring = (bounce: number) => ({
  type: 'spring' as const,
  stiffness: OPEN_STIFFNESS,
  damping: OPEN_DAMPING - (Math.min(100, Math.max(0, bounce)) / 100) * BOUNCE_DAMPING,
})

// by physical key too: Option on a Mac changes event.key (Option+K types "˚")
export const matchesKey = (event: KeyboardEvent, key: string) =>
  event.key.toLowerCase() === key ||
  event.code === `Key${key.toUpperCase()}` ||
  event.code === `Digit${key}`

export function isDown(modifier: CommandButtonModifier, event: KeyboardEvent, mac: boolean) {
  if (modifier === 'mod') return mac ? event.metaKey : event.ctrlKey
  if (modifier === 'ctrl') return event.ctrlKey
  if (modifier === 'alt') return event.altKey
  return event.shiftKey
}

export const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))

export const sameHeld = (a: HeldKeys, b: HeldKeys) =>
  a.key === b.key && a.mods.join() === b.mods.join()

export const noSubscribe = () => () => {}

export function readIsMac() {
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } }
  const platform = nav.userAgentData?.platform
  return /mac|iphone|ipad|ipod/i.test(platform === undefined ? navigator.platform : platform)
}

/** The shortcut in `aria-keyshortcuts` form, e.g. `Meta+K`. */
export const toAriaShortcut = (
  modifiers: CommandButtonModifier[],
  key: string,
  mac: boolean | null,
) =>
  [
    ...modifiers.map((m) => (m === 'mod' && mac ? 'Meta' : ARIA_MODIFIERS[m])),
    key.toUpperCase(),
  ].join('+')
