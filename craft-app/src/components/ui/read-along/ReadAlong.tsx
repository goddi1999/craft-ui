import { motion, useReducedMotion } from 'motion/react'
import {
  Fragment,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'

import { cn } from '@/lib/utils'

import { LAST_WORD_MS, RESTART_MS, START_MS } from './read-along.constants'
import type { ReadAlongProps } from './read-along.types'
import { clamp, dwellOf } from './read-along.utils'
import { useReadPill } from './use-read-pill'

/**
 * Reads a sentence out word by word: a pill slides behind the current word and stretches as it
 * travels, words already read turn bright. Click a word, or use the arrow keys, to read from there.
 */
export function ReadAlong({
  text,
  index: indexProp,
  defaultIndex = -1,
  onIndexChange,
  playing = true,
  loop = true,
  speed = 1,
  className,
  onKeyDown,
  ...props
}: ReadAlongProps) {
  const words = text.split(' ')
  const last = words.length - 1
  const [innerIndex, setInnerIndex] = useState(defaultIndex)
  // the first start waits 1s, every lap after that 1.1s, like the source
  const [lapped, setLapped] = useState(false)
  const index = indexProp ?? innerIndex
  // the text can change under the index
  const current = index <= last ? index : -1
  const reduced = useReducedMotion() === true
  const rootRef = useRef<HTMLDivElement>(null)
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([])
  const pill = useReadPill({ rootRef, wordRefs, current, text, reduced })

  const wait =
    current < 0
      ? lapped
        ? RESTART_MS
        : START_MS
      : current === last
        ? LAST_WORD_MS
        : dwellOf(words[current])
  const stopped = !playing || (current === last && !loop)

  const select = (next: number) => {
    if (indexProp === undefined) setInnerIndex(next)
    onIndexChange?.(next)
  }

  const handleTick = useEffectEvent(() => {
    if (current !== last) {
      select(current + 1)
      return
    }
    // past the last word: the pill fades and it starts over
    setLapped(true)
    select(-1)
  })

  useEffect(() => {
    if (stopped) return
    const timer = window.setTimeout(handleTick, wait / speed)
    return () => window.clearTimeout(timer)
  }, [current, stopped, wait, speed])

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event)
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
    if (step === 0) return
    event.preventDefault()
    select(clamp(current + step, 0, last))
  }

  return (
    <div
      role="group"
      tabIndex={0}
      {...props}
      ref={rootRef}
      data-slot="read-along"
      className={cn(
        // the pill and its padding are in em, so they follow whatever font size you set
        'relative w-full max-w-[420px] rounded-md text-[length:min(30px,6.4vw)] leading-[1.45] font-semibold tracking-[-0.03em] text-muted-foreground outline-none select-none focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-ring focus-visible:outline-solid',
        className,
      )}
      onKeyDown={handleKeyDown}
    >
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 h-[1.3em] rounded-[0.34em] bg-primary"
        style={{ x: pill.x, y: pill.y, width: pill.width, opacity: pill.opacity }}
      />
      {words.map((word, i) => (
        <Fragment key={i}>
          <span
            ref={(node) => {
              wordRefs.current[i] = node
            }}
            aria-hidden
            onClick={() => select(i)}
            className={cn(
              'relative z-[1] cursor-pointer transition-colors duration-[180ms] ease-[ease]',
              i < current && 'text-foreground',
              i === current && 'text-primary-foreground',
            )}
          >
            {word}
          </span>
          {i < last ? ' ' : null}
        </Fragment>
      ))}
    </div>
  )
}
