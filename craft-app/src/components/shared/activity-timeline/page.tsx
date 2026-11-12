import { getAvatarUrl } from '@wq-org/avatars'
import { Activity, Database, Rocket, Tag, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import {
  DemoAction,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { ActivityTimeline, type ActivityTimelineEvent } from '@/components/ui/activity-timeline'

const MINUTE = 60_000
// the labels follow a clock that ticks about once a minute, as the component asks
const TICK_MS = 30_000
const TIME_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone

const PEOPLE = {
  linh: { name: 'Linh Tran', avatar: 'avatar_female_vietnamese_01' },
  lukas: { name: 'Lukas Becker', avatar: 'avatar_male_german_01' },
  ada: { name: 'Ada Okafor', avatar: 'avatar_female_nigerian_01' },
  mateus: { name: 'Mateus Silva', avatar: 'avatar_male_brazil_01' },
  sophie: { name: 'Sophie Martin', avatar: 'avatar_female_french_01' },
  carlos: { name: 'Carlos Rivera', avatar: 'avatar_male_panama_01' },
} as const

type Person = keyof typeof PEOPLE
type Update = Omit<ActivityTimelineEvent, 'id' | 'at'>

const by = (person: Person): Pick<ActivityTimelineEvent, 'actor' | 'avatar'> => ({
  actor: PEOPLE[person].name,
  avatar: getAvatarUrl(PEOPLE[person].avatar)?.imageUrl,
})

function BuildLog({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl bg-muted px-3 py-2 font-mono text-xs leading-relaxed text-foreground">
      {children}
    </pre>
  )
}

function Steps({ items }: { items: [string, string][] }) {
  return (
    <dl className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 gap-y-1">
      {items.map(([step, time]) => (
        <div key={step} className="contents">
          <dt>{step}</dt>
          <dd className="text-right tabular-nums">{time}</dd>
        </div>
      ))}
    </dl>
  )
}

/** A time `daysAgo` calendar days back at a local clock time. */
function onDay(now: number, daysAgo: number, hours: number, minutes: number) {
  const date = new Date(now)
  date.setDate(date.getDate() - daysAgo)
  date.setHours(hours, minutes, 0, 0)
  return date.getTime()
}

function seed(now: number): ActivityTimelineEvent[] {
  return [
    {
      id: 'merge-checkout',
      at: now - 4 * MINUTE,
      ...by('linh'),
      title: 'merged Checkout redesign into main',
      meta: 'PR #482 · 14 files',
      detail: 'Payment now fits on one step and Apple Pay is on by default. Reviewed by Lukas and Ada.',
    },
    {
      id: 'deploy-prod',
      at: now - 11 * MINUTE,
      title: 'Deployed to production',
      meta: 'web · 3f9c2a1 · 2m 41s',
      icon: <Rocket />,
      tone: 'success',
      detail: (
        <Steps
          items={[
            ['Install', '38s'],
            ['Build', '1m 12s'],
            ['Upload assets', '29s'],
            ['Promote', '22s'],
          ]}
        />
      ),
    },
    {
      id: 'preview-failed',
      at: now - 38 * MINUTE,
      title: 'Preview build failed',
      meta: 'booking-dates · a81e09d',
      icon: <X />,
      tone: 'danger',
      detail: (
        <BuildLog>
          {`src/booking/date-range.tsx:42:7\nType 'string' is not assignable to type 'Date'.\nBuild step exited with code 1.`}
        </BuildLog>
      ),
    },
    {
      id: 'comment-gallery',
      at: now - 82 * MINUTE,
      ...by('ada'),
      title: 'commented on Room gallery',
      meta: '“Can we keep swipe on mobile? People expect it.”',
    },
    {
      id: 'open-date-picker',
      at: now - 165 * MINUTE,
      ...by('mateus'),
      title: 'opened Date picker for multi-night stays',
      meta: 'PR #485',
    },
    {
      id: 'move-filters',
      at: now - 300 * MINUTE,
      ...by('sophie'),
      title: 'moved Search filters to In review',
      meta: 'Sprint 14',
    },
    {
      id: 'approve-checkout',
      at: onDay(now, 1, 17, 52),
      ...by('lukas'),
      title: 'approved Checkout redesign',
      meta: 'PR #482',
    },
    {
      id: 'close-search',
      at: onDay(now, 1, 15, 8),
      ...by('carlos'),
      title: 'closed Slow search on the rooms page',
      meta: 'Issue #1207',
      detail:
        'Availability is now cached for 60 seconds. Search p95 went from 1.8 s to 240 ms on the rooms page.',
    },
    {
      id: 'uptime',
      at: onDay(now, 1, 9, 41),
      title: 'Uptime alert resolved after 3 minutes',
      meta: 'api.harbour.app · eu-west',
      icon: <Activity />,
      tone: 'success',
    },
    {
      id: 'backup',
      at: onDay(now, 1, 3, 0),
      title: 'Nightly backup completed',
      meta: '4.2 GB · 3 regions',
      icon: <Database />,
    },
    {
      id: 'release',
      at: onDay(now, 2, 16, 30),
      title: 'Released v2.14.0',
      meta: 'Changelog · 9 changes',
      icon: <Tag />,
      tone: 'success',
      detail: (
        <ul className="grid list-disc gap-1 pl-4">
          <li>Saved searches sync across devices</li>
          <li>Room pages load photos progressively</li>
          <li>Fixed double charges on slow connections</li>
        </ul>
      ),
    },
    {
      id: 'create-project',
      at: onDay(now, 2, 10, 15),
      ...by('linh'),
      title: 'created Harbour redesign',
      meta: 'Project · Product team',
    },
    {
      id: 'invite',
      at: onDay(now, 3, 14, 2),
      ...by('ada'),
      title: 'invited Mateus Silva and Sophie Martin',
      meta: 'Team · 2 new members',
    },
  ]
}

// what "Add update" posts next, in turn
const INCOMING: Update[] = [
  {
    ...by('lukas'),
    title: 'commented on Date picker for multi-night stays',
    meta: '“Looks good. One nit on the range label.”',
  },
  {
    title: 'Deployed to production',
    meta: 'web · 7bd04e2 · 2m 08s',
    icon: <Rocket />,
    tone: 'success',
    detail: (
      <Steps
        items={[
          ['Install', '31s'],
          ['Build', '1m 04s'],
          ['Upload assets', '19s'],
          ['Promote', '14s'],
        ]}
      />
    ),
  },
  {
    ...by('ada'),
    title: 'merged Room gallery swipe into main',
    meta: 'PR #486 · 6 files',
  },
  {
    title: 'Preview build failed',
    meta: 'search-filters · 0c55f1b',
    icon: <X />,
    tone: 'danger',
    detail: <BuildLog>{`Lint failed: 2 problems in src/search/filters.tsx.\nBuild step exited with code 1.`}</BuildLog>,
  },
  {
    ...by('sophie'),
    title: 'resolved 3 comments on Search filters',
    meta: 'PR #484',
  },
]

const DEFAULTS = {
  scrollArea: true,
  height: 420,
  scrollToNew: true,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'events',
    type: 'ActivityTimelineEvent[]',
    description:
      '`{ id, at, actor?, title, meta?, detail?, avatar?, icon?, tone? }` in any order; the newest shows first. Rows with `detail` expand in place.',
  },
  {
    name: 'now',
    type: 'number',
    description:
      'Reference time in epoch ms for relative labels and day groups. Pass a clock that ticks about once a minute.',
  },
  { name: 'label', type: 'string', description: 'Accessible name for the feed.' },
  {
    name: 'timeZone',
    type: 'string',
    default: "'UTC'",
    description: 'Time zone for day groups and clock times. Fixed by default so server and client agree.',
  },
  { name: 'locale', type: 'string', default: "'en-US'", description: 'Locale for dates and times.' },
  {
    name: 'maxHeight',
    type: 'number | string',
    description:
      'Height of the scrolling area; the bottom edge feathers while more waits below. Without it the feed grows with the page.',
  },
  {
    name: 'scrollToNew',
    type: 'boolean',
    default: 'true',
    description: 'Scroll back to the top when a new update arrives while the feed is scrolled down.',
  },
  {
    name: 'defaultExpanded',
    type: 'string[]',
    default: '[]',
    description: 'Ids of the rows expanded on mount.',
  },
  {
    name: 'headingLevel',
    type: '2 | 3 | 4 | 5 | 6',
    default: '3',
    description: 'Heading level for the day labels.',
  },
  { name: 'className', type: 'string', description: 'Merged onto the feed.' },
]

export function ActivityTimelinePage() {
  const settings = useDemoSettings(DEFAULTS)
  const { scrollArea, height, scrollToNew } = settings.values
  const [now, setNow] = useState(() => Date.now())
  const [events, setEvents] = useState(() => seed(now))
  const [run, setRun] = useState(0)
  const posted = useRef(0)

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), TICK_MS)
    return () => window.clearInterval(timer)
  }, [])

  const addUpdate = () => {
    const at = Date.now()
    const update = INCOMING[posted.current % INCOMING.length]
    posted.current += 1
    setNow(at)
    setEvents((current) => [{ ...update, id: `update-${posted.current}`, at }, ...current])
  }

  const startOver = () => {
    const at = Date.now()
    posted.current = 0
    setNow(at)
    setEvents(seed(at))
    setRun((value) => value + 1)
  }

  const usage = toUsageSnippet({
    component: 'ActivityTimeline',
    from: '@/components/ui/activity-timeline',
    props: {
      events: { expression: 'events' },
      now: { expression: 'now' },
      label: 'Project activity',
      timeZone: TIME_ZONE,
      maxHeight: scrollArea ? height : undefined,
      scrollToNew,
    },
    defaults: { scrollToNew: true, timeZone: 'UTC' },
  })

  return (
    <DemoPage
      eyebrow="ui / activity-timeline"
      title="Activity Timeline"
      description="A vertical activity feed grouped by day, for project history, audit logs and deploy streams. Day labels stay pinned while their updates scroll under them, the line draws itself as rows come into view, and rows with more to say expand in place. Add an update and it slides in at the top while the rest glide down and the day’s count rolls. Arrow keys move between rows. Adapted from uiarc."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSwitch
            label="Scroll area"
            checked={scrollArea}
            onCheckedChange={(next) => settings.set('scrollArea', next)}
          />
          <DemoSlider
            label="Height"
            value={height}
            onValueChange={(next) => settings.set('height', next)}
            min={280}
            max={640}
            step={20}
            unit="px"
          />
          <DemoSwitch
            label="Scroll to new"
            checked={scrollToNew}
            onCheckedChange={(next) => settings.set('scrollToNew', next)}
          />
          <DemoAction onClick={addUpdate}>Add update</DemoAction>
          <DemoAction onClick={startOver}>Start over</DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/activity-timeline/'], usage, props: PROPS }}
    >
      <div className="w-full max-w-xl">
        <ActivityTimeline
          key={run}
          events={events}
          now={now}
          label="Project activity"
          timeZone={TIME_ZONE}
          maxHeight={scrollArea ? height : undefined}
          scrollToNew={scrollToNew}
          defaultExpanded={['preview-failed']}
        />
      </div>
    </DemoPage>
  )
}
