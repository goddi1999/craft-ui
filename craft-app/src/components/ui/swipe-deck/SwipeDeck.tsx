import { Check, X } from 'lucide-react'
import { useReducedMotion } from 'motion/react'
import { useId } from 'react'

import { cn } from '@/lib/utils'

import { THRESHOLD } from './swipe-deck.constants'
import { DeckCard } from './swipe-deck-parts'
import type { SwipeDeckProps } from './swipe-deck.types'
import { cardLabel } from './swipe-deck.utils'
import { useSwipeDeck } from './use-swipe-deck'

const ACTION =
  'grid size-12 place-items-center rounded-full outline-none transition-transform duration-150 focus-visible:ring-2 focus-visible:ring-ring active:scale-90 disabled:opacity-40 disabled:active:scale-100 motion-reduce:active:scale-100'

/**
 * A stack of cards you throw left or right. The top card follows the pointer and
 * tilts around where you grabbed it, the cards behind rise as you drag, and a
 * thrown card flies off and rejoins at the back.
 */
export function SwipeDeck({
  items,
  onSwipe,
  threshold = THRESHOLD,
  leftLabel = 'Skip',
  rightLabel = 'Save',
  showControls = true,
  className,
  ...props
}: SwipeDeckProps) {
  const reduced = useReducedMotion() ?? false
  const hintId = useId()
  const deck = useSwipeDeck({
    items,
    threshold,
    reduced,
    labels: { left: leftLabel, right: rightLabel },
    onSwipe,
  })
  const { top } = deck

  return (
    <div
      data-slot="swipe-deck"
      className={cn('flex flex-col items-center gap-6', className)}
      {...props}
    >
      <div
        role="group"
        tabIndex={0}
        aria-roledescription="card deck"
        aria-label={top ? cardLabel(top) : 'No cards'}
        aria-describedby={hintId}
        aria-keyshortcuts="ArrowLeft ArrowRight"
        onKeyDown={deck.handleKeyDown}
        className="relative h-[296px] w-64 rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {items.map((item, position) => (
          <DeckCard
            key={item.id}
            item={item}
            index={deck.order.indexOf(item.id)}
            accent={position % 3}
            isTop={item === top}
            lift={deck.lift}
            threshold={threshold}
            reduced={reduced}
            leftLabel={leftLabel}
            rightLabel={rightLabel}
            register={deck.register}
            onPointerDown={deck.handlePointerDown}
            onPointerMove={deck.handlePointerMove}
            onPointerUp={deck.handlePointerUp}
          />
        ))}
      </div>

      {showControls ? (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => deck.throwTop(-1)}
            disabled={!top}
            aria-label={top ? `${leftLabel} ${top.title}` : leftLabel}
            className={cn(ACTION, 'bg-muted text-foreground')}
          >
            <X className="size-5" strokeWidth={2.2} aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => deck.throwTop(1)}
            disabled={!top}
            aria-label={top ? `${rightLabel} ${top.title}` : rightLabel}
            className={cn(ACTION, 'bg-primary text-primary-foreground')}
          >
            <Check className="size-5" strokeWidth={2.2} aria-hidden />
          </button>
        </div>
      ) : null}

      <p id={hintId} className="sr-only">
        {`Drag the top card, or press the left arrow to ${leftLabel.toLowerCase()} and the right arrow to ${rightLabel.toLowerCase()}.`}
      </p>
      <p role="status" aria-live="polite" className="sr-only">
        {deck.status}
      </p>
    </div>
  )
}
