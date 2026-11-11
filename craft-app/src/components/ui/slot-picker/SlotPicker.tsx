// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { CalendarDays, Sparkle } from 'lucide-react'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { useRef, useState } from 'react'

import { cn } from '@/lib/utils'

import { Button } from '../button'
import { Segmented } from '../segmented-control'
import { Shell, ShellHeader, Panel } from '../surface'
import { Switch } from '../switch'
import { ConfirmedSummary, SlotButton } from './slot-picker-parts'
import { EASE_OUT, EXIT, STRIPED } from './slot-picker.constants'
import type { Slot, SlotPickerProps } from './slot-picker.types'
import { dayDate, dayLabel, minutes, shift, weekday } from './slot-picker.utils'

export function SlotPicker({
  data,
  variant = 'week',
  selectedId: selectedProp,
  onSelect,
  onConfirm,
  confirmedId: confirmedProp,
  onChange,
  className,
}: SlotPickerProps) {
  const [innerSelected, setInnerSelected] = useState<string | null>(null)
  const selectedId = selectedProp !== undefined ? selectedProp : innerSelected
  const [innerConfirmed, setInnerConfirmed] = useState<string | null>(null)
  const confirmedId = confirmedProp !== undefined ? confirmedProp : innerConfirmed
  const [theirs, setTheirs] = useState(false)
  const days = [...new Set(data.slots.map((s) => s.day))].sort()
  // The day tab follows the selected slot until the viewer picks a day.
  const [pickedDay, setPickedDay] = useState<string | null>(null)
  const grid = useRef<HTMLDivElement>(null)

  const zone = theirs && data.attendeeZone ? data.attendeeZone : data.timeZone
  const delta = zone.offset - data.timeZone.offset
  const time = (s: Slot) => `${shift(s.start, delta)}–${shift(s.end, delta)}`
  const selected = data.slots.find((s) => s.id === selectedId)
  const activeDay = pickedDay ?? selected?.day ?? days[0]
  const confirmed = data.slots.find((s) => s.id === confirmedId)

  const select = (slot: Slot | null) => {
    setInnerSelected(slot?.id ?? null)
    onSelect?.(slot)
  }

  const columns = (variant === 'week' ? days.slice(0, 5) : [activeDay]).map((day) =>
    data.slots
      .filter((s) => s.day === day)
      .sort((a, b) => minutes(a.start) - minutes(b.start)),
  )

  // Arrow keys move between slots like a grid: up/down within a day, left/right across days.
  const onKeyDown = (e: React.KeyboardEvent) => {
    const move = {
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
    }[e.key]
    const at = (document.activeElement as HTMLElement | null)?.dataset.cell
      ?.split(':')
      .map(Number)
    if (!move || !at) return
    e.preventDefault()
    const col = Math.min(Math.max(at[0] + move[0], 0), columns.length - 1)
    const row = Math.min(Math.max(at[1] + move[1], 0), columns[col].length - 1)
    grid.current?.querySelector<HTMLElement>(`[data-cell="${col}:${row}"]`)?.focus()
  }

  if (confirmed) {
    return (
      <MotionConfig reducedMotion="user">
        <Shell
          data-slot="slot-picker"
          aria-label="Meeting time"
          className={cn('max-w-md', className)}
        >
          <ConfirmedSummary
            slot={confirmed}
            time={time(confirmed)}
            zoneLabel={zone.label}
            onChange={() => {
              setInnerConfirmed(null)
              onChange?.()
            }}
          />
        </Shell>
      </MotionConfig>
    )
  }

  return (
    <MotionConfig reducedMotion="user">
      <Shell
        data-slot="slot-picker"
        aria-label={data.title ?? 'Pick a time'}
        className={cn('max-w-xl', className)}
      >
        <ShellHeader
          icon={CalendarDays}
          title={data.title ?? 'Pick a time'}
          subtitle={`Times in ${zone.label}`}
          aside={
            data.attendeeZone && (
              <label className="flex cursor-pointer items-center gap-2 text-[0.8125rem] text-muted-foreground">
                <Switch size="sm" checked={theirs} onCheckedChange={setTheirs} />
                Their time
              </label>
            )
          }
        />
        <Panel className="p-3">
          {variant === 'day' && (
            <Segmented
              label="Day"
              size="sm"
              className="mb-3"
              value={activeDay}
              onValueChange={(d) => setPickedDay(d)}
              options={days.map((d) => ({
                value: d,
                label: dayLabel(d).replace(/,.*/, ''),
              }))}
            />
          )}
          <div
            ref={grid}
            role="group"
            aria-label="Available times"
            onKeyDown={onKeyDown}
            className={cn(
              'grid gap-2',
              variant === 'week' ? 'grid-cols-5 @max-sm:gap-1' : 'grid-cols-1',
            )}
          >
            {columns.map((slots, col) => (
              <div
                key={col}
                role="group"
                aria-label={dayLabel(slots[0]?.day ?? days[col])}
                className="flex min-w-0 flex-col gap-1.5"
              >
                {variant === 'week' && (
                  <p
                    aria-hidden="true"
                    className="pb-1 text-center text-xs text-muted-foreground"
                  >
                    <span className="block font-medium text-foreground">
                      {weekday(slots[0]?.day ?? days[col])}
                    </span>
                    {dayDate(slots[0]?.day ?? days[col]).getDate()}
                  </p>
                )}
                {slots.map((slot, row) => (
                  <SlotButton
                    key={slot.id}
                    slot={slot}
                    variant={variant}
                    active={slot.id === selectedId}
                    tabbable={
                      slot.id === selectedId || (!selectedId && col === 0 && row === 0)
                    }
                    cell={`${col}:${row}`}
                    delta={delta}
                    time={time(slot)}
                    onToggle={() => select(slot.id === selectedId ? null : slot)}
                  />
                ))}
              </div>
            ))}
          </div>
          <p className="mt-3 flex items-center gap-3 px-1 text-[0.6875rem] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Sparkle fill="currentColor" aria-hidden="true" className="size-3 text-primary" />{' '}
              Suggested
            </span>
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true" className={cn('h-2 w-3 rounded-sm', STRIPED)} /> Busy
            </span>
          </p>
        </Panel>
        <AnimatePresence initial={false}>
          {selected && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: 'auto',
                opacity: 1,
                transition: { duration: 0.22, ease: EASE_OUT },
              }}
              exit={{ height: 0, opacity: 0, transition: EXIT }}
              className="overflow-hidden"
            >
              <div className="flex items-center justify-between gap-3 pt-1.5 pr-px pb-px pl-3">
                <p className="min-w-0 truncate text-[0.8125rem]">
                  <span className="font-medium">{dayLabel(selected.day)}</span>{' '}
                  <span className="font-mono text-muted-foreground tabular-nums">
                    {time(selected)}
                  </span>
                </p>
                <Button
                  size="sm"
                  onClick={() => {
                    setInnerConfirmed(selected.id)
                    onConfirm?.(selected)
                  }}
                >
                  Confirm
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <p role="status" aria-live="polite" className="sr-only">
          {selected ? `Selected ${dayLabel(selected.day)} ${time(selected)}` : ''}
        </p>
      </Shell>
    </MotionConfig>
  )
}
