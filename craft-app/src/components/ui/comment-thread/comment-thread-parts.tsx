import { AnimatePresence, animate, motion, useMotionValue } from 'motion/react'
import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'

import { cn } from '@/lib/utils'

import {
  AVATAR,
  COMPACT_BUTTON,
  DURATION,
  EASE_ENTER,
  EASE_STANDARD,
  FIELD,
  GHOST,
  HEIGHT_SPRING,
  INSTANT,
  ROLL,
  ROLL_REDUCED,
  SEND,
  SPRING_SNAPPY,
} from './comment-thread.constants'
import type { CommentAuthor, MentionQuery } from './comment-thread.types'
import { initialsOf, matchPeople, readMention, splitMentions } from './comment-thread.utils'

export function CommentAvatar({
  author,
  size = 28,
  className,
}: {
  author: CommentAuthor
  size?: number
  className?: string
}) {
  const box = { width: size, height: size }
  return author.avatar ? (
    <img
      className={cn(AVATAR, className)}
      src={author.avatar}
      alt=""
      width={size}
      height={size}
      style={box}
    />
  ) : (
    <span
      className={cn(AVATAR, className)}
      style={{ ...box, fontSize: Math.round(size * 0.38) }}
      aria-hidden="true"
    >
      {initialsOf(author.name)}
    </span>
  )
}

