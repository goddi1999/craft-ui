import type { ComponentProps } from 'react'

export type StreamingReplyTurn = {
  /** The user's message. */
  question: string
  /** The reply, streamed in a word at a time. */
  answer: string
}

export type StreamingReplyProps = Omit<ComponentProps<'div'>, 'children'> & {
  /** Played one after another; the thread clears between them. Renders nothing when empty. */
  turns: readonly StreamingReplyTurn[]
  /** Start over after the last turn. Off, the last turn stays on screen. @default true */
  loop?: boolean
  /** Shimmering label in the reply bubble before the answer starts. @default 'Thinking' */
  thinkingLabel?: string
}
