import { Slot } from '@radix-ui/react-slot'
import { X } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'

import { cn } from '@/lib/utils'

import { BurstEmoji } from './emoji-reaction-burst'
import { Emoji } from './emoji-reaction-emoji'
import { SmileIcon } from './emoji-reaction-smile-icon'
import {
  BURST_COUNT,
  DEFAULT_EMOJI_DATA,
  DEFAULT_EMOJIS,
  HOLD_INTERVAL,
  MAX_PARTICLES,
  SIZES,
  SURFACE,
} from './emoji-reaction.constants'
import type { EmojiReactionProps, Particle, Placement } from './emoji-reaction.types'
import { getPlacement, makeParticles, toLabel } from './emoji-reaction.utils'

/**
 * A tapback-style reaction button. It opens a bar of Apple emoji; picking one
 * sends copies floating up out of it, and holding keeps them coming. Press
 * and drag from the trigger to pick in one gesture.
 */
export function EmojiReaction({
  emojis = DEFAULT_EMOJIS,
  emojiData = DEFAULT_EMOJI_DATA,
  onReact,
  size = 'md',
  align = 'center',
  asChild = false,
  defaultOpen = false,
  className,
  children,
  ...props
}: EmojiReactionProps) {
  const s = SIZES[size]
  const reduced = useReducedMotion()

  const [open, setOpen] = useState(defaultOpen)
  const [last, setLast] = useState<string | null>(null)
  const [particles, setParticles] = useState<Particle[]>([])
  const [placement, setPlacement] = useState<Placement>({
    side: 'top',
    shift: 0,
    tailX: 0,
  })
  const [activeIndex, setActiveIndex] = useState(0)

  const rootRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const seed = useRef(0)
  const hold = useRef<number | null>(null)
  const justOpened = useRef(false)
  // focus follows a closed → open change only, so an initially open bar never pulls focus (or the page scroll)
  const wasOpen = useRef(defaultOpen)

  // measuring in ref callbacks, not an effect, so it cannot cascade an extra render pass
  const measure = useCallback(() => {
    const bar = barRef.current
    const trigger = triggerRef.current
    if (!bar || !trigger) return
    const next = getPlacement(
      trigger.getBoundingClientRect(),
      bar.offsetWidth,
      bar.offsetHeight,
      align,
    )
    // Slot re-composes refs every render, so an unchanged placement must bail out or it loops
    setPlacement((prev) =>
      prev.side === next.side && prev.shift === next.shift && prev.tailX === next.tailX
        ? prev
        : next,
    )
  }, [align])

  // the bar attaches before the trigger on mount, so whichever lands second measures
  const placeBar = useCallback(
    (node: HTMLDivElement | null) => {
      barRef.current = node
      measure()
    },
    [measure],
  )

  // stable per align, an inline callback detaches every commit and is null when placeBar runs
  const setTriggerRef = useCallback(
    (node: HTMLElement | null) => {
      triggerRef.current = node
      measure()
    },
    [measure],
  )

  const stopHold = useCallback(() => {
    if (hold.current === null) return
    window.clearInterval(hold.current)
    hold.current = null
  }, [])

  // closing unmounts the copies mid flight, so their completion never fires
  const closeBar = useCallback(() => {
    stopHold()
    setOpen(false)
    setParticles([])
  }, [stopHold])

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: globalThis.PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) closeBar()
    }
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Escape') return
      closeBar()
      triggerRef.current?.focus()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, closeBar])

  useEffect(() => {
    const opened = open && !wasOpen.current
    wasOpen.current = open
    if (opened) itemRefs.current[0]?.focus()
  }, [open])

  const sendReaction = useCallback(
    (name: string, from: DOMRect) => {
      setLast(name)
      onReact?.(name)

      const bar = barRef.current?.getBoundingClientRect()
      if (reduced || !bar) return
      seed.current += BURST_COUNT
      setParticles((prev) =>
        [...prev, ...makeParticles(name, seed.current, from, bar)].slice(-MAX_PARTICLES),
      )
    },
    [onReact, reduced],
  )

  const startHold = useCallback(
    (name: string, from: DOMRect) => {
      sendReaction(name, from)
      stopHold()
      hold.current = window.setInterval(() => sendReaction(name, from), HOLD_INTERVAL)
    },
    [sendReaction, stopHold],
  )

  useEffect(() => stopHold, [stopHold])

  const settle = useCallback((id: number) => {
    setParticles((prev) => prev.filter((particle) => particle.id !== id))
  }, [])

  // press the trigger and drag along the bar, releasing over an emoji picks it
  const handleTriggerPointerDown = useCallback(() => {
    if (open) return
    setOpen(true)
    justOpened.current = true

    const handleUp = (event: globalThis.PointerEvent) => {
      document.removeEventListener('pointerup', handleUp)

      const target = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement | null

      const picked = target?.closest<HTMLElement>('[data-emoji]')
      if (picked?.dataset.emoji) {
        sendReaction(picked.dataset.emoji, picked.getBoundingClientRect())
      }

      // releasing off the trigger fires no click, so nothing else would clear the guard
      if (!triggerRef.current?.contains(target)) justOpened.current = false
    }

    document.addEventListener('pointerup', handleUp)
  }, [open, sendReaction])

  const handleTriggerClick = () => {
    if (justOpened.current) {
      justOpened.current = false
      return
    }
    if (open) closeBar()
    else setOpen(true)
  }

  const handleMenuKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const count = emojis.length
      let next = activeIndex

      if (event.key === 'ArrowRight') next = (activeIndex + 1) % count
      else if (event.key === 'ArrowLeft') next = (activeIndex - 1 + count) % count
      else if (event.key === 'Home') next = 0
      else if (event.key === 'End') next = count - 1
      else return

      event.preventDefault()
      setActiveIndex(next)
      itemRefs.current[next]?.focus()
    },
    [activeIndex, emojis.length],
  )

  const burst = particles.map((particle) => (
    <BurstEmoji key={particle.id} particle={particle} size={s.burst} data={emojiData} onDone={settle} />
  ))

  const Trigger = asChild ? Slot : 'button'

  const top = placement.side === 'top'
  const anchor = align === 'left' ? 'left-0' : align === 'right' ? 'right-0' : 'left-1/2'
  const centering = align === 'center' ? '-50%' : 0
  // right anchored bars pin their right edge, so a left margin cannot move them
  const nudge = align === 'right' ? { marginRight: -placement.shift } : { marginLeft: placement.shift }

  const triggerLabel = open
    ? 'Close reactions'
    : last
      ? `Reacted ${toLabel(last)}`
      : 'Add a reaction'

  return (
    <div
      ref={rootRef}
      data-slot="emoji-reaction"
      className={cn('relative flex w-fit items-center', className)}
      {...props}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            className={cn('absolute z-30', anchor, top ? 'bottom-full mb-4' : 'top-full mt-4')}
            initial={{
              opacity: 0,
              y: top ? 10 : -10,
              scale: 0.85,
              x: centering,
            }}
            animate={{ opacity: 1, y: 0, scale: 1, x: centering }}
            exit={{ opacity: 0, y: top ? 6 : -6, scale: 0.9, x: centering }}
            transition={reduced ? { duration: 0.15 } : { type: 'spring', stiffness: 520, damping: 30 }}
            style={{ originY: top ? 1 : 0, ...nudge }}
          >
            <div
              ref={placeBar}
              data-slot="emoji-reaction-bar"
              role="menu"
              aria-label="Pick a reaction"
              aria-orientation="horizontal"
              onKeyDown={handleMenuKeyDown}
              className={cn('relative flex items-center rounded-full', SURFACE, s.pill)}
            >
              {burst}

              {emojis.map((name, i) => (
                <motion.button
                  key={`${name}-${i}`}
                  ref={(node) => {
                    itemRefs.current[i] = node
                  }}
                  type="button"
                  role="menuitem"
                  tabIndex={i === activeIndex ? 0 : -1}
                  data-emoji={name}
                  aria-label={toLabel(name)}
                  onFocus={() => setActiveIndex(i)}
                  onPointerDown={(event) => startHold(name, event.currentTarget.getBoundingClientRect())}
                  onPointerUp={stopHold}
                  onPointerLeave={stopHold}
                  onPointerCancel={stopHold}
                  // detail is 0 only for keyboard, pointer already fired above
                  onClick={(event) =>
                    event.detail === 0 && sendReaction(name, event.currentTarget.getBoundingClientRect())
                  }
                  className="relative z-10 rounded-full p-1 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  initial={reduced ? false : { scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 800,
                    damping: 25,
                    delay: reduced ? 0 : 0.04 + i * 0.035,
                  }}
                  whileHover={reduced ? undefined : { scale: 1.28, y: -4 }}
                  whileTap={{ scale: 0.92 }}
                >
                  <Emoji name={name} data={emojiData} size={s.emoji} />
                </motion.button>
              ))}
            </div>

            <span
              aria-hidden
              className={cn(
                'absolute size-3 -translate-x-1/2 rounded-full',
                SURFACE,
                top ? '-bottom-1' : '-top-1',
              )}
              style={{ left: placement.tailX }}
            />
            <span
              aria-hidden
              className={cn(
                'absolute size-1.5 -translate-x-1/2 rounded-full',
                SURFACE,
                top ? '-bottom-4' : '-top-4',
              )}
              style={{ left: placement.tailX + 6 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Trigger
        ref={setTriggerRef}
        data-slot="emoji-reaction-trigger"
        type={asChild ? undefined : 'button'}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={triggerLabel}
        onPointerDown={handleTriggerPointerDown}
        onClick={handleTriggerClick}
        className={
          asChild
            ? undefined
            : cn(
                'relative z-10 grid place-items-center rounded-full text-foreground/60 transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                SURFACE,
                s.trigger,
              )
        }
      >
        {asChild ? (
          children
        ) : open ? (
          <X className={s.icon} strokeWidth={2} />
        ) : last ? (
          <Emoji name={last} data={emojiData} size={s.emoji * 0.72} />
        ) : (
          <SmileIcon className={s.icon} />
        )}
      </Trigger>
    </div>
  )
}
