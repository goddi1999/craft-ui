import type { Transition, Variants } from 'motion/react'

import type { CommentThreadLabels } from './comment-thread.types'

type Bezier = [number, number, number, number]

// uiarc motion tokens, inlined so the folder copies on its own
export const EASE_ENTER: Bezier = [0.16, 1, 0.3, 1]
export const EASE_STANDARD: Bezier = [0.22, 1, 0.36, 1]
export const DURATION = { instant: 0.12, fast: 0.16, standard: 0.24 } as const
// presses, toggles and small indicators; settles fast and never overshoots
export const SPRING_SNAPPY = { type: 'spring', visualDuration: 0.26, bounce: 0 } as const
export const BLUR_SUBTLE = 2
export const STAGGER_ITEM = 0.035
export const INSTANT = { duration: 0 } as const

// a spring from how long it should look and how much it bounces
function physicalSpring(visualDuration: number, bounce: number): Transition {
  const root = (2 * Math.PI) / (visualDuration * 1.2)
  return { type: 'spring', stiffness: root * root, damping: 2 * (1 - bounce) * root, mass: 1 }
}

// every height change: replies opening, comments arriving, the thread folding into its chip
export const HEIGHT_SPRING = physicalSpring(0.42, 0)

// the css side of the corner morph when the thread resolves: uiarc's --ease-spring over 580ms
export const SPRING_EASE =
  'linear(0, 0.0213, 0.0739, 0.1443, 0.2235, 0.305, 0.3849, 0.4606, 0.5305, 0.594, 0.6508, 0.7011, 0.7452, 0.7836, 0.8168, 0.8454, 0.8699, 0.8907, 0.9084, 0.9234, 0.9361, 0.9467, 0.9557, 0.9632, 0.9694, 0.9747, 0.979, 0.9826, 0.9857, 0.9882, 0.9902, 0.992, 0.9934, 0.9946, 0.9955, 0.9963, 1)'

export const DEFAULT_REACTIONS = ['👍', '❤️', '🎉', '👀', '🚀', '✅']
export const DEFAULT_PLACEHOLDER = 'Reply, or @mention someone'
export const DEFAULT_NOW = 'Just now'
// how many people the @mention list offers at once
export const MAX_SUGGESTIONS = 5

export const DEFAULT_LABELS: Required<CommentThreadLabels> = {
  thread: 'Comment thread',
  commentCount: (count) => `${count} ${count === 1 ? 'comment' : 'comments'}`,
  peopleCount: (count) => `${count} ${count === 1 ? 'person' : 'people'}`,
  resolve: 'Resolve',
  resolved: 'Resolved',
  reopen: 'Reopen',
  empty: 'No comments yet. Start the conversation below.',
  reply: 'Reply',
  edit: 'Edit',
  delete: 'Delete',
  cancel: 'Cancel',
  send: 'Send',
  save: 'Save',
  editComment: 'Edit comment',
  edited: 'edited',
  deleteConfirm: 'Delete this comment?',
  deletedText: 'This comment was deleted',
  deletedComment: 'Deleted comment',
  replyingTo: (name) => `Replying to ${name}`,
  cancelReply: 'Cancel reply',
  showReplies: (count) => `Show ${count} ${count === 1 ? 'reply' : 'replies'}`,
  hideReplies: 'Hide replies',
  addReaction: 'Add reaction',
  closeReactions: 'Close reactions',
  reactions: 'Reactions',
  reactWith: (emoji) => `React with ${emoji}`,
  reactionCount: (emoji, count, includesYou) =>
    `${emoji} ${count}${includesYou ? ', including you' : ''}`,
  mentions: 'People',
}

// a count rolls up or down in place, the way it moved
export const ROLL: Variants = {
  hidden: (direction: number) => ({ y: `${direction * 70}%`, opacity: 0 }),
  shown: { y: '0%', opacity: 1 },
  gone: (direction: number) => ({ y: `${direction * -70}%`, opacity: 0 }),
}
export const ROLL_REDUCED: Variants = {
  hidden: { opacity: 0 },
  shown: { opacity: 1 },
  gone: { opacity: 0 },
}

const FOCUS = 'outline-none focus-visible:ring-2 focus-visible:ring-ring'

export const AVATAR =
  'inline-grid flex-none place-items-center overflow-hidden rounded-full bg-muted object-cover text-xs font-medium tracking-normal text-muted-foreground'

// avatars in a small overlapping stack, each cut out of the one before it
export const STACK = 'inline-flex flex-none pl-1 [&>*]:-ml-[5px] [&>*]:ring-2 [&>*]:ring-card'

