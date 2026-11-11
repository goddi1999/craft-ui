import type { ComponentProps } from 'react'

/** Name → image file map, joined onto `baseUrl` (same shape as `react-apple-emojis`). */
export type EmojiData = {
  baseUrl: string
  emojis: Record<string, string>
}

export type EmojiReactionSize = 'sm' | 'md' | 'lg'

/** Which edge of the bar lines up with the trigger. */
export type EmojiReactionAlign = 'left' | 'center' | 'right'

export type EmojiReactionProps = ComponentProps<'div'> & {
  /** Emoji names shown in the bar; anything past the defaults needs `emojiData`. */
  emojis?: string[]
  /** Name → image map. @default the five bundled faces */
  emojiData?: EmojiData
  /** Called with the emoji name on every pick, including each repeat while held. */
  onReact?: (name: string) => void
  /** @default 'md' */
  size?: EmojiReactionSize
  /** @default 'center' */
  align?: EmojiReactionAlign
  /** Use your own child as the trigger. @default false */
  asChild?: boolean
  /** Start with the bar open, without moving focus into it. @default false */
  defaultOpen?: boolean
}

export type Placement = { side: 'top' | 'bottom'; shift: number; tailX: number }

export type Particle = {
  id: number
  name: string
  originX: number
  originY: number
  x: number
  drift: number
  tilt: number
  travel: number
  scale: number
  blurRatio: number
  fadeAt: number
  duration: number
  delay: number
}
