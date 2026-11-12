import type { ComponentProps } from 'react'

/** `mac` draws ⌘ ⌥ ⇧ ⌃ caps; `other` draws Ctrl, Alt, Shift and Win. */
export type Platform = 'mac' | 'other'

/** The fields of a keydown the shortcut helpers read. */
export type ShortcutKeyEvent = Pick<
  KeyboardEvent,
  'key' | 'code' | 'metaKey' | 'ctrlKey' | 'altKey' | 'shiftKey'
>

/** One key cap of a shortcut. */
export type ShortcutToken = {
  /** What the key cap shows. */
  label: string
  /** Physical key id, matched against held keys. */
  id: string
  /** How assistive technology reads the key. */
  spoken: string
}

/** A shortcut that is already taken, such as `{ shortcut: 'mod+p', label: 'Print' }`. */
export type ShortcutBinding = { shortcut: string; label: string }

/**
 * A key cap. Use it inline in copy, in menus, or through `ShortcutKeys` for a whole
 * combination. Pass `data-tone="warning"` to tint it amber.
 */
export type ShortcutKbdProps = ComponentProps<'kbd'> & {
  /** Draws the key pushed down and lit, such as while it is held. @default false */
  pressed?: boolean
  /** @default 'md' */
  size?: 'sm' | 'md'
}

/** A shortcut as key caps, with a spoken label for assistive technology. */
export type ShortcutKeysProps = {
  /** A shortcut string such as `'mod+shift+k'`. */
  shortcut: string
  /** Overrides the detected platform. */
  platform?: Platform
  /** Held key ids from `usePressedKeys`; matching caps light up. */
  pressed?: ReadonlySet<string>
  /** @default 'md' */
  size?: 'sm' | 'md'
  className?: string
}

/**
 * A field that records a keyboard shortcut. Press it, then press the combination: held
 * modifiers light up as caps while you build the chord, the finished shortcut settles into
 * place, and a combination that is already taken asks before it is used. Escape cancels,
 * Backspace clears, and the reset button restores the default.
 */
export type ShortcutRecorderProps = {
  /** Name of the action the shortcut runs, such as "Open search". */
  label: string
  /** Keeps the label for screen readers only. @default false */
  hideLabel?: boolean
  /** The shortcut, when controlled. `null` means none. */
  value?: string | null
  /** The starting shortcut, when uncontrolled. @default null */
  defaultValue?: string | null
  /** `replaced` is the binding the new shortcut was taken from after "Use anyway", so the caller can unbind it. */
  onValueChange?: (value: string | null, details: { replaced?: ShortcutBinding }) => void
  /** What the reset button restores. Falls back to `defaultValue`. */
  resetValue?: string | null
  /** Shortcuts already in use. Recording one of them asks before taking it. @default [] */
  bindings?: ShortcutBinding[]
  /** Also warn about combinations the browser or system keeps, such as ⌘W and ⌘C. @default true */
  warnReserved?: boolean
  /** Require ⌘, Ctrl or ⌥; function keys are always allowed. @default true */
  requireModifier?: boolean
  /** Overrides the detected platform. */
  platform?: Platform
  /** @default 'Record shortcut' */
  placeholder?: string
  /** A hint under the field. */
  description?: string
  /** @default false */
  disabled?: boolean
  /** Id of the recorder button. */
  id?: string
  className?: string
}

export type ShortcutListItem = {
  label: string
  shortcut: string
  /** Extra words that match when searching. */
  keywords?: string
}

export type ShortcutListGroup = { label: string; items: ShortcutListItem[] }

/**
 * A searchable, grouped cheatsheet. Holding a modifier lights that cap in every row and fades
 * rows that do not use it; a row whose whole combination is down lights up. Search matches
 * names, groups and key names such as "cmd k".
 */
export type ShortcutListProps = {
  groups: ShortcutListGroup[]
  /** Accessible name of the list. @default 'Keyboard shortcuts' */
  label?: string
  /** @default true */
  searchable?: boolean
  /** @default 'Search shortcuts' */
  searchPlaceholder?: string
  /** Light up caps as keys are held and fade rows that miss the held modifiers. @default true */
  highlightPressed?: boolean
  /** Overrides the detected platform. */
  platform?: Platform
  className?: string
}

/** A recorded shortcut waiting on "Use anyway" because something else has it. */
export type PendingShortcut = {
  shortcut: string
  conflict: ShortcutBinding
  /** True when the browser or system keeps it, rather than one of `bindings`. */
  reserved: boolean
}
