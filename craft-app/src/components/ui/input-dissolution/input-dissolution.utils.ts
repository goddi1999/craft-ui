import { ACCENT_TOKENS } from './input-dissolution.constants'
import type { InputDissolutionAccent } from './input-dissolution.types'

const isAccentToken = (value: string): value is InputDissolutionAccent =>
  (ACCENT_TOKENS as readonly string[]).includes(value)

/** A token name becomes its theme colour; anything else is already a CSS colour. */
export const resolveAccent = (accent: string) =>
  isAccentToken(accent) ? `oklch(var(--oklch-${accent}))` : accent
