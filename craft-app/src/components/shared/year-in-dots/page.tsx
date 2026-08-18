import { useState } from 'react'

import YearInDots from './YearInDots'

const YEARS = [
  { year: 2021, comments: 412 },
  { year: 2022, comments: 1180 },
  { year: 2023, comments: 864 },
  { year: 2024, comments: 1536 },
  { year: 2025, comments: 973 },
]

const MAX = Math.max(...YEARS.map((entry) => entry.comments))
const TOTAL = YEARS.reduce((sum, entry) => sum + entry.comments, 0)

export function YearInDotsPage() {
  const [selected, setSelected] = useState(2024)

  return (
    <div className="min-h-svh bg-background px-4 py-16 text-foreground">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-12">
        <header className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            shared / year-in-dots
          </p>
          <h1 className="mt-3 text-4xl font-medium tracking-tight">
            Year in dots
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
            One dot per day of the year, filled in proportion to that year&apos;s
            share of activity. Select a year to compare.
          </p>
        </header>

        <section className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {YEARS.map((entry) => (
            <YearInDots
              key={entry.year}
              className="w-full max-w-72"
              year={entry.year}
              comments={entry.comments}
              maxComments={MAX}
              totalComments={TOTAL}
              selected={selected === entry.year}
              onClick={() => setSelected(entry.year)}
            />
          ))}
        </section>
      </div>
    </div>
  )
}
