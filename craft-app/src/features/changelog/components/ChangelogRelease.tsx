import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown } from 'lucide-react'

import { INSTANT, SMOOTH, SNAPPY, VISIBLE_CARDS, commitUrl } from '../changelog.constants'
import type { ChangelogEntry } from '../changelog.types'
import { formatDay } from '../changelog.utils'

import { ChangelogComponentCard } from './ChangelogComponentCard'

const GRID = 'grid gap-3 sm:grid-cols-2'

/** One commit: date and hash on the left, the added components as cards on the right. */
export function ChangelogRelease({ entry, reduce }: { entry: ChangelogEntry; reduce: boolean }) {
  const panelId = useId()
  const [expanded, setExpanded] = useState(false)
  const shown = entry.components.slice(0, VISIBLE_CARDS)
  const rest = entry.components.slice(VISIBLE_CARDS)
  const count = entry.components.length

  return (
    <article className="grid gap-3 py-8 md:grid-cols-[7rem_1fr] md:gap-6">
      <div className="flex items-baseline gap-3 md:flex-col md:gap-1">
        <time dateTime={entry.date} className="text-sm font-medium">
          {formatDay(entry.date)}
        </time>
        <a
          href={commitUrl(entry.commit)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded font-mono text-xs text-muted-foreground outline-none transition-colors duration-150 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          {entry.commit}
        </a>
      </div>

      <div className="min-w-0">
        <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
          New · {count} {count === 1 ? 'component' : 'components'}
        </p>
        <h3 className="mt-1 mb-4 text-lg font-medium tracking-tight text-balance">
          {entry.summary}
        </h3>

        <ul className={GRID}>
          {shown.map((component) => (
            <li key={component.slug}>
              <ChangelogComponentCard component={component} />
            </li>
          ))}
        </ul>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="rest"
              id={panelId}
              className="overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={reduce ? INSTANT : SMOOTH}
            >
              <ul className={`${GRID} pt-3`}>
                {rest.map((component) => (
                  <li key={component.slug}>
                    <ChangelogComponentCard component={component} />
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {rest.length > 0 && (
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls={panelId}
            onClick={() => setExpanded((open) => !open)}
            className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm text-muted-foreground outline-none transition-[color,background-color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97]"
          >
            {expanded ? 'Show less' : `Show ${rest.length} more`}
            <motion.span
              aria-hidden="true"
              initial={false}
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={reduce ? INSTANT : SNAPPY}
              className="inline-flex"
            >
              <ChevronDown className="size-4" />
            </motion.span>
          </button>
        )}
      </div>
    </article>
  )
}
