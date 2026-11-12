import { useState } from 'react'
import { House, Inbox, Search, User } from 'lucide-react'

import {
  DemoAction,
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { RubberDock, type RubberDockItem } from '@/components/ui/rubber-dock'

import {
  ActivityChart,
  Chips,
  MessageRow,
  PanelHead,
  ProfileHead,
  SearchField,
  SettingRow,
  StatTiles,
} from './dock-demo-parts'

const TAB_COUNTS = [3, 4] as const

const DEFAULTS = {
  width: 340,
  tabs: 4 as (typeof TAB_COUNTS)[number],
}

const COMPONENT_DEFAULTS = { expandedWidth: 340 }

const ICON_STROKE = 1.8

const STATS = [
  { label: 'Requests', value: '12.4k', change: '+8%' },
  { label: 'Deploys', value: '318', change: '+21%' },
  { label: 'Errors', value: '0.4%' },
] as const

const RESULTS = [
  {
    tone: 'violet',
    title: 'Rate limiting at the edge',
    detail: 'Token buckets per route and per API key',
  },
  { tone: 'mint', title: 'Rolling back a deploy', detail: 'One click, any environment, no rebuild' },
  { tone: 'peach', title: 'Rotating API keys', detail: 'Swap secrets without breaking clients' },
] as const

const MESSAGES = [
  {
    tone: 'indigo',
    title: 'Deploy failed on main',
    detail: 'Step test exited with code 1',
    time: '2m',
    unread: true,
  },
  {
    tone: 'lime',
    title: 'Review requested',
    detail: 'Mia asked you to look at #482',
    time: '18m',
    unread: true,
  },
  {
    tone: 'pink',
    title: 'Usage alert',
    detail: 'API calls hit 80% of the plan',
    time: '1h',
    unread: true,
  },
  { tone: 'magenta', title: 'Weekly digest', detail: 'Your project numbers for the week', time: '3h' },
] as const

const PROPS: DemoPropDoc[] = [
  {
    name: 'items',
    type: 'RubberDockItem[]',
    description:
      '`{ value, label, icon, content? }` per tab. `label` names the icon-only tab; each top-level child of `content` staggers in when the card opens.',
  },
  { name: 'value', type: 'string', description: 'Controlled active tab.' },
  {
    name: 'defaultValue',
    type: 'string',
    default: 'items[0].value',
    description: 'Starting tab when uncontrolled.',
  },
  {
    name: 'onValueChange',
    type: '(value: string) => void',
    description: 'Called when a click, drag or arrow key picks another tab.',
  },
  {
    name: 'open',
    type: 'boolean',
    description: "Controlled open state: the dock morphed into the active tab's card.",
  },
  {
    name: 'defaultOpen',
    type: 'boolean',
    default: 'false',
    description: 'Starting open state when uncontrolled.',
  },
  {
    name: 'onOpenChange',
    type: '(open: boolean) => void',
    description: 'Called when the active tab is clicked again, on Escape and on a click outside.',
  },
  {
    name: 'expandedWidth',
    type: 'number',
    default: '340',
    description: 'Card width in px when open, never wider than the viewport minus 24px.',
  },
  {
    name: 'aria-label',
    type: 'string',
    default: "'Sections'",
    description: 'Name of the tab list.',
  },
  { name: 'className', type: 'string', description: 'Merged onto the root, which keeps the size of the closed dock.' },
]

const ITEMS_EXAMPLE = `const items = [
  {
    value: 'overview',
    label: 'Overview',
    icon: <House />,
    // each top-level child staggers in when the card opens
    content: (
      <>
        <h3>Overview</h3>
        <UsageStats />
        <ActivityChart />
      </>
    ),
  },
  { value: 'inbox', label: 'Inbox', icon: <Inbox />, content: <InboxList /> },
]`

export function RubberDockPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { width, tabs } = settings.values
  const [open, setOpen] = useState(false)
  const [prefs, setPrefs] = useState({ alerts: true, digest: false, sounds: false })

  const items: RubberDockItem[] = [
    {
      value: 'overview',
      label: 'Overview',
      icon: <House strokeWidth={ICON_STROKE} />,
      content: (
        <>
          <PanelHead title="Overview" meta="This week" />
          <StatTiles stats={STATS} />
          <ActivityChart label="Requests per day this week, busiest on day 10" />
        </>
      ),
    },
    {
      value: 'search',
      label: 'Search',
      icon: <Search strokeWidth={ICON_STROKE} />,
      content: (
        <>
          <SearchField query="rate limit" />
          <Chips labels={['Docs', 'Runbooks', 'Incidents', 'Flags']} />
          {RESULTS.map((result) => (
            <MessageRow key={result.title} {...result} />
          ))}
        </>
      ),
    },
    {
      value: 'inbox',
      label: 'Inbox',
      icon: <Inbox strokeWidth={ICON_STROKE} />,
      content: (
        <>
          <PanelHead title="Inbox" meta="3 new" />
          {MESSAGES.map((message) => (
            <MessageRow key={message.title} {...message} />
          ))}
        </>
      ),
    },
    {
      value: 'profile',
      label: 'Profile',
      icon: <User strokeWidth={ICON_STROKE} />,
      content: (
        <>
          <ProfileHead name="Lina Hart" handle="@linahart" />
          <SettingRow
            label="Deploy alerts"
            checked={prefs.alerts}
            onCheckedChange={(alerts) => setPrefs((current) => ({ ...current, alerts }))}
          />
          <SettingRow
            label="Weekly digest"
            checked={prefs.digest}
            onCheckedChange={(digest) => setPrefs((current) => ({ ...current, digest }))}
          />
          <SettingRow
            label="Sounds"
            checked={prefs.sounds}
            onCheckedChange={(sounds) => setPrefs((current) => ({ ...current, sounds }))}
          />
        </>
      ),
    },
  ].slice(0, tabs)

  const [importLine, element] = toUsageSnippet({
    component: 'RubberDock',
    from: '@/components/ui/rubber-dock',
    props: { items: { expression: 'items' }, expandedWidth: width },
    defaults: COMPONENT_DEFAULTS,
  }).split('\n\n')
  const usage = `import { House, Inbox } from 'lucide-react'\n${importLine}\n\n${ITEMS_EXAMPLE}\n\n${element}`

  return (
    <DemoPage
      eyebrow="ui / rubber-dock"
      title="Rubber Dock"
      description="A tab bar whose pill has two edges on separate springs: the one facing the move is stiff, the other lags, so the pill stretches like rubber between tabs and can be dragged past the ends. Click the active tab again and the dock morphs into its card, width first, then height. Adapted from Design Bookmark's motion studies."
      previewClassName="min-h-[30rem]"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSlider
            label="Card width"
            value={width}
            onValueChange={(next) => settings.set('width', next)}
            min={280}
            max={420}
            step={10}
            unit="px"
          />
          <DemoControlGroup
            title="Tabs"
            options={TAB_COUNTS}
            value={tabs}
            onChange={(next) => settings.set('tabs', next)}
          />
          <DemoAction onClick={() => setOpen(!open)}>{open ? 'Close card' : 'Open card'}</DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/rubber-dock/'], usage, props: PROPS }}
    >
      <RubberDock
        items={items}
        open={open}
        onOpenChange={setOpen}
        expandedWidth={width}
        aria-label="Workspace"
      />
    </DemoPage>
  )
}
