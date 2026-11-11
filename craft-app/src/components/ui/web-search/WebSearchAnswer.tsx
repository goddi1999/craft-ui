import { useReducedMotion } from 'motion/react'
import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { cn } from '@/lib/utils'

import { CATCH_UP, CLAUSE_PAUSE, SENTENCE_PAUSE, STREAM_SPEED } from './web-search.constants'
import { Caret } from './web-search-parts'
import type { WebSearchAnswerProps } from './web-search.types'
import { isTag, jitter, plain } from './web-search.utils'

// a citation is wrapped with the word before it and the punctuation after it, so it never wraps onto a line alone
const glue = (nodes: ReactNode): ReactNode[] => {
  const list = Children.toArray(nodes)
  const out: ReactNode[] = []
  list.forEach((node, i) => {
    if (isTag(node)) {
      out.push(cloneElement(node, undefined, glue(node.props.children)))
      return
    }
    if (!isValidElement(node)) {
      out.push(node)
      return
    }
    const prev = out.pop()
    const before = typeof prev === 'string' ? /^([\s\S]*?)(\S+\s*)$/.exec(prev) : null
    out.push(before ? before[1] : prev)
    const next = list[i + 1]
    const after = typeof next === 'string' ? /^(\S*)([\s\S]*)$/.exec(next) : null
    if (after) list[i + 1] = after[2]
    out.push(
      <span key={`glue-${i}`} className="whitespace-nowrap">
        {before?.[2]}
        {node}
        {after?.[1]}
      </span>,
    )
  })
  return out
}

/**
 * An answer that types itself out at a jittered, punctuation-aware pace.
 * Plain tags (p, li, strong) are typed into; components such as
 * `WebSearchCitation` land whole.
 */
export function WebSearchAnswer({
  play = true,
  speed = STREAM_SPEED,
  onComplete,
  className,
  children,
  ...props
}: WebSearchAnswerProps) {
  const reduced = !!useReducedMotion()
  const content = useMemo(() => glue(children), [children])
  const text = useMemo(() => content.map(plain).join(''), [content])
  const [count, setCount] = useState(0)
  const written = reduced ? (play ? text.length : 0) : Math.min(count, text.length)
  const writing = play && written < text.length

  useEffect(() => {
    if (!play || reduced || count >= text.length) return
    const step = Math.max(
      1 + Math.floor(jitter(count) * 3),
      Math.ceil((text.length - count) / CATCH_UP),
    )
    const last = text[count + step - 1]
    const delay =
      (1000 / speed) * step * (0.4 + jitter(count + 7) * 1.2) +
      (/[.!?]/.test(last) ? SENTENCE_PAUSE : /[,;:]/.test(last) ? CLAUSE_PAUSE : 0)
    const id = window.setTimeout(() => setCount(count + step), delay)
    return () => window.clearTimeout(id)
  }, [play, reduced, count, text, speed])

  const done = play && text.length > 0 && !writing
  useEffect(() => {
    if (done) onComplete?.()
    // fires once per finish; a new onComplete identity must not call it again
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done])

  // walks the content and cuts it off after the written characters, leaving the caret at the cut
  let left = written
  let caret = writing
  const write = (node: ReactNode): ReactNode => {
    if (left <= 0) return null
    if (isTag(node)) {
      return cloneElement(node, undefined, Children.toArray(node.props.children).map(write))
    }
    const isText = typeof node === 'string' || typeof node === 'number'
    const part = isText ? String(node).slice(0, left) : node
    left -= isText ? (part as string).length : 1
    if (left > 0 || !caret) return part
    caret = false
    return [part, <Caret key="caret" reduced={reduced} />]
  }

  return (
    <div
      data-slot="web-search-answer"
      data-writing={writing || undefined}
      aria-busy={writing}
      className={cn(
        'font-runde text-[15px] leading-7 font-medium text-foreground/80',
        '[&_li]:pl-1 [&_li+li]:mt-1.5 [&_li::marker]:text-muted-foreground [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-5 [&>*+*]:mt-3',
        className,
      )}
      {...props}
    >
      {written === 0 && writing ? <Caret reduced={reduced} /> : content.map(write)}
    </div>
  )
}
