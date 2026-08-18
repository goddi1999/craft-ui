import { useState } from 'react'

import { DemoControlGroup, DemoPanel } from '@/components/shared/demo-controls'

import GithubActivityCard from './GithubCalendar'

const SCHEMES = [
  'green',
  'blue',
  'purple',
  'orange',
  'pink',
  'dracula',
  'halloween',
] as const

const USERS = ['torvalds', 'gaearon', 'sindresorhus']

export function GithubCalendarPage() {
  const [scheme, setScheme] = useState<(typeof SCHEMES)[number]>('green')
  const [username, setUsername] = useState(USERS[0])

  return (
    <div className="min-h-svh bg-background px-4 py-16 text-foreground">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-12">
        <header className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            shared / github-calendar
          </p>
          <h1 className="mt-3 text-4xl font-medium tracking-tight">
            GitHub activity card
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
            A contribution heatmap built from the public contributions API,
            with month labels and a collapsible list of recently pushed repos.
          </p>
        </header>

        <section className="flex flex-col items-center gap-8">
          <GithubActivityCard
            key={`${username}-${scheme}`}
            username={username}
            colorScheme={scheme}
            className="w-full"
          />

          <DemoPanel>
            <DemoControlGroup
              title="user"
              options={USERS}
              value={username}
              onChange={setUsername}
            />
            <DemoControlGroup
              title="color scheme"
              options={SCHEMES}
              value={scheme}
              onChange={setScheme}
            />
            <p className="text-xs text-muted-foreground">
              Data is fetched live from public APIs, so it may rate-limit.
            </p>
          </DemoPanel>
        </section>
      </div>
    </div>
  )
}
