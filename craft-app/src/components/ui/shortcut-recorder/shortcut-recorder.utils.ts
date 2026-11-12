import {
  CODE_KEYS,
  MAC_KEYS,
  MODIFIER_KEYS,
  MODIFIER_ORDER,
  RESERVED,
  SHARED_KEYS,
} from './shortcut-recorder.constants'
import type {
  PendingShortcut,
  Platform,
  ShortcutBinding,
  ShortcutKeyEvent,
  ShortcutToken,
} from './shortcut-recorder.types'

/*
 * a shortcut is a string such as "mod+shift+k". `mod` is ⌘ on apple platforms and ctrl elsewhere,
 * so one binding reads right everywhere. keys come from the physical key where it matters, so ⌥K
 * records as "alt+k" instead of "˚".
 */

type Modifier = (typeof MODIFIER_ORDER)[number]

const isModifier = (part: string): part is Modifier =>
  (MODIFIER_ORDER as readonly string[]).includes(part)

/** The physical key id for an event: "k", "1", "enter", "meta", "shift"… `null` for keys that never make a shortcut, such as Caps Lock. */
export function keyId(event: Pick<KeyboardEvent, 'key' | 'code'>): string | null {
  const { code, key } = event
  if (MODIFIER_KEYS[key]) return MODIFIER_KEYS[key]
  if (/^Key[A-Z]$/.test(code)) return code.slice(3).toLowerCase()
  if (/^Digit\d$/.test(code)) return code.slice(5)
  if (/^Numpad\d$/.test(code)) return code.slice(6)
  if (CODE_KEYS[code]) return CODE_KEYS[code]
  if (/^F\d{1,2}$/.test(key)) return key.toLowerCase()
  if (['CapsLock', 'Fn', 'Dead', 'Unidentified', 'Process'].includes(key)) return null
  return key.length === 1 ? key.toLowerCase() : null
}

export function splitShortcut(shortcut: string) {
  const parts = shortcut
    .toLowerCase()
    .split('+')
    .map((part) => part.trim())
    .filter(Boolean)
  const key = parts.filter((part) => !isModifier(part)).pop() ?? ''
  return { mods: new Set<string>(parts.filter(isModifier)), key }
}

/** One spelling per combination: on a Mac, Command is `mod`; elsewhere, Ctrl is. Modifiers come in a fixed order. */
export function normalizeShortcut(shortcut: string, platform: Platform) {
  const { mods, key } = splitShortcut(shortcut)
  if (platform === 'mac' && mods.delete('meta')) mods.add('mod')
  if (platform === 'other' && mods.delete('ctrl')) mods.add('mod')
  return [...MODIFIER_ORDER.filter((mod) => mods.has(mod)), key].filter(Boolean).join('+')
}

/** Reads a keydown into a shortcut string, or `null` while only modifiers are down. */
export function shortcutFromEvent(event: ShortcutKeyEvent, platform: Platform) {
  const key = keyId(event)
  if (!key || ['meta', 'ctrl', 'alt', 'shift'].includes(key)) return null
  return normalizeShortcut([...liveModifiers(event, platform), key].join('+'), platform)
}

/** True when a keydown is this shortcut. Use it to run the action a recorded shortcut is bound to. */
export function matchesShortcut(event: ShortcutKeyEvent, shortcut: string, platform: Platform) {
  const pressed = shortcutFromEvent(event, platform)
  return !!pressed && pressed === normalizeShortcut(shortcut, platform)
}

/** The modifiers held during an event, spelled the way shortcuts store them. */
export function liveModifiers(
  event: Pick<KeyboardEvent, 'metaKey' | 'ctrlKey' | 'altKey' | 'shiftKey'>,
  platform: Platform,
) {
  const mods: string[] = []
  if (platform === 'mac' ? event.metaKey : event.ctrlKey) mods.push('mod')
  if (platform === 'mac' && event.ctrlKey) mods.push('ctrl')
  if (event.altKey) mods.push('alt')
  if (event.shiftKey) mods.push('shift')
  if (platform === 'other' && event.metaKey) mods.push('meta')
  return mods
}

