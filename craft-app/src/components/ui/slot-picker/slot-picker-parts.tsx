// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { CalendarCheck, CircleCheck, Sparkle } from 'lucide-react'
import { motion } from 'motion/react'

import { cn } from '@/lib/utils'

import { Button } from '../button'
import { StatusPill } from '../status-pill'
import { IconTile, Panel } from '../surface'
import { ENTER, STRIPED } from './slot-picker.constants'
import type { Slot } from './slot-picker.types'
import { dayLabel, minutes, shift } from './slot-picker.utils'

type SlotButtonProps = {
  slot: Slot
  variant: 'week' | 'day'
  active: boolean
  /** Roving tabindex: only one slot is in the tab order. */
  tabbable: boolean
  cell: string
  delta: number
  time: string
  onToggle: () => void
}

/** One time slot: a toggle button that can be busy (striped) or suggested. */
export function SlotButton({
  slot,
  variant,
  active,
  tabbable,
  cell,
  delta,
  time,
  onToggle,
}: SlotButtonProps) {
  return (
    <button
      type="button"
      data-cell={cell}
      aria-pressed={active}
      aria-disabled={slot.busy}
      aria-label={`${dayLabel(slot.day)} ${time}${slot.busy ? ', busy' : ''}${slot.suggested ? ', suggested' : ''}`}
      tabIndex={tabbable ? 0 : -1}
      onClick={() => !slot.busy && onToggle()}
      className={cn(
        'relative flex h-9 items-center justify-center gap-1.5 rounded-full px-2 font-mono text-xs tabular-nums outline-none transition-[background-color,color,scale] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:ring-[3px] focus-visible:ring-ring/50',
        variant === 'day' ? 'justify-between px-3.5' : '@max-sm:px-0.5 @max-sm:text-[0.6875rem]',
        slot.busy
          ? cn('cursor-not-allowed text-muted-foreground/60 line-through', STRIPED)
          : active
            ? 'bg-primary text-primary-foreground active:scale-[0.97]'
            : 'bg-foreground/[0.06] hover:bg-foreground/[0.1] active:scale-[0.97]',
      )}
    >
      <span className="truncate">
        {variant === 'week' ? shift(slot.start, delta) : time}
      </span>
      {variant === 'day' && (
        <span className="font-sans text-[0.6875rem] opacity-70">
          {minutes(slot.end) - minutes(slot.start)} min
        </span>
      )}
      {slot.suggested && !slot.busy && (
        <Sparkle
          fill="currentColor"
          aria-hidden="true"
          className={cn(
            'absolute top-1 right-1 size-2.5',
            active ? 'text-primary-foreground' : 'text-primary',
          )}
        />
      )}
    </button>
  )
}

type ConfirmedSummaryProps = {
  slot: Slot
  time: string
  zoneLabel: string
  onChange: () => void
}

/** The confirmed state: a summary row plus a way back. */
export function ConfirmedSummary({ slot, time, zoneLabel, onChange }: ConfirmedSummaryProps) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0, transition: ENTER }}
      >
        <Panel className="flex items-center gap-3 p-3">
          <IconTile
            icon={CalendarCheck}
            className="bg-[oklch(0.65_0.17_150)]/15 text-[oklch(0.55_0.15_150)] dark:text-[oklch(0.78_0.17_150)]"
          />
          <div className="min-w-0 flex-1">
            <p className="text-[0.9375rem] font-medium">{dayLabel(slot.day)}</p>
            <p className="font-mono text-[0.8125rem] text-muted-foreground tabular-nums">
              {time} · {zoneLabel}
            </p>
          </div>
          <StatusPill tone="positive" icon={CircleCheck}>
            Invite sent
          </StatusPill>
        </Panel>
      </motion.div>
      <div className="flex justify-end pt-1.5">
        <Button variant="ghost" size="sm" onClick={onChange}>
          Pick another time
        </Button>
      </div>
      <p role="status" aria-live="polite" className="sr-only">
        Confirmed {dayLabel(slot.day)} {time}
      </p>
    </>
  )
}
