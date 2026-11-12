import { useReducedMotion } from 'motion/react'
import { useState } from 'react'

import { cn } from '@/lib/utils'

import { LIST_HEIGHT, ROW_GAP, ROW_HEIGHT } from './expand-card.constants'
import { ExpandCardRow, type RowState } from './expand-card-parts'
import type { ExpandCardProps } from './expand-card.types'

/**
 * A short list of rows. Open one and it rides to the top and grows into a card:
 * the photo widens into a cover, the title slides under it and the details fade
 * in, while the other rows fall away. Open it again, or press Escape, to fold it back.
 */
export function ExpandCard({
  items,
  value,
  defaultValue = null,
  onValueChange,
  onAction,
  className,
  style,
  ...props
}: ExpandCardProps) {
  const reduced = useReducedMotion() ?? false
  const [uncontrolled, setUncontrolled] = useState(defaultValue)
  const isControlled = value !== undefined
  const openId = isControlled ? value : uncontrolled
  const openIndex = items.findIndex((item) => item.id === openId)

  // the last card opened stays above the others while it folds back
  const [front, setFront] = useState(openId)
  if (openIndex >= 0 && front !== openId) setFront(openId)

  const stack = items.length * ROW_HEIGHT + Math.max(0, items.length - 1) * ROW_GAP
  const height = Math.max(LIST_HEIGHT, stack)
  const pad = (height - stack) / 2

  const select = (id: string | null) => {
    if (!isControlled) setUncontrolled(id)
    onValueChange?.(id)
  }

  const stateOf = (index: number): RowState => {
    if (openIndex < 0) return 'rest'
    if (index === openIndex) return 'open'
    return index < openIndex ? 'above' : 'below'
  }

  return (
    <div
      data-slot="expand-card"
      className={cn('relative w-80 max-w-full', className)}
      style={{ height, ...style }}
      {...props}
    >
      {items.map((item, index) => (
        <ExpandCardRow
          key={item.id}
          item={item}
          state={stateOf(index)}
          home={pad + index * (ROW_HEIGHT + ROW_GAP)}
          front={item.id === front}
          reduced={reduced}
          onToggle={() => select(index === openIndex ? null : item.id)}
          onAction={onAction}
        />
      ))}
    </div>
  )
}
