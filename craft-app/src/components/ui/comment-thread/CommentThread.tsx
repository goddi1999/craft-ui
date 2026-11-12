import { Check, ChevronRight, CornerDownRight, RotateCcw, SmilePlus, X } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from 'react'

import { cn } from '@/lib/utils'

import {
  ACTION,
  ACTIONS,
  ACTIONS_REVEAL,
  DANGER,
  DEFAULT_LABELS,
  DEFAULT_NOW,
  DEFAULT_PLACEHOLDER,
  DEFAULT_REACTIONS,
  DURATION,
  EASE_STANDARD,
  EMOJI,
  ICON_ACTION,
  INSTANT,
  PILL_BUTTON,
  REACTION,
  SPRING_EASE,
  SPRING_SNAPPY,
  STACK,
  STAGGER_ITEM,
  TOGGLE,
} from './comment-thread.constants'
import type {
  CommentThreadEvent,
  CommentThreadProps,
  ThreadComment,
  ThreadUi,
} from './comment-thread.types'
import {
  authorsOf,
  countTree,
  face,
  findComment,
  grow,
  mapTree,
  newId,
  pathTo,
  removeFromTree,
  slide,
  swap,
  withDefaults,
} from './comment-thread.utils'
import {
  AutoHeight,
  CommentAvatar,
  CommentBody,
  Composer,
  Highlighted,
  RollingCount,
} from './comment-thread-parts'

const subscribe = () => () => {}
/** False on the server and during hydration, so reduced motion never changes the first client render. */
const useHydrated = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )

/**
 * A threaded discussion: replies nest under their comment and collapse, reactions toggle with a
 * count that rolls, authors edit and delete their own comments in place, mentions autocomplete in
 * the composer, and resolving folds the whole thread into a chip that reopens it. Adapted from uiarc.
 */
