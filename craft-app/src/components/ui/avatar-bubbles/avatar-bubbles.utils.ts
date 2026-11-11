import type { AvatarBubble, AvatarBubbleSlot, AvatarBubbleTone } from './avatar-bubbles.types'

/** Pastel tint per tone: a CSS variable with light and dark values. */
export const TONE_CLASS: Record<AvatarBubbleTone, string> = {
  coral: '[--bubble:#e8918a] dark:[--bubble:#7a3f3b]',
  pink: '[--bubble:#e599b4] dark:[--bubble:#7a3f55]',
  lilac: '[--bubble:#c5b4dc] dark:[--bubble:#4f4468]',
  periwinkle: '[--bubble:#bfbfdd] dark:[--bubble:#4a4a6e]',
  mint: '[--bubble:#a9d9c4] dark:[--bubble:#2f5a4a]',
  sand: '[--bubble:#ecd2a2] dark:[--bubble:#6b5632]',
}

/** Loose cluster after the reference: big circles bleeding off the left and right edges. */
export const DEFAULT_LAYOUT: AvatarBubbleSlot[] = [
  { tone: 'coral', x: -6, y: -4, size: 36 },
  { tone: 'pink', x: 34, y: 19, size: 18 },
  { tone: 'lilac', x: 49, y: -3, size: 24 },
  { tone: 'periwinkle', x: 54, y: 37, size: 13 },
  { tone: 'periwinkle', x: 71, y: 9, size: 35 },
  { tone: 'mint', x: 20, y: 2, size: 12 },
]

/** Pairs avatars with layout slots (first 5 slots by default). */
export function layoutBubbles(
  avatars: { id?: string; src: string; name: string }[],
  layout: AvatarBubbleSlot[] = DEFAULT_LAYOUT.slice(0, 5),
): AvatarBubble[] {
  return layout.slice(0, avatars.length).map((slot, index) => {
    const avatar = avatars[index]
    return { ...slot, id: avatar.id ?? `${index}-${avatar.name}`, src: avatar.src, name: avatar.name }
  })
}

/** Pushes slots away from the card centre; `amount` 0 leaves them as is. */
export function withBleed(layout: AvatarBubbleSlot[], amount: number): AvatarBubbleSlot[] {
  return layout.map((slot) => ({
    ...slot,
    x: slot.x + (slot.x + slot.size / 2 - 50) * amount,
    y: slot.y + (slot.y + (slot.size * 3) / 4 - 40) * amount,
  }))
}
