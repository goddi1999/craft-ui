import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CalendarDays } from 'lucide-react'

import { cn } from '@/lib/utils'

import {
  calendarWidgetAgendaVariants,
  calendarWidgetVariants,
} from './calendar-widget-variants'
import type { CalendarWidgetProps } from './calendar-widget.types'
import { buildCalendarDays } from './calendar-widget.utils'
import { useDragScroll } from './use-drag-scroll'

const DEFAULT_DAY_COUNT = 92

export function CalendarWidget({
  events,
  startDate,
  dayCount = DEFAULT_DAY_COUNT,
  defaultSelectedDate,
  size = 'default',
  onSelectDate,
  className,
}: CalendarWidgetProps) {
  const [selectedDate, setSelectedDate] = useState(
    defaultSelectedDate ?? startDate,
  )

  const scrollRef = useDragScroll<HTMLDivElement>()

  const days = buildCalendarDays(startDate, dayCount)
  const selectedDay = days.find((day) => day.key === selectedDate)
  const monthLabel = selectedDay?.monthLabel ?? days[0]?.monthLabel ?? ''
  const selectedEvents = events[selectedDate] ?? []

  const handleSelectDate = (date: string) => {
    setSelectedDate(date)
    onSelectDate?.(date)
  }

  return (
    <div className={cn(calendarWidgetVariants({ size }), className)}>
      <div className="p-4">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={monthLabel}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.25 }}
            className="ml-2 text-xl font-semibold dark:text-white"
          >
            {monthLabel}
          </motion.div>
        </AnimatePresence>

        <div
          ref={scrollRef}
          className="flex touch-pan-x gap-2 overflow-x-auto px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {days.map((day) => {
            const isSelected = selectedDate === day.key
            const hasEvent = (events[day.key]?.length ?? 0) > 0

            return (
              <div
                key={day.key}
                className="relative flex min-w-10 flex-col items-center pt-4"
              >
                <div
                  className={cn(
                    'mb-1 text-base font-medium transition-colors duration-300',
                    isSelected
                      ? 'text-black dark:text-white'
                      : 'text-gray-500 dark:text-zinc-500',
                  )}
                >
                  {day.weekdayLabel}
                </div>

                <motion.button
                  type="button"
                  aria-pressed={isSelected}
                  className="relative flex cursor-pointer flex-col items-center"
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleSelectDate(day.key)}
                >
                  <div className="relative flex h-10 w-10 items-center justify-center">
                    {isSelected && (
                      <motion.div
                        layoutId="calendar-widget-selected-day"
                        transition={{
                          type: 'spring',
                          stiffness: 180,
                          damping: 22,
                        }}
                        className="absolute inset-0 rounded-full bg-white shadow-sm dark:bg-zinc-800"
                      />
                    )}
                    <span
                      className={cn(
                        'relative z-10 text-base font-medium',
                        isSelected
                          ? 'text-black dark:text-white'
                          : 'text-black/80 dark:text-zinc-400',
                      )}
                    >
                      {day.dayOfMonth}
                    </span>
                  </div>

                  <AnimatePresence mode="popLayout" initial={false}>
                    {hasEvent && !isSelected && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 0, filter: 'blur(4px)' }}
                        transition={{ duration: 0.3 }}
                        className="h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[#cecdd1] will-change-transform dark:bg-zinc-700"
                      />
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            )
          })}
        </div>
      </div>

      <div className={calendarWidgetAgendaVariants({ size })}>
        <div className="relative h-full overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            {selectedEvents.length > 0 ? (
              <motion.ul key="agenda" className="pb-8">
                {selectedEvents.map((event) => (
                  <motion.li
                    key={`${event.title}-${event.time}`}
                    initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="flex flex-col border-b border-gray-200 py-2 last:border-b-0 dark:border-zinc-800"
                  >
                    <span className="text-base font-medium text-black/70 dark:text-zinc-300">
                      {event.title}
                    </span>
                    <span className="text-base text-gray-500 dark:text-zinc-500">
                      {event.time}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="flex h-40 flex-col items-center justify-center gap-3"
              >
                <div className="rounded-full bg-zinc-100 p-5 dark:bg-zinc-800">
                  <CalendarDays className="size-8 text-zinc-500 dark:text-zinc-300" />
                </div>
                <p className="text-sm text-neutral-500 dark:text-zinc-500">
                  No events
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-16 rounded-b-[30px] bg-gradient-to-t from-white via-white/70 to-transparent dark:from-zinc-950 dark:via-zinc-950/20" />
      </div>
    </div>
  )
}
