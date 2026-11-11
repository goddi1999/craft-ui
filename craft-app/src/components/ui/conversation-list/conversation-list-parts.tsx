// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import {
  Archive,
  Ellipsis,
  Pencil,
  Pin,
  PinOff,
  Search,
  Trash2,
  X,
} from 'lucide-react'
import { useState } from 'react'

import { cn } from '@/lib/utils'

import { Button } from '../button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../dropdown-menu'
import type { Conversation } from './conversation-list.types'

type SearchBoxProps = {
  value: string
  onChange: (value: string) => void
}

/** Search field with a leading icon and a clear button once there is text. */
export function ConversationSearch({ value, onChange }: SearchBoxProps) {
  return (
    <div data-slot="conversation-search" className="relative">
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground"
      />
      <input
        type="search"
        aria-label="Search chats"
        placeholder="Search chats"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-full rounded-xl bg-card pr-8 pl-8 text-[0.8125rem] outline-none transition-shadow duration-150 ease-out placeholder:text-muted-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onChange('')}
          className="absolute top-1/2 right-1.5 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-[background-color,scale] duration-150 ease-out hover:bg-foreground/[0.06] active:scale-[0.95]"
        >
          <X aria-hidden="true" className="size-3.5" />
        </button>
      )}
    </div>
  )
}

type RenameFieldProps = {
  initial: string
  onDone: (title: string | null) => void
}

/** Inline title editor: Enter or blur saves, Escape cancels. */
export function RenameField({ initial, onDone }: RenameFieldProps) {
  const [value, setValue] = useState(initial)
  return (
    <input
      aria-label="Chat title"
      autoFocus
      value={value}
      onFocus={(e) => e.target.select()}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => onDone(value.trim())}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onDone(value.trim())
        if (e.key === 'Escape') onDone(null)
      }}
      className="h-9 w-full rounded-xl bg-foreground/[0.06] px-2.5 text-[0.8125rem] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
    />
  )
}

type RowMenuProps = {
  conversation: Conversation
  open: boolean
  onOpenChange: (open: boolean) => void
  onPin?: () => void
  onRename?: () => void
  onArchive?: () => void
  onDelete?: () => void
}

/** Per-row action menu; only the actions whose handlers are set appear. */
export function RowMenu({
  conversation,
  open,
  onOpenChange,
  onPin,
  onRename,
  onArchive,
  onDelete,
}: RowMenuProps) {
  const hasMain = !!(onPin || onRename || onArchive)
  if (!hasMain && !onDelete) return null

  return (
    <div className="absolute top-1/2 right-1 -translate-y-1/2">
      <DropdownMenu open={open} onOpenChange={onOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label={`Actions for ${conversation.title}`}
            className={cn(
              'rounded-lg opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100',
              open && 'opacity-100',
            )}
          >
            <Ellipsis strokeWidth={2.5} aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-36">
          {hasMain && (
            <DropdownMenuGroup>
              {onPin && (
                <DropdownMenuItem onSelect={onPin}>
                  {conversation.pinned ? <PinOff /> : <Pin />}
                  {conversation.pinned ? 'Unpin' : 'Pin'}
                </DropdownMenuItem>
              )}
              {onRename && (
                <DropdownMenuItem onSelect={onRename}>
                  <Pencil />
                  Rename
                </DropdownMenuItem>
              )}
              {onArchive && (
                <DropdownMenuItem onSelect={onArchive}>
                  <Archive />
                  Archive
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
          )}
          {hasMain && onDelete && <DropdownMenuSeparator />}
          {onDelete && (
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive" onSelect={onDelete}>
                <Trash2 />
                Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
