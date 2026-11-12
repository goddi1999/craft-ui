export { ShortcutRecorder } from './ShortcutRecorder'
export { ShortcutKbd, ShortcutKeys, ShortcutList } from './shortcut-recorder-parts'
export type {
  Platform,
  ShortcutBinding,
  ShortcutKbdProps,
  ShortcutKeysProps,
  ShortcutListGroup,
  ShortcutListItem,
  ShortcutListProps,
  ShortcutRecorderProps,
  ShortcutToken,
} from './shortcut-recorder.types'
export {
  formatShortcut,
  keyId,
  matchesShortcut,
  normalizeShortcut,
  shortcutFromEvent,
  shortcutTokens,
} from './shortcut-recorder.utils'
export { usePlatform } from './use-platform'
export { usePressedKeys } from './use-pressed-keys'