export const PILL_BUTTON = `inline-flex h-8 flex-none cursor-pointer items-center gap-1.5 rounded-full border border-border bg-card pr-3 pl-2.5 text-xs font-medium text-foreground [transition:background-color_160ms_cubic-bezier(.22,1,.36,1),border-color_160ms_cubic-bezier(.22,1,.36,1),scale_120ms_cubic-bezier(.22,1,.36,1)] enabled:active:scale-[.97] disabled:cursor-default disabled:opacity-45 pointer-fine:enabled:hover:border-foreground/25 pointer-fine:enabled:hover:bg-muted motion-reduce:transition-none ${FOCUS}`

// quiet text and icon buttons; keyboard focus fills them like hover does
export const ACTION = `inline-flex h-7 cursor-pointer items-center justify-center rounded-full px-2 text-xs font-medium text-muted-foreground transition-[background-color,color] duration-160 ease-[cubic-bezier(.22,1,.36,1)] [-webkit-tap-highlight-color:transparent] focus-visible:bg-muted focus-visible:text-foreground pointer-fine:hover:bg-muted pointer-fine:hover:text-foreground motion-reduce:transition-none ${FOCUS}`
export const ICON_ACTION = 'w-7 px-0'
export const DANGER =
  'text-destructive focus-visible:text-destructive pointer-fine:hover:bg-destructive/9 pointer-fine:hover:text-destructive'

export const REACTION = `inline-flex h-[26px] cursor-pointer items-center gap-[5px] rounded-full border border-border bg-card pr-[9px] pl-[7px] text-xs font-medium text-muted-foreground transition-[background-color,border-color,color] duration-160 ease-[cubic-bezier(.22,1,.36,1)] active:scale-[.94] aria-pressed:border-[color-mix(in_oklab,var(--primary)_45%,var(--border))] aria-pressed:bg-primary/10 aria-pressed:text-foreground pointer-fine:hover:border-foreground/25 motion-reduce:transition-none ${FOCUS}`

export const EMOJI = `grid size-7 cursor-pointer place-items-center rounded-full text-base leading-none [transition:background-color_160ms_cubic-bezier(.22,1,.36,1),scale_120ms_cubic-bezier(.22,1,.36,1)] active:scale-[.88] aria-pressed:bg-primary/10 focus-visible:bg-muted pointer-fine:hover:bg-muted motion-reduce:transition-none ${FOCUS}`

export const ACTIONS = 'flex min-h-7 flex-wrap items-center gap-0.5'

// on a mouse the row sits quietly after the reactions and comes forward on hover or focus;
// touch screens always show it
export const ACTIONS_REVEAL =
  'transition-opacity duration-160 ease-[cubic-bezier(.22,1,.36,1)] pointer-fine:opacity-0 pointer-fine:group-focus-within/comment:opacity-100 pointer-fine:group-hover/comment:opacity-100 motion-reduce:transition-none'

export const TOGGLE = `-ml-1.5 mt-0.5 inline-flex h-7 w-fit cursor-pointer items-center gap-1.5 rounded-full pr-2 pl-1.5 text-xs font-medium text-muted-foreground transition-[background-color,color] duration-160 ease-[cubic-bezier(.22,1,.36,1)] focus-visible:bg-muted focus-visible:text-foreground pointer-fine:hover:bg-muted pointer-fine:hover:text-foreground motion-reduce:transition-none ${FOCUS}`

export const FIELD =
  'max-h-40 min-h-[38px] w-full resize-none rounded-[14px] border border-border bg-card px-3 py-2 text-foreground outline-none field-sizing-content transition-[border-color] duration-160 ease-[cubic-bezier(.22,1,.36,1)] placeholder:text-muted-foreground focus:border-foreground/25 motion-reduce:transition-none'

const COMPOSER_BUTTON = `h-[38px] cursor-pointer rounded-full px-3.5 font-medium [transition:background-color_160ms_cubic-bezier(.22,1,.36,1),opacity_160ms_cubic-bezier(.22,1,.36,1),scale_120ms_cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none ${FOCUS}`
export const SEND = `${COMPOSER_BUTTON} bg-foreground text-background enabled:active:scale-[.97] disabled:cursor-default disabled:opacity-35 pointer-fine:enabled:hover:bg-[color-mix(in_oklab,var(--foreground)_86%,var(--background))]`
export const GHOST = `${COMPOSER_BUTTON} text-muted-foreground active:scale-[.97] pointer-fine:hover:bg-muted pointer-fine:hover:text-foreground`
export const COMPACT_BUTTON = 'h-8 text-xs'
