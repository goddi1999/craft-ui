import type { ReactNode, Ref } from 'react'

export type CommentAuthor = {
  id: string
  name: string
  /** Square image URL. Initials are shown without one. */
  avatar?: string
}

export type CommentReaction = {
  emoji: string
  /** Ids of the people who reacted. */
  users: string[]
}

export type ThreadComment = {
  id: string
  author: CommentAuthor
  /** Plain text. "@Full Name" mentions of known people are highlighted. */
  body: string
  /** Display label such as "2h" or "Sep 18". */
  createdAt: string
  edited?: boolean
  /** A deleted comment that still has replies keeps its place as a quiet placeholder. */
  deleted?: boolean
  reactions?: CommentReaction[]
  replies?: ThreadComment[]
}

/** What changed, for syncing to a server. The tree passed with it is always the full next tree. */
export type CommentThreadEvent =
  | { type: 'reply'; comment: ThreadComment; parentId: string | null }
  | { type: 'edit'; id: string; body: string }
  | { type: 'delete'; id: string }
  | { type: 'react'; id: string; emoji: string; added: boolean }

/**
 * Every word the thread shows or announces. Each has an English default; words with a count or a
 * name are functions, so an app can apply its own plural rules.
 */
export type CommentThreadLabels = {
  /** Accessible name of the whole thread. @default 'Comment thread' */
  thread?: string
  /** Header and resolved chip, such as "3 comments". */
  commentCount?: (count: number) => string
  /** Resolved chip, such as "2 people". */
  peopleCount?: (count: number) => string
  /** @default 'Resolve' */
  resolve?: string
  /** Title of the resolved chip. @default 'Resolved' */
  resolved?: string
  /** @default 'Reopen' */
  reopen?: string
  /** Shown when there are no comments. @default 'No comments yet. Start the conversation below.' */
  empty?: string
  /** @default 'Reply' */
  reply?: string
  /** @default 'Edit' */
  edit?: string
  /** @default 'Delete' */
  delete?: string
  /** @default 'Cancel' */
  cancel?: string
  /** @default 'Send' */
  send?: string
  /** Saves an edit. @default 'Save' */
  save?: string
  /** Placeholder and accessible name of the edit field. @default 'Edit comment' */
  editComment?: string
  /** After the time of an edited comment. @default 'edited' */
  edited?: string
  /** @default 'Delete this comment?' */
  deleteConfirm?: string
  /** Text of a deleted comment that still has replies. @default 'This comment was deleted' */
  deletedText?: string
  /** Accessible name of that placeholder. @default 'Deleted comment' */
  deletedComment?: string
  /** Above the composer while replying. The name inside it is highlighted. */
  replyingTo?: (name: string) => string
  /** @default 'Cancel reply' */
  cancelReply?: string
  showReplies?: (count: number) => string
  /** @default 'Hide replies' */
  hideReplies?: string
  /** @default 'Add reaction' */
  addReaction?: string
  /** @default 'Close reactions' */
  closeReactions?: string
  /** Accessible name of the reaction picker. @default 'Reactions' */
  reactions?: string
  /** Accessible name of an emoji in the picker. */
  reactWith?: (emoji: string) => string
  /** Accessible name of a reaction under a comment. */
  reactionCount?: (emoji: string, count: number, includesYou: boolean) => string
  /** Accessible name of the @mention suggestions. @default 'People' */
  mentions?: string
}

/**
 * A threaded discussion: replies nest under their comment and collapse, reactions toggle with a
 * count that rolls, authors edit and delete their own comments in place, mentions autocomplete in
 * the composer, and resolving folds the whole thread into a chip that reopens it. Controlled with
 * `comments` and `resolved`, or uncontrolled.
 */
export type CommentThreadProps = {
  /** The comment tree, when controlled. */
  comments?: ThreadComment[]
  /** The starting tree, when uncontrolled. @default [] */
  defaultComments?: ThreadComment[]
  /** Called with the full next tree and what changed: reply, edit, delete or react. */
  onCommentsChange?: (comments: ThreadComment[], event: CommentThreadEvent) => void
  /** The person writing. Their comments can be edited and deleted. */
  currentUser: CommentAuthor
  /** People who can be mentioned. Defaults to everyone in the thread. */
  people?: CommentAuthor[]
  /** Resolved state, when controlled. */
  resolved?: boolean
  /** The starting resolved state, when uncontrolled. @default false */
  defaultResolved?: boolean
  /** Called on Resolve and Reopen. */
  onResolvedChange?: (resolved: boolean) => void
  /** What the thread is about, shown in its header, such as "Hero headline". */
  title?: ReactNode
  /** Emoji offered by the reaction picker. @default ['👍', '❤️', '🎉', '👀', '🚀', '✅'] */
  reactions?: string[]
  /** Composer placeholder. @default 'Reply, or @mention someone' */
  placeholder?: string
  /** Replies deeper than this attach to the deepest allowed parent. @default 2 */
  maxDepth?: number
  /** `createdAt` label for comments written now. @default 'Just now' */
  nowLabel?: string
  /** Words for localization. Leave out any key to keep its English default. */
  labels?: CommentThreadLabels
  /** The section element. */
  ref?: Ref<HTMLElement>
  className?: string
}

/** Which comment has its editor, delete prompt or reaction picker open, and which replies are folded. */
export type ThreadUi = {
  editing: string | null
  confirming: string | null
  picker: string | null
  collapsed: Record<string, boolean>
}

/** An @mention being typed: where its @ sits and the letters after it. */
export type MentionQuery = { start: number; term: string }
