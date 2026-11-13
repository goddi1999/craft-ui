import type { ComponentProps, ReactNode } from 'react'

export type Quote = {
  id: string
  text: string
  author: string
  /** Shown under the name, e.g. `Head of Design @Acme`. */
  role?: string
  /** Image URL, or any node (an emoji, an icon). Falls back to the author's initials. */
  avatar?: string | ReactNode
}

export type QuoteWallProps = Omit<ComponentProps<'p'>, 'children'> & {
  quotes: Quote[]
  /** Tint every other quote so neighbours read apart at rest. @default true */
  alternate?: boolean
  /** Colour of the author's name. @default an orange accent */
  accentClassName?: string
}
