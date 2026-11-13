import { motion } from 'motion/react'
import type { CSSProperties } from 'react'

import { TaskCheck } from '@/components/ui/task-list'
import { cn } from '@/lib/utils'

import { BAR_MS, EASE_OUT, EMBERS, SIZE } from './streak-widget.constants'
import type { StreakSize } from './streak-widget.types'
import { clamp01, pluralDays } from './streak-widget.utils'

// matt: flat surfaces, no sheen or inner highlights
const TILE = 'rounded-[22px] bg-muted'

const FLAME =
  'M12 1.8c.7 2.4 2.1 3.8 3.6 5 .5-1 .8-2.1.7-3.3 2.7 2 4.7 5.2 4.7 8.9A9 9 0 0 1 3 12.6c0-3.7 2-6.9 4.8-8.8.2 1.5.8 2.7 1.7 3.5C10.6 5.8 11.4 4 12 1.8Z'
const CORE =
  'M12.3 10.6c2.2 1.6 3.6 3.4 3.6 5.4a3.9 3.9 0 0 1-7.8 0c0-1.2.5-2.3 1.3-3.2.3.7.9 1.2 1.5 1.5.2-1.4.6-2.6 1.4-3.7Z'

/** A flat two-tone flame: a solid body and a pale core. */
function FlameGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path fill="var(--streak)" d={FLAME} />
      <path fill="var(--streak-soft)" d={CORE} />
    </svg>
  )
}

/** Small flat teardrops drifting up off the flame. */
function Embers() {
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 motion-reduce:hidden">
      {EMBERS.map((ember) => (
        <motion.svg
          key={ember.left}
          viewBox="0 0 10 14"
          className="absolute overflow-visible"
          style={{ left: `${ember.left}%`, top: `${ember.top}%`, width: `${ember.size}%` }}
          animate={{
            opacity: [0, 0.8, 0],
            transform: ['translateY(30%)', 'translateY(-10%)', 'translateY(-60%)'],
          }}
          transition={{ duration: 2.4, repeat: Infinity, delay: ember.delay, ease: 'easeOut' }}
        >
          <path fill="var(--streak)" d="M5 0C7 4 10 6.5 10 9.2A5 5 0 0 1 0 9.2C0 6.5 3 4 5 0Z" />
        </motion.svg>
      ))}
    </span>
  )
}

/** The flame, the day count and its label. */
export function StreakTile({
  days,
  label,
  size,
  className,
}: {
  days: number
  label: string
  size: StreakSize
  className?: string
}) {
  const scale = SIZE[size]
  return (
    <div
      className={cn(
        TILE,
        'flex flex-col items-center justify-center text-center',
        scale.tile,
        className,
      )}
    >
      <span className={cn('relative mb-1.5 shrink-0', scale.flame)}>
        {/* the only glow: a faint pool of the colour behind the flame, as Agent Bot does */}
        <span
          aria-hidden
          className="absolute inset-[-90%] bg-[radial-gradient(circle_at_50%_50%,var(--streak-glow),transparent_58%)]"
        />
        <FlameGlyph className="relative size-full" />
        {scale.embers && <Embers />}
      </span>
      <p
        className={cn(
          'leading-none font-bold tracking-tight text-(--streak) tabular-nums',
          scale.count,
        )}
      >
        {pluralDays(days)}
      </p>
      <p className={cn('font-medium text-(--streak) opacity-75', scale.label)}>{label}</p>
    </div>
  )
}

/** Today's count over the goal, and a bar that fills toward it with a soft glow behind. */
export function GoalBar({ value, goal }: { value: number; goal: number }) {
  const progress = goal > 0 ? clamp01(value / goal) : 0
  return (
    <div className="flex flex-col gap-3">
      <p className="flex items-baseline gap-1.5 tabular-nums">
        <span className="text-4xl leading-none font-medium tracking-tight">{value}</span>
        <span className="text-xl text-muted-foreground">/ {goal}</span>
      </p>
      <div
        role="progressbar"
        aria-label="Today's progress"
        aria-valuemin={0}
        aria-valuemax={goal}
        aria-valuenow={value}
        className="relative h-7 rounded-full bg-muted"
      >
        {/* the glow sits on a wrapper so the clip that shapes the fill doesn't cut it off */}
        <div
          aria-hidden
          className="absolute inset-0 drop-shadow-[0_0_12px_color-mix(in_srgb,var(--color-foreground)_30%,transparent)]"
        >
          <div
            className="size-full rounded-full bg-foreground motion-reduce:transition-none"
            style={{
              clipPath: `inset(0 ${(1 - progress) * 100}% 0 0 round 999px)`,
              transition: `clip-path ${BAR_MS}ms ${EASE_OUT}`,
            }}
          />
        </div>
      </div>
    </div>
  )
}

const noop = () => {}

/** The week's days, ticked with Task List's own check once the goal was met. */
export function WeekRow({ week, weekdays }: { week: boolean[]; weekdays: readonly string[] }) {
  return (
    <ol
      className={cn(TILE, 'grid grid-cols-7 gap-1.5 px-3 py-4 sm:px-5')}
      style={{ '--task-accent': 'var(--streak)' } as CSSProperties}
    >
      {weekdays.map((day, index) => {
        const done = week[index] === true
        return (
          <li key={day} className="flex min-w-0 flex-col items-center gap-2">
            <TaskCheck filled={done} size="lg" onDrawn={noop} />
            <span className="w-full truncate text-center text-sm">{day}</span>
            <span className="sr-only">{done ? 'goal met' : 'not yet'}</span>
          </li>
        )
      })}
    </ol>
  )
}
