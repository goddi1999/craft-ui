import { CornerDownLeft } from 'lucide-react'
import type { ReactNode } from 'react'

export type EchoKey = { id: number; label: ReactNode }

/** Turns a keydown into the keycap the echo shows, or null for keys it ignores. */
export function keyLabel(event: { key: string; metaKey: boolean; ctrlKey: boolean; altKey: boolean }) {
  const mod = event.metaKey ? '⌘' : event.ctrlKey ? '⌃' : event.altKey ? '⌥' : ''
  if (event.key === 'Enter') return <CornerDownLeft className="size-5" strokeWidth={2.4} aria-hidden />
  if (event.key === 'Escape') return 'esc'
  if (!mod) return null
  const arrows: Record<string, string> = {
    ArrowLeft: '←',
    ArrowRight: '→',
    Backspace: '⌫',
  }
  if (arrows[event.key]) return `${mod}${arrows[event.key]}`
  if (event.key.length === 1) return `${mod}${event.key.toUpperCase()}`
  return null
}