/** Highlights "@Full Name" for known people. */
export function CommentBody({ text, people }: { text: string; people: CommentAuthor[] }) {
  const parts = useMemo(() => splitMentions(text, people), [people, text])
  return (
    <p className="m-0 text-pretty wrap-anywhere whitespace-pre-wrap text-muted-foreground">
      {parts.map((part, index) =>
        index % 2 ? (
          <span key={index} className="font-medium text-primary">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </p>
  )
}

/** Wraps the first `part` inside `text`, so a translated sentence keeps its highlighted name wherever it falls. */
export function Highlighted({
  text,
  part,
  className,
}: {
  text: string
  part: string
  className?: string
}) {
  const at = part ? text.indexOf(part) : -1
  if (at < 0) return text
  return (
    <>
      {text.slice(0, at)}
      <span className={className}>{part}</span>
      {text.slice(at + part.length)}
    </>
  )
}

/** Rolls a count up or down in place. */
export function RollingCount({ value, reduced }: { value: number; reduced: boolean }) {
  const [track, setTrack] = useState({ value, direction: 1 })
  if (track.value !== value) setTrack({ value, direction: value > track.value ? 1 : -1 })

  return (
    <span className="relative inline-grid min-w-[1ch] overflow-hidden tabular-nums [&>span]:col-start-1 [&>span]:row-start-1">
      <AnimatePresence mode="popLayout" initial={false} custom={track.direction}>
        <motion.span
          key={value}
          custom={track.direction}
          variants={reduced ? ROLL_REDUCED : ROLL}
          initial="hidden"
          animate="shown"
          exit="gone"
          transition={reduced ? INSTANT : SPRING_SNAPPY}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

/**
 * Follows its content's height exactly, except when `morphKey` changes: then it springs, so the
 * two states morph into each other.
 */
export function AutoHeight({
  children,
  reduced,
  morphKey,
  className,
}: {
  children: ReactNode
  reduced: boolean
  morphKey: string
  className?: string
}) {
  const inner = useRef<HTMLDivElement>(null)
  const height = useMotionValue(0)
  const [measured, setMeasured] = useState(false)
  const morphing = useRef(false)
  const lastKey = useRef(morphKey)

  useLayoutEffect(() => {
    if (lastKey.current === morphKey) return
    lastKey.current = morphKey
    morphing.current = true
  }, [morphKey])

  useLayoutEffect(() => {
    const node = inner.current
    if (!node || typeof ResizeObserver === 'undefined') return
    // the border box keeps subpixel line heights, so the frame never clips part of the last line
    const observer = new ResizeObserver(([entry]) => {
      const next = entry?.borderBoxSize?.[0]?.blockSize ?? node.offsetHeight
      if (morphing.current && !reduced) {
        morphing.current = false
        animate(height, next, HEIGHT_SPRING)
        return
      }
      if (height.isAnimating()) {
        animate(height, next, HEIGHT_SPRING)
        return
      }
      height.jump(next)
      setMeasured(true)
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [height, reduced])

  return (
    <motion.div
      className={cn('overflow-hidden rounded-[inherit]', className)}
      style={{ height: measured ? height : 'auto' }}
    >
      <div ref={inner} className="relative">
        {children}
      </div>
    </motion.div>
  )
}

type ComposerProps = {
  people: CommentAuthor[]
  initial?: string
  placeholder: string
  submitLabel: string
  cancelLabel: string
  mentionsLabel: string
  autoFocus?: boolean
  /** Bumped to pull focus back into the field, e.g. after Reply. */
  focusKey?: number
  onSubmit: (body: string) => void
  onCancel?: () => void
  leading?: ReactNode
  compact?: boolean
  reduced: boolean
}

/** A growing text field with @mention suggestions. ⌘ or Ctrl + Enter sends; Escape cancels. */
export function Composer({
  people,
  initial = '',
  placeholder,
  submitLabel,
  cancelLabel,
  mentionsLabel,
  autoFocus,
  focusKey,
  onSubmit,
  onCancel,
  leading,
  compact,
  reduced,
}: ComposerProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const field = useRef<HTMLTextAreaElement>(null)
  const [text, setText] = useState(initial)
  const [query, setQuery] = useState<MentionQuery | null>(null)
  const [active, setActive] = useState(0)
  const suggestions = useMemo(() => matchPeople(people, query), [people, query])
  const open = !!query && suggestions.length > 0
  const listId = `${uid}-people`

  useEffect(() => {
    if (!autoFocus && !focusKey) return
    const node = field.current
    if (!node) return
    node.focus({ preventScroll: true })
    node.setSelectionRange(node.value.length, node.value.length)
  }, [autoFocus, focusKey])

  const readQuery = (value: string, caret: number) => {
    setQuery(readMention(value, caret))
    setActive(0)
  }

  const insert = (person: CommentAuthor) => {
    const node = field.current
    if (!node || !query) return
    const caret = node.selectionStart ?? text.length
    const next = `${text.slice(0, query.start)}@${person.name} ${text.slice(caret)}`
    const at = query.start + person.name.length + 2
    setText(next)
    setQuery(null)
    requestAnimationFrame(() => {
      node.focus()
      node.setSelectionRange(at, at)
    })
  }

  const send = () => {
    const body = text.trim()
    if (!body) return
    onSubmit(body)
    setText('')
    setQuery(null)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (open) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault()
        const step = event.key === 'ArrowDown' ? 1 : -1
        setActive((index) => (index + step + suggestions.length) % suggestions.length)
        return
      }
      if (event.key === 'Enter' || event.key === 'Tab') {
        event.preventDefault()
        insert(suggestions[active]!)
        return
      }
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        setQuery(null)
        return
      }
    }
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault()
      send()
      return
    }
    if (event.key === 'Escape' && onCancel) {
      event.preventDefault()
      event.stopPropagation()
      onCancel()
    }
  }

  return (
    <div
      data-compact={compact || undefined}
      className={cn(
        'grid items-start gap-x-2.5 gap-y-2',
        compact
          ? 'mt-1 grid-cols-[minmax(0,1fr)]'
          : 'grid-cols-[auto_minmax(0,1fr)_auto] max-[420px]:grid-cols-[minmax(0,1fr)_auto]',
      )}
    >
      {leading}
      <div className="grid min-w-0">
        <textarea
          ref={field}
          className={FIELD}
          value={text}
          placeholder={placeholder}
          rows={1}
          aria-label={placeholder}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={open ? `${uid}-person-${active}` : undefined}
          onChange={(event) => {
            setText(event.target.value)
            readQuery(event.target.value, event.target.selectionStart)
          }}
          onSelect={(event) =>
            readQuery(event.currentTarget.value, event.currentTarget.selectionStart)
          }
          onBlur={() => setQuery(null)}
          onKeyDown={onKeyDown}
        />
        <AnimatePresence>
          {open ? (
            <motion.ul
              key="people"
              id={listId}
              role="listbox"
              aria-label={mentionsLabel}
              className="mt-1.5 grid overflow-clip rounded-[14px] border border-border bg-popover p-1 text-popover-foreground"
              initial={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={
                reduced
                  ? { opacity: 0, transition: INSTANT }
                  : {
                      opacity: 0,
                      height: 0,
                      transition: { duration: DURATION.instant, ease: EASE_STANDARD },
                    }
              }
              transition={
                reduced
                  ? INSTANT
                  : {
                      height: HEIGHT_SPRING,
                      opacity: { duration: DURATION.fast, ease: EASE_ENTER },
                    }
              }
            >
              {suggestions.map((person, index) => (
                <li
                  key={person.id}
                  id={`${uid}-person-${index}`}
                  role="option"
                  aria-selected={index === active}
                  className="flex min-h-8 cursor-pointer items-center gap-2 rounded-[10px] px-2 aria-selected:bg-muted"
                  // keeps focus in the field, so picking a person never blurs it
                  onPointerDown={(event) => event.preventDefault()}
                  onPointerMove={() => setActive(index)}
                  onClick={() => insert(person)}
                >
                  <CommentAvatar author={person} size={20} />
                  {person.name}
                </li>
              ))}
            </motion.ul>
          ) : null}
        </AnimatePresence>
      </div>
      <div className={cn('flex items-center gap-1', compact && 'justify-end')}>
        {onCancel ? (
          <button type="button" className={cn(GHOST, compact && COMPACT_BUTTON)} onClick={onCancel}>
            {cancelLabel}
          </button>
        ) : null}
        <button
          type="button"
          className={cn(SEND, compact && COMPACT_BUTTON)}
          disabled={!text.trim() || text.trim() === initial.trim()}
          onClick={send}
        >
          {submitLabel}
        </button>
      </div>
    </div>
  )
}