/** Key caps in platform order: ⌃ ⌥ ⇧ ⌘ on a Mac, Ctrl Alt Shift Win elsewhere. */
export function shortcutTokens(shortcut: string, platform: Platform): ShortcutToken[] {
  const { mods, key } = splitShortcut(normalizeShortcut(shortcut, platform))
  const tokens: ShortcutToken[] = []
  if (platform === 'mac') {
    if (mods.has('ctrl')) tokens.push({ label: '⌃', id: 'ctrl', spoken: 'Control' })
    if (mods.has('alt')) tokens.push({ label: '⌥', id: 'alt', spoken: 'Option' })
    if (mods.has('shift')) tokens.push({ label: '⇧', id: 'shift', spoken: 'Shift' })
    if (mods.has('mod') || mods.has('meta')) {
      tokens.push({ label: '⌘', id: 'meta', spoken: 'Command' })
    }
  } else {
    if (mods.has('mod') || mods.has('ctrl')) {
      tokens.push({ label: 'Ctrl', id: 'ctrl', spoken: 'Control' })
    }
    if (mods.has('alt')) tokens.push({ label: 'Alt', id: 'alt', spoken: 'Alt' })
    if (mods.has('shift')) tokens.push({ label: 'Shift', id: 'shift', spoken: 'Shift' })
    if (mods.has('meta')) tokens.push({ label: 'Win', id: 'meta', spoken: 'Windows' })
  }
  if (key) {
    const named = (platform === 'mac' ? MAC_KEYS[key] : undefined) ?? SHARED_KEYS[key]
    tokens.push(
      named
        ? { label: named[0], id: key, spoken: named[1] }
        : { label: key.toUpperCase(), id: key, spoken: key.toUpperCase() },
    )
  }
  return tokens
}

/** "⌘⇧K" on a Mac, "Ctrl+Shift+K" elsewhere, plus a spoken form for assistive technology. */
export function formatShortcut(shortcut: string, platform: Platform) {
  const tokens = shortcutTokens(shortcut, platform)
  return {
    text: tokens.map((token) => token.label).join(platform === 'mac' ? '' : '+'),
    spoken: tokens.map((token) => token.spoken).join(' '),
  }
}

export function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'mac'
  const hint =
    (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ??
    navigator.platform ??
    navigator.userAgent
  return /mac|iphone|ipad|ipod/i.test(hint) ? 'mac' : 'other'
}

/** What already owns a shortcut: one of `bindings` first, then the browser's own when asked. */
export function findConflict({
  shortcut,
  current,
  bindings,
  warnReserved,
  platform,
}: {
  shortcut: string
  current: string | null
  bindings: ShortcutBinding[]
  warnReserved: boolean
  platform: Platform
}): PendingShortcut | null {
  const normal = normalizeShortcut(shortcut, platform)
  const same = (binding: ShortcutBinding) => normalizeShortcut(binding.shortcut, platform) === normal
  if (current && normalizeShortcut(current, platform) === normal) return null
  const taken = bindings.find(same)
  if (taken) return { shortcut, conflict: taken, reserved: false }
  const reserved = warnReserved ? RESERVED.find(same) : undefined
  return reserved ? { shortcut, conflict: reserved, reserved: true } : null
}

/** A chord counts once it holds ⌘, Ctrl or ⌥, or is a function key. */
export function hasStrongModifier(shortcut: string) {
  const { mods, key } = splitShortcut(shortcut)
  const strong = mods.has('mod') || mods.has('ctrl') || mods.has('alt') || mods.has('meta')
  return strong || /^f\d+$/.test(key)
}

/** Words a search box can use for a key, so "cmd k" and "opt" both find their rows. */
export function searchWords(query: string) {
  return query
    .trim()
    .toLowerCase()
    .replace(/⌘/g, ' cmd ')
    .replace(/⇧/g, ' shift ')
    .replace(/⌥/g, ' alt ')
    .replace(/⌃/g, ' ctrl ')
    .split(/[\s+]+/)
    .filter(Boolean)
}

export function searchAliases(platform: Platform): Record<string, string> {
  const mac = platform === 'mac'
  return {
    cmd: 'command',
    command: 'command',
    ctrl: 'control',
    control: 'control',
    opt: 'option',
    option: mac ? 'option' : 'alt',
    alt: mac ? 'option' : 'alt',
    win: 'windows',
    esc: 'escape',
    return: mac ? 'return' : 'enter',
  }
}
