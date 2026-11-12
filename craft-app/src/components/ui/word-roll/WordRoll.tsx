import { useEffect, useEffectEvent, useRef, useState, type MouseEvent } from 'react'
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'

import { INTERVAL_MS, WIDTH_SPRING } from './word-roll.constants'
import type { WordRollProps } from './word-roll.types'
import { springFor, wrap } from './word-roll.utils'
import { RollWord } from './word-roll-parts'

/**
 * A line whose last word rolls to the next one, letter by letter, while the
 * space it sits in stretches to the new width. Turns by itself or on a click.
 */
export function WordRoll(props: WordRollProps) {
  // nothing to roll without a word
  if (props.words.length === 0) return null
  return <WordRollButton {...props} />
}

function WordRollButton({
  words,
  lead,
  index,
  defaultIndex = 0,
  onIndexChange,
  autoPlay = true,
  interval = INTERVAL_MS,
  onClick,
  className,
  ...props
}: WordRollProps) {
  const reduced = useReducedMotion() ?? false
  const [uncontrolled, setUncontrolled] = useState(defaultIndex)
  const current = wrap(index === undefined ? uncontrolled : index, words.length)
  const word = words[current]
  const next = wrap(current + 1, words.length)

  // a fresh key every turn, so the new word always rolls in from below,
  // even when it is the same word again
  const [shown, setShown] = useState({ index: current, turn: 0 })
  if (shown.index !== current) setShown({ index: current, turn: shown.turn + 1 })

  const width = useMotionValue(0)
  const measured = useRef(false)

  function turnTo(target: number) {
    if (index === undefined) setUncontrolled(target)
    onIndexChange?.(target)
  }

  const turnOnTimer = useEffectEvent(() => turnTo(next))

  // waiting starts over after every turn, including one from a click
  useEffect(() => {
    if (!autoPlay || words.length < 2) return
    const timer = setTimeout(() => turnOnTimer(), interval)
    return () => clearTimeout(timer)
  }, [autoPlay, interval, words.length, current])

  useEffect(() => () => width.stop(), [width])

  function handleMeasure(target: number) {
    // the first word sits still; after that the slot stretches on a spring
    if (!measured.current) {
      measured.current = true
      width.jump(target)
      return
    }
    animate(width, target, springFor(WIDTH_SPRING, reduced))
  }

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    onClick?.(event)
    if (!event.defaultPrevented) turnTo(next)
  }

  return (
    <button
      type="button"
      data-slot="word-roll"
      aria-label={lead ? `${lead} ${word}` : word}
      onClick={handleClick}
      className={cn(
        'inline-flex cursor-pointer items-center gap-[0.26em] rounded-lg text-[length:min(44px,8.4vw)] leading-[1.25] font-semibold tracking-[-0.035em] whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
      {...props}
    >
      {lead && (
        <span aria-hidden className="text-muted-foreground">
          {lead}
        </span>
      )}
      {/* clips top and bottom only, so letters roll out of sight but can still overhang sideways */}
      <motion.span
        aria-hidden
        className="relative block h-[1.25em] text-foreground [clip-path:inset(0_-0.5em)]"
        style={{ width }}
      >
        <AnimatePresence initial={false}>
          <RollWord
            key={shown.turn}
            word={word}
            first={shown.turn === 0}
            reduced={reduced}
            onMeasure={handleMeasure}
          />
        </AnimatePresence>
      </motion.span>
    </button>
  )
}
