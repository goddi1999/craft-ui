import { useRef } from 'react'

import { cn } from '@/lib/utils'

import { ScrollDrivenIndexList } from './ScrollDrivenIndexList'
import type { ScrollDrivenIndexPanelProps } from './scroll-driven-index.types'
import { ScrollDrivenIndexTriggerDetails } from './ScrollDrivenIndexTriggerDetails'
import { usePopoverSizeFallback } from './use-popover-size-fallback'

export function ScrollDrivenIndexPanel({
  popoverId,
  label,
  items,
  className,
}: ScrollDrivenIndexPanelProps) {
  const popoverRef = useRef<HTMLDivElement>(null)
  usePopoverSizeFallback(popoverRef)

  return (
    <div
      ref={popoverRef}
      id={popoverId}
      popover="auto"
      data-slot="scroll-driven-index-panel"
      className={cn(className)}
    >
      <div className="scroll-driven-index__contents">
        <button
          type="button"
          popoverTarget={popoverId}
          popoverTargetAction="hide"
        >
          <ScrollDrivenIndexTriggerDetails label={label} />
        </button>
        <ScrollDrivenIndexList items={items} popoverId={popoverId} />
      </div>
    </div>
  )
}
