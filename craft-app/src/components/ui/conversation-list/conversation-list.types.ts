// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
type Conversation = {
  id: string
  title: string
  /** ISO timestamp of the last message; drives the date groups. */
  updatedAt: string
  pinned?: boolean
  /** The agent is still working in this chat. */
  running?: boolean
}

type ConversationListVariant = 'sidebar' | 'compact'

type ConversationListProps = {
  data: Conversation[]
  activeId?: string
  onSelect?: (conversation: Conversation) => void
  onNew?: () => void
  onRename?: (conversation: Conversation, title: string) => void
  onPin?: (conversation: Conversation, pinned: boolean) => void
  /** Called once the undo window closes. */
  onArchive?: (conversation: Conversation) => void
  onDelete?: (conversation: Conversation) => void
  undoMs?: number
  /** `compact` lists titles only, without search or group labels. */
  variant?: ConversationListVariant
  /** Reference time for the date groups (ISO). Defaults to now. */
  now?: string
  /** Extra control in the header next to New chat, e.g. a hide-sidebar toggle. */
  headerAction?: React.ReactNode
  className?: string
}

type Removal = { conversation: Conversation; action: 'archive' | 'delete' }

export type { Conversation, ConversationListProps, ConversationListVariant, Removal }
