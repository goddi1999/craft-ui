import { useMemo } from 'react'
import { useReducedMotion } from 'motion/react'

import type { ChangelogEntry } from '../changelog.types'
import { groupByMonth } from '../changelog.utils'
import { useActiveMonth } from '../hooks/useActiveMonth'

import { ChangelogMonthBar } from './ChangelogMonthBar'
import { ChangelogRelease } from './ChangelogRelease'

/**
 * Release notes grouped by month under a sticky month bar.
 * Layout and motion adapted from the Arc changelog feed (https://uiarc.dev, MIT, Elia Kuratli).
 */
export function ChangelogFeed({ entries }: { entries: ChangelogEntry[] }) {
  const reduce = useReducedMotion() ?? false
  const months = useMemo(() => groupByMonth(entries), [entries])
  const keys = useMemo(() => months.map((month) => month.key), [months])
  const { active, bar, register, jumpTo } = useActiveMonth(keys)

  return (
    <div>
      <ChangelogMonthBar
        ref={bar}
        months={months}
        active={active}
        reduce={reduce}
        onJump={(key) => jumpTo(key, reduce)}
      />
      {months.map((month) => (
        <section
          key={month.key}
          ref={register(month.key)}
          aria-labelledby={`month-${month.key}`}
          className="scroll-mt-32 pt-10"
        >
          <h2
            id={`month-${month.key}`}
            className="flex items-baseline justify-between border-b pb-3 text-sm font-medium"
          >
            {month.label}
            <span className="text-xs font-normal text-muted-foreground tabular-nums">
              {month.count} {month.count === 1 ? 'component' : 'components'}
            </span>
          </h2>
          <div className="divide-y">
            {month.entries.map((entry) => (
              <ChangelogRelease key={entry.commit} entry={entry} reduce={reduce} />
            ))}
          </div>
        </section>
      ))}
      <p className="py-12 text-center text-sm text-muted-foreground">
        That is everything since the first component in {months.at(-1)?.label}.
      </p>
    </div>
  )
}
