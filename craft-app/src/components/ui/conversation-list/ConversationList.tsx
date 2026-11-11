// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { MessagesSquare, Search, SquarePen, Undo2 } from 'lucide-react'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

import { Button } from '../button'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '../empty'
import { Spinner } from '../spinner'
import { Panel, Shell, ShellHeader } from '../surface'
import { enter, exit, GROUP_ORDER } from './conversation-list.constants'
import {
  ConversationSearch,
  RenameField,
  RowMenu,
} from './conversation-list-parts'
import type {
  Conversation,
  ConversationListProps,
  Removal,
} from './conversation-list.types'
import { groupOf, useHydrated } from './conversation-list.utils'

/**
 * A chat sidebar: date-grouped rows with search, inline rename, pin, and
 * archive or delete that stay undoable until `undoMs` runs out. Arrow keys,
 * Home and End move between rows.
 */
export function ConversationList({
  data,
  activeId,
  onSelect,
  onNew,
  onRename,
  onPin,
  onArchive,
  onDelete,
  undoMs = 5000,
  variant = 'sidebar',
  headerAction,
  now,
  className,
}: ConversationListProps) {
  const compact = variant === 'compact'
  const [query, setQuery] = useState('')
  const [renaming, setRenaming] = useState<string | null>(null)
  const [menu, setMenu] = useState<string | null>(null)
  const [removed, setRemoved] = useState<Removal | null>(null)
  const list = useRef<HTMLDivElement>(null)

  // Commit a removal once its undo window closes.
  useEffect(() => {
    if (!removed) return
    const timer = setTimeout(() => {
      ;(removed.action === 'archive' ? onArchive : onDelete)?.(removed.conversation)
      setRemoved(null)
    }, undoMs)
    return () => clearTimeout(timer)
  }, [removed, undoMs, onArchive, onDelete])

  const remove = (conversation: Conversation, action: Removal['action']) => {
    // A pending removal commits right away when another one starts.
    if (removed)
      (removed.action === 'archive' ? onArchive : onDelete)?.(removed.conversation)
    setRemoved({ conversation, action })
    setMenu(null)
  }

  const hydrated = useHydrated()
  const ref = now ? new Date(now) : new Date()
  const visible = data
    .filter((c) => c.id !== removed?.conversation.id)
    .filter((c) => !query || c.title.toLowerCase().includes(query.toLowerCase()))
  const groups = compact
    ? [{ name: '', items: visible }]
    : GROUP_ORDER.map((name) => ({
        name,
        items: visible.filter(
          (c) => (hydrated || c.pinned ? groupOf(c, ref) : 'Recent') === name,
        ),
      })).filter((g) => g.items.length)

  // Arrow keys move between rows; Enter opens the focused one (native button).
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return
    const rows = Array.from(list.current?.querySelectorAll<HTMLElement>('[data-row]') ?? [])
    const i = rows.indexOf(document.activeElement as HTMLElement)
    const next =
      e.key === 'Home'
        ? 0
        : e.key === 'End'
          ? rows.length - 1
          : i + (e.key === 'ArrowDown' ? 1 : -1)
    if (rows[next]) {
      e.preventDefault()
      rows[next].focus()
    }
  }

  const removedLabel = removed?.action === 'archive' ? 'Archived' : 'Deleted'

  return (
    <MotionConfig reducedMotion="user">
      <Shell
        data-slot="conversation-list"
        className={cn('w-full', compact ? 'max-w-60' : 'max-w-72', className)}
      >
        <ShellHeader
          icon={MessagesSquare}
          title="Chats"
          aside={
            (onNew || headerAction) && (
              <span className="flex items-center gap-1">
                {headerAction}
                {onNew && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon-sm"
                    aria-label="New chat"
                    onClick={onNew}
                    className="rounded-lg"
                  >
                    <SquarePen aria-hidden="true" />
                  </Button>
                )}
              </span>
            )
          }
        />
        {!compact && (
          <div className="px-1.5 pb-2.5">
            <ConversationSearch value={query} onChange={setQuery} />
          </div>
        )}
        <Panel ref={list} onKeyDown={onKeyDown} className="flex flex-col gap-3 p-1.5">
          {groups.length === 0 && (
            <Empty className="gap-3 p-4 md:p-4">
              <EmptyHeader className="gap-1">
                <EmptyMedia variant="icon">
                  {query ? <Search /> : <MessagesSquare />}
                </EmptyMedia>
                <EmptyTitle className="text-[0.8125rem] font-medium">
                  {query ? 'No chats found' : 'No chats yet'}
                </EmptyTitle>
                {query && (
                  <EmptyDescription className="text-xs">
                    Try a different search.
                  </EmptyDescription>
                )}
              </EmptyHeader>
            </Empty>
          )}
          {groups.map((group) => (
            <section key={group.name || 'all'} aria-label={group.name || 'Chats'}>
              {group.name && (
                <h4 className="px-2.5 pt-1 pb-1 text-xs font-medium text-muted-foreground">
                  {group.name}
                </h4>
              )}
              <ul className="flex flex-col gap-px">
                <AnimatePresence initial={false}>
                  {group.items.map((c) => (
                    <motion.li
                      key={c.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto', transition: enter }}
                      exit={{ opacity: 0, height: 0, transition: exit }}
                      className="group relative"
                    >
                      {renaming === c.id ? (
                        <RenameField
                          initial={c.title}
                          onDone={(title) => {
                            setRenaming(null)
                            if (title && title !== c.title) onRename?.(c, title)
                          }}
                        />
                      ) : (
                        <button
                          type="button"
                          data-row
                          aria-current={c.id === activeId ? 'page' : undefined}
                          onClick={() => onSelect?.(c)}
                          className={cn(
                            'flex h-9 w-full items-center gap-2 rounded-xl pr-9 pl-2.5 text-left text-[0.8125rem] transition-[background-color,scale] duration-150 ease-out outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 active:scale-[0.99]',
                            c.id === activeId
                              ? 'bg-foreground/[0.07] font-medium'
                              : 'text-foreground/80 hover:bg-foreground/[0.04]',
                          )}
                        >
                          <span className="min-w-0 flex-1 truncate">{c.title}</span>
                          {c.running && (
                            <>
                              <Spinner size="xs" aria-hidden="true" role="presentation" />
                              <span className="sr-only">Agent working</span>
                            </>
                          )}
                        </button>
                      )}
                      {renaming !== c.id && (
                        <RowMenu
                          conversation={c}
                          open={menu === c.id}
                          onOpenChange={(open) => setMenu(open ? c.id : null)}
                          onPin={onPin && (() => (onPin(c, !c.pinned), setMenu(null)))}
                          onRename={
                            onRename && (() => (setRenaming(c.id), setMenu(null)))
                          }
                          onArchive={onArchive && (() => remove(c, 'archive'))}
                          onDelete={onDelete && (() => remove(c, 'delete'))}
                        />
                      )}
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </section>
          ))}
        </Panel>
        <AnimatePresence>
          {removed && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0, transition: enter }}
              exit={{ opacity: 0, transition: exit }}
              className="flex items-center gap-2 px-3 pt-2.5 pb-1.5 text-[0.8125rem]"
            >
              <span className="min-w-0 flex-1 truncate text-muted-foreground">
                {removedLabel} “{removed.conversation.title}”
              </span>
              <button
                type="button"
                onClick={() => setRemoved(null)}
                className="flex h-7 shrink-0 items-center gap-1 rounded-full bg-card px-2.5 font-medium transition-[background-color,scale] duration-150 ease-out outline-none hover:bg-foreground/[0.07] focus-visible:ring-[3px] focus-visible:ring-ring/50 active:scale-[0.97]"
              >
                <Undo2 strokeWidth={2.5} className="size-3.5" aria-hidden="true" />
                Undo
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <p role="status" aria-live="polite" className="sr-only">
          {removed ? `${removedLabel} ${removed.conversation.title}. Undo available.` : ''}
        </p>
      </Shell>
    </MotionConfig>
  )
}