export function CommentThread({
  comments,
  defaultComments = [],
  onCommentsChange,
  currentUser,
  people,
  resolved,
  defaultResolved = false,
  onResolvedChange,
  title,
  reactions = DEFAULT_REACTIONS,
  placeholder = DEFAULT_PLACEHOLDER,
  maxDepth = 2,
  nowLabel = DEFAULT_NOW,
  labels,
  ref,
  className,
}: CommentThreadProps) {
  const t = withDefaults(DEFAULT_LABELS, labels)
  const hydrated = useHydrated()
  const prefersReduced = useReducedMotion()
  const reduced = hydrated && !!prefersReduced
  const rootRef = useRef<HTMLElement>(null)
  useImperativeHandle(ref, () => rootRef.current as HTMLElement)

  const [internal, setInternal] = useState(defaultComments)
  const list = comments ?? internal
  const [internalResolved, setInternalResolved] = useState(defaultResolved)
  const isResolved = resolved ?? internalResolved
  const [ui, setUi] = useState<ThreadUi>({
    editing: null,
    confirming: null,
    picker: null,
    collapsed: {},
  })
  const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null)
  const [focusKey, setFocusKey] = useState(0)

  const mentionable = useMemo(
    () => people ?? [...authorsOf(list, new Map([[currentUser.id, currentUser]])).values()],
    [currentUser, list, people],
  )
  const total = countTree(list)
  const participants = useMemo(() => [...authorsOf(list).values()], [list])

  const commit = useCallback(
    (next: ThreadComment[], event: CommentThreadEvent) => {
      if (comments === undefined) setInternal(next)
      onCommentsChange?.(next, event)
    },
    [comments, onCommentsChange],
  )

  const closeUi = (key: 'editing' | 'confirming' | 'picker') =>
    setUi((current) => ({ ...current, [key]: null }))

  const setResolved = (next: boolean) => {
    if (resolved === undefined) setInternalResolved(next)
    onResolvedChange?.(next)
    setUi((current) => ({ ...current, editing: null, confirming: null, picker: null }))
    setReplyTo(null)
    // the button that undoes it takes focus, so the keyboard never lands on the page body
    requestAnimationFrame(() =>
      rootRef.current
        ?.querySelector<HTMLElement>(next ? '[data-reopen]' : '[data-resolve]')
        ?.focus({ preventScroll: true }),
    )
  }

  const addReply = (body: string) => {
    const comment: ThreadComment = {
      id: newId(),
      author: currentUser,
      body,
      createdAt: nowLabel,
      reactions: [],
    }
    let parentId: string | null = null
    if (replyTo) {
      const path = pathTo(list, replyTo.id) ?? []
      // replies deeper than maxDepth attach to the deepest allowed parent
      parentId = path[Math.min(path.length, maxDepth) - 1] ?? null
    }
    const next = parentId
      ? mapTree(list, parentId, (parent) => ({
          ...parent,
          replies: [...(parent.replies ?? []), comment],
        }))
      : [...list, comment]
    if (parentId) {
      const opened = parentId
      setUi((current) => ({ ...current, collapsed: { ...current.collapsed, [opened]: false } }))
    }
    commit(next, { type: 'reply', comment, parentId })
    setReplyTo(null)
  }

  const edit = (id: string, body: string) => {
    commit(
      mapTree(list, id, (comment) => ({ ...comment, body, edited: true })),
      {
        type: 'edit',
        id,
        body,
      },
    )
    closeUi('editing')
  }

  const remove = (id: string) => {
    commit(removeFromTree(list, id), { type: 'delete', id })
    closeUi('confirming')
    if (replyTo?.id === id) setReplyTo(null)
  }

  const react = (id: string, emoji: string) => {
    const target = findComment(list, id)
    if (!target) return
    const existing = target.reactions?.find((reaction) => reaction.emoji === emoji)
    const added = !existing?.users.includes(currentUser.id)
    const nextReactions = existing
      ? (target.reactions ?? [])
          .map((reaction) =>
            reaction.emoji !== emoji
              ? reaction
              : {
                  ...reaction,
                  users: added
                    ? [...reaction.users, currentUser.id]
                    : reaction.users.filter((user) => user !== currentUser.id),
                },
          )
          .filter((reaction) => reaction.users.length)
      : [...(target.reactions ?? []), { emoji, users: [currentUser.id] }]
    commit(
      mapTree(list, id, (comment) => ({ ...comment, reactions: nextReactions })),
      {
        type: 'react',
        id,
        emoji,
        added,
      },
    )
    closeUi('picker')
  }

  // escape closes the prompt or picker without reaching the composer
  const escapeTo = (key: 'confirming' | 'picker') => (event: KeyboardEvent) => {
    if (event.key !== 'Escape') return
    event.stopPropagation()
    closeUi(key)
  }

  const quick = {
    duration: reduced ? 0 : DURATION.instant,
    ease: EASE_STANDARD,
  }

  const renderComment = (comment: ThreadComment, depth: number): ReactNode => {
    const mine = comment.author.id === currentUser.id
    const replies = comment.replies ?? []
    const collapsed = !!ui.collapsed[comment.id]
    const editing = ui.editing === comment.id
    const confirming = ui.confirming === comment.id
    const picking = ui.picker === comment.id
    const commentReactions = comment.reactions ?? []

    return (
      <motion.li
        key={comment.id}
        className="overflow-clip [overflow-clip-margin:4px]"
        {...grow(reduced)}
      >
        <article
          className="group/comment flex gap-2.5 rounded-2xl p-2.5"
          aria-label={
            comment.deleted ? t.deletedComment : `${comment.author.name}, ${comment.createdAt}`
          }
        >
          {comment.deleted ? (
            <span
              className="size-7 flex-none rounded-full border border-dashed border-foreground/25"
              aria-hidden="true"
            />
          ) : (
            <CommentAvatar author={comment.author} />
          )}
          <div className="grid min-w-0 flex-1 gap-0.5">
            {comment.deleted ? (
              <p className="mt-1 text-muted-foreground italic">{t.deletedText}</p>
            ) : (
              <>
                <header className="flex min-w-0 items-baseline gap-2">
                  <span className="truncate font-medium">{comment.author.name}</span>
                  <span className="flex-none text-xs text-muted-foreground">
                    {comment.createdAt}
                    {comment.edited && ` · ${t.edited}`}
                  </span>
                </header>
                {/* editing swaps the body for a composer in place while the height springs between them;
                    the picker and delete prompt can wrap on narrow screens, so they spring it too.
                    a 4px clip margin keeps focus rings at the edge visible */}
                <AutoHeight
                  reduced={reduced}
                  morphKey={editing ? 'edit' : confirming ? 'confirm' : picking ? 'picker' : 'view'}
                  className="overflow-clip [overflow-clip-margin:4px]"
                >
                  <AnimatePresence mode="popLayout" initial={false}>
                    {editing ? (
                      <motion.div key="edit" {...swap(reduced)}>
                        <Composer
                          people={mentionable}
                          initial={comment.body}
                          placeholder={t.editComment}
                          submitLabel={t.save}
                          cancelLabel={t.cancel}
                          mentionsLabel={t.mentions}
                          autoFocus
                          compact
                          reduced={reduced}
                          onSubmit={(body) => edit(comment.id, body)}
                          onCancel={() => closeUi('editing')}
                        />
                      </motion.div>
                    ) : (
                      <motion.div key="view" {...swap(reduced)}>
                        <CommentBody text={comment.body} people={mentionable} />
                        <div className="mt-1 flex min-h-[30px] flex-wrap items-center gap-x-2 gap-y-1">
                          {commentReactions.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              <AnimatePresence initial={false} mode="popLayout">
                                {commentReactions.map((reaction) => {
                                  const pressed = reaction.users.includes(currentUser.id)
                                  return (
                                    <motion.button
                                      key={reaction.emoji}
                                      type="button"
                                      layout={!reduced}
                                      className={REACTION}
                                      aria-pressed={pressed}
                                      aria-label={t.reactionCount(
                                        reaction.emoji,
                                        reaction.users.length,
                                        pressed,
                                      )}
                                      onClick={() => react(comment.id, reaction.emoji)}
                                      initial={
                                        reduced ? { opacity: 0 } : { opacity: 0, scale: 0.7 }
                                      }
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.7 }}
                                      transition={reduced ? INSTANT : SPRING_SNAPPY}
                                    >
                                      <span aria-hidden="true">{reaction.emoji}</span>
                                      <RollingCount
                                        value={reaction.users.length}
                                        reduced={reduced}
                                      />
                                    </motion.button>
                                  )
                                })}
                              </AnimatePresence>
                            </div>
                          ) : null}

                          <AnimatePresence mode="wait" initial={false}>
                            {confirming ? (
                              <motion.div
                                key="confirm"
                                className={ACTIONS}
                                onKeyDown={escapeTo('confirming')}
                                {...slide(reduced, 6)}
                              >
                                <span className="mr-1 text-xs text-foreground">
                                  {t.deleteConfirm}
                                </span>
                                <button
                                  type="button"
                                  className={ACTION}
                                  onClick={() => closeUi('confirming')}
                                >
                                  {t.cancel}
                                </button>
                                <button
                                  type="button"
                                  className={cn(ACTION, DANGER)}
                                  autoFocus
                                  onClick={() => remove(comment.id)}
                                >
                                  {t.delete}
                                </button>
                              </motion.div>
                            ) : picking ? (
                              <motion.div
                                key="picker"
                                role="group"
                                aria-label={t.reactions}
                                className={ACTIONS}
                                onKeyDown={escapeTo('picker')}
                                {...slide(reduced, -6)}
                              >
                                {reactions.map((emoji, index) => (
                                  <motion.button
                                    key={emoji}
                                    type="button"
                                    className={EMOJI}
                                    autoFocus={index === 0}
                                    aria-label={t.reactWith(emoji)}
                                    aria-pressed={
                                      !!comment.reactions
                                        ?.find((reaction) => reaction.emoji === emoji)
                                        ?.users.includes(currentUser.id)
                                    }
                                    onClick={() => react(comment.id, emoji)}
                                    initial={reduced ? false : { opacity: 0, scale: 0.6 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={
                                      reduced
                                        ? INSTANT
                                        : { ...SPRING_SNAPPY, delay: index * STAGGER_ITEM }
                                    }
                                  >
                                    {emoji}
                                  </motion.button>
                                ))}
                                <button
                                  type="button"
                                  className={cn(ACTION, ICON_ACTION)}
                                  aria-label={t.closeReactions}
                                  onClick={() => closeUi('picker')}
                                >
                                  <X size={14} strokeWidth={1.75} aria-hidden="true" />
                                </button>
                              </motion.div>
                            ) : (
                              <motion.div
                                key="actions"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={quick}
                              >
                                {/* motion owns the outer opacity, so the hover reveal lives on an inner row */}
                                <div className={cn(ACTIONS, ACTIONS_REVEAL)}>
                                  <button
                                    type="button"
                                    className={cn(ACTION, ICON_ACTION)}
                                    aria-label={t.addReaction}
                                    onClick={() =>
                                      setUi((current) => ({
                                        ...current,
                                        picker: comment.id,
                                        confirming: null,
                                      }))
                                    }
                                  >
                                    <SmilePlus size={15} strokeWidth={1.75} aria-hidden="true" />
                                  </button>
                                  <button
                                    type="button"
                                    className={ACTION}
                                    onClick={() => {
                                      setReplyTo({ id: comment.id, name: comment.author.name })
                                      setFocusKey((key) => key + 1)
                                    }}
                                  >
                                    {t.reply}
                                  </button>
                                  {mine ? (
                                    <button
                                      type="button"
                                      className={ACTION}
                                      onClick={() =>
                                        setUi((current) => ({
                                          ...current,
                                          editing: comment.id,
                                          confirming: null,
                                          picker: null,
                                        }))
                                      }
                                    >
                                      {t.edit}
                                    </button>
                                  ) : null}
                                  {mine ? (
                                    <button
                                      type="button"
                                      className={ACTION}
                                      onClick={() =>
                                        setUi((current) => ({
                                          ...current,
                                          confirming: comment.id,
                                          editing: null,
                                          picker: null,
                                        }))
                                      }
                                    >
                                      {t.delete}
                                    </button>
                                  ) : null}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </AutoHeight>
              </>
            )}

            {replies.length > 0 ? (
              <button
                type="button"
                className={TOGGLE}
                aria-expanded={!collapsed}
                onClick={() =>
                  setUi((current) => ({
                    ...current,
                    collapsed: { ...current.collapsed, [comment.id]: !collapsed },
                  }))
                }
              >
                <motion.span
                  className="grid place-items-center text-muted-foreground"
                  initial={false}
                  animate={{ rotate: collapsed ? 0 : 90 }}
                  transition={reduced ? INSTANT : SPRING_SNAPPY}
                  aria-hidden="true"
                >
                  <ChevronRight size={13} strokeWidth={1.75} />
                </motion.span>
                {collapsed ? t.showReplies(countTree(replies)) : t.hideReplies}
                {collapsed ? (
                  <span className={STACK} aria-hidden="true">
                    {[...authorsOf(replies).values()].slice(0, 3).map((author) => (
                      <CommentAvatar key={author.id} author={author} size={18} />
                    ))}
                  </span>
                ) : null}
              </button>
            ) : null}
          </div>
        </article>

        <AnimatePresence initial={false}>
          {replies.length > 0 && !collapsed ? (
            <motion.div key="replies" className="overflow-clip" {...grow(reduced)}>
              {/* replies hang from a quiet rail under their parent's avatar */}
              <ul
                data-depth={depth + 1}
                className="relative ml-6 grid pl-3 before:absolute before:top-0.5 before:bottom-3.5 before:left-0 before:w-px before:bg-border max-[420px]:ml-3"
              >
                <AnimatePresence initial={false}>
                  {replies.map((reply) => renderComment(reply, depth + 1))}
                </AnimatePresence>
              </ul>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.li>
    )
  }

  return (
    <section
      ref={rootRef}
      data-slot="comment-thread"
      data-resolved={isResolved || undefined}
      aria-label={t.thread}
      style={{ '--comment-thread-spring': SPRING_EASE } as CSSProperties}
      className={cn(
        'w-full min-w-0 rounded-[1.625rem] border border-border bg-card text-sm leading-[1.4] tracking-[-0.01em] text-foreground transition-[border-radius] duration-580 ease-(--comment-thread-spring) data-resolved:rounded-[22px] motion-reduce:transition-none',
        className,
      )}
    >
      <AutoHeight reduced={reduced} morphKey={isResolved ? 'resolved' : 'thread'}>
        <AnimatePresence mode="popLayout" initial={false}>
          {isResolved ? (
            <motion.div
              key="resolved"
              className="flex items-center gap-3 py-2.5 pr-2.5 pl-3.5"
              {...face(reduced)}
            >
              <span
                className="grid size-6 flex-none place-items-center rounded-full bg-emerald-500/14 text-emerald-600 dark:text-emerald-400"
                aria-hidden="true"
              >
                <Check size={14} strokeWidth={2} />
              </span>
              <span className="grid min-w-0 flex-1">
                <span className="truncate font-medium">
                  {t.resolved}
                  {title ? (
                    <>
                      {' · '}
                      <span className="font-normal text-muted-foreground">{title}</span>
                    </>
                  ) : null}
                </span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {t.commentCount(total)} · {t.peopleCount(participants.length)}
                </span>
              </span>
              <span className={STACK} aria-hidden="true">
                {participants.slice(0, 3).map((author) => (
                  <CommentAvatar key={author.id} author={author} size={22} />
                ))}
              </span>
              <button
                type="button"
                className={PILL_BUTTON}
                data-reopen=""
                onClick={() => setResolved(false)}
              >
                <RotateCcw size={14} strokeWidth={1.75} aria-hidden="true" />
                {t.reopen}
              </button>
            </motion.div>
          ) : (
            <motion.div key="thread" className="grid" {...face(reduced)}>
              <header className="flex items-center justify-between gap-3 pt-3 pr-3 pb-2 pl-[18px]">
                <div className="grid min-w-0">
                  {title ? <h3 className="m-0 truncate text-sm font-medium">{title}</h3> : null}
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {t.commentCount(total)}
                  </span>
                </div>
                <button
                  type="button"
                  className={cn(
                    PILL_BUTTON,
                    '[&>svg]:text-emerald-600 dark:[&>svg]:text-emerald-400',
                  )}
                  data-resolve=""
                  disabled={!total}
                  onClick={() => setResolved(true)}
                >
                  <Check size={15} strokeWidth={1.75} aria-hidden="true" />
                  {t.resolve}
                </button>
              </header>

              {list.length > 0 ? (
                <ul className="grid px-2">
                  <AnimatePresence initial={false}>
                    {list.map((comment) => renderComment(comment, 0))}
                  </AnimatePresence>
                </ul>
              ) : (
                <p className="m-0 px-[18px] pt-2 pb-4 text-muted-foreground">{t.empty}</p>
              )}

              <div className="mt-1 grid border-t border-border/60 px-3 pt-2.5 pb-3">
                <AnimatePresence initial={false}>
                  {replyTo ? (
                    <motion.div key="replying" className="overflow-clip" {...grow(reduced)}>
                      <span className="flex items-center gap-1.5 pr-0.5 pb-2 pl-[38px] text-xs text-muted-foreground max-[420px]:pl-0.5">
                        <CornerDownRight size={13} strokeWidth={1.75} aria-hidden="true" />
                        <span>
                          <Highlighted
                            text={t.replyingTo(replyTo.name)}
                            part={replyTo.name}
                            className="font-medium text-foreground"
                          />
                        </span>
                        <button
                          type="button"
                          className={cn(ACTION, ICON_ACTION, 'ml-0.5 h-[22px] w-[22px]')}
                          aria-label={t.cancelReply}
                          onClick={() => setReplyTo(null)}
                        >
                          <X size={14} strokeWidth={1.75} aria-hidden="true" />
                        </button>
                      </span>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
                <Composer
                  people={mentionable}
                  placeholder={placeholder}
                  submitLabel={t.send}
                  cancelLabel={t.cancel}
                  mentionsLabel={t.mentions}
                  focusKey={focusKey}
                  reduced={reduced}
                  onSubmit={addReply}
                  onCancel={replyTo ? () => setReplyTo(null) : undefined}
                  leading={
                    <CommentAvatar author={currentUser} className="mt-[5px] max-[420px]:hidden" />
                  }
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </AutoHeight>
    </section>
  )
}
