import {
  BLUR_SUBTLE,
  DURATION,
  EASE_ENTER,
  EASE_STANDARD,
  HEIGHT_SPRING,
  MAX_SUGGESTIONS,
} from './comment-thread.constants'
import type { CommentAuthor, MentionQuery, ThreadComment } from './comment-thread.types'

/** Fills in defaults; a key passed as undefined keeps its default too. */
export const withDefaults = <T extends object>(defaults: Required<T>, given?: T): Required<T> => ({
  ...defaults,
  ...Object.fromEntries(Object.entries(given ?? {}).filter(([, value]) => value !== undefined)),
})

// every change returns a new tree, so a controlled parent can store it as is

export const mapTree = (
  list: ThreadComment[],
  id: string,
  fn: (comment: ThreadComment) => ThreadComment,
): ThreadComment[] =>
  list.map((comment) => {
    if (comment.id === id) return fn(comment)
    return comment.replies?.length
      ? { ...comment, replies: mapTree(comment.replies, id, fn) }
      : comment
  })

/**
 * Drops a comment, or leaves a placeholder when it still has replies. A placeholder whose last
 * reply goes is dropped too, so no empty "deleted" rows linger.
 */
export const removeFromTree = (list: ThreadComment[], id: string): ThreadComment[] =>
  list.flatMap((comment) => {
    if (comment.id === id) {
      return comment.replies?.length ? [{ ...comment, deleted: true, body: '', reactions: [] }] : []
    }
    if (!comment.replies?.length) return [comment]
    const replies = removeFromTree(comment.replies, id)
    return comment.deleted && !replies.length ? [] : [{ ...comment, replies }]
  })

export const countTree = (list: ThreadComment[]): number =>
  list.reduce(
    (sum, comment) => sum + (comment.deleted ? 0 : 1) + countTree(comment.replies ?? []),
    0,
  )

export const authorsOf = (list: ThreadComment[], into = new Map<string, CommentAuthor>()) => {
  list.forEach((comment) => {
    if (!comment.deleted) into.set(comment.author.id, comment.author)
    authorsOf(comment.replies ?? [], into)
  })
  return into
}

/** Ids from the root down to `id`. */
export const pathTo = (
  list: ThreadComment[],
  id: string,
  trail: string[] = [],
): string[] | null => {
  for (const comment of list) {
    if (comment.id === id) return [...trail, id]
    const found = pathTo(comment.replies ?? [], id, [...trail, comment.id])
    if (found) return found
  }
  return null
}

export const findComment = (list: ThreadComment[], id: string): ThreadComment | null => {
  for (const comment of list) {
    if (comment.id === id) return comment
    const found = findComment(comment.replies ?? [], id)
    if (found) return found
  }
  return null
}

export const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

let serial = 0
export const newId = () => `c-${Date.now().toString(36)}-${(serial++).toString(36)}`

/** Splits text around "@Full Name" mentions of known people; odd entries are the mentions. */
export function splitMentions(text: string, people: CommentAuthor[]) {
  const names = people
    .map((person) => person.name)
    .sort((a, b) => b.length - a.length)
    .map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  if (!names.length) return [text]
  return text.split(new RegExp(`(@(?:${names.join('|')}))`, 'g'))
}

/** The @mention the caret is in, if any. */
export function readMention(value: string, caret: number): MentionQuery | null {
  const match = /(^|\s)@([\p{L}]*)$/u.exec(value.slice(0, caret))
  return match ? { start: caret - match[2]!.length - 1, term: match[2]! } : null
}

/** People whose first, last or full name starts with what has been typed after the @. */
export function matchPeople(people: CommentAuthor[], query: MentionQuery | null) {
  if (!query) return []
  const term = query.term.toLowerCase()
  return people
    .filter((person) => {
      const name = person.name.toLowerCase()
      return name.split(' ').some((part) => part.startsWith(term)) || name.startsWith(term)
    })
    .slice(0, MAX_SUGGESTIONS)
}

/** Rows open and close their height on a spring; reduced motion only fades. */
export const grow = (reduced: boolean) =>
  reduced
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: DURATION.instant },
      }
    : {
        initial: { height: 0, opacity: 0 },
        animate: { height: 'auto', opacity: 1 },
        exit: { height: 0, opacity: 0 },
        transition: {
          height: HEIGHT_SPRING,
          opacity: { duration: DURATION.standard, ease: EASE_ENTER },
        },
      }

/** A body and its editor cross-fade while the height between them springs. */
export const swap = (reduced: boolean) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: {
    opacity: 0,
    transition: { duration: reduced ? 0 : DURATION.instant, ease: EASE_STANDARD },
  },
  transition: { duration: reduced ? 0 : DURATION.fast, ease: EASE_ENTER },
})

/** The delete prompt and the reaction picker slide in from the side. */
export const slide = (reduced: boolean, x: number) => ({
  initial: reduced ? { opacity: 0 } : { opacity: 0, x },
  animate: { opacity: 1, x: 0 },
  exit: {
    opacity: 0,
    transition: { duration: reduced ? 0 : DURATION.instant, ease: EASE_STANDARD },
  },
  transition: { duration: reduced ? 0 : DURATION.fast, ease: EASE_ENTER },
})

/** The open thread and the resolved chip trade places through a soft blur. */
export const face = (reduced: boolean) => ({
  initial: reduced ? { opacity: 0 } : { opacity: 0, filter: `blur(${BLUR_SUBTLE}px)` },
  animate: { opacity: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, filter: reduced ? 'blur(0px)' : `blur(${BLUR_SUBTLE}px)` },
  transition: { duration: reduced ? 0 : DURATION.standard, ease: EASE_ENTER },
})
