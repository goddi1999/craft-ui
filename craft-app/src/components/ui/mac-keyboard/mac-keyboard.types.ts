import type { LucideIcon } from 'lucide-react'

export type KeySize = '1u' | '1.25u' | '1.5u' | '1.75u' | '2u' | '2.25u' | '2.75u' | '6.25u'

export type CornerPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'none'

/** Where a word label (tab, shift, return) sits on a wide key. */
export type LabelAlign = 'bottom-left' | 'bottom-right'

export type KeyDef = {
  id: string
  kind?: undefined
  size?: KeySize
  corner?: CornerPosition
  /** Main glyph, e.g. "Q" or "1". */
  label?: string
  /** Shifted glyph shown above the label, e.g. "!". */
  symbol?: string
  /** Small caption under an icon, e.g. "F1" or "command". */
  secondaryLabel?: string
  /** Word label pinned to a corner, e.g. "tab". */
  word?: string
  wordAlign?: LabelAlign
  icons?: LucideIcon[]
  iconSize?: number
  iconClassName?: string
  /** Caps-lock indicator dot. */
  indicator?: boolean
}

export type SpecialKeyDef = { id: string; kind: 'touch-id' | 'space' | 'arrows' }

export type KeyboardKey = KeyDef | SpecialKeyDef

export type MacKeyboardProps = {
  className?: string
}
