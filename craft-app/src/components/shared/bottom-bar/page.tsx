import { Bookmark, House, Inbox, Search, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import {
  DemoControlGroup,
  DemoSettings,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { BottomBar, type BottomBarItem } from '@/components/ui/bottom-bar'

const HOME: BottomBarItem = { value: 'home', label: 'Home', icon: <House /> }
const SEARCH: BottomBarItem = { value: 'search', label: 'Search', icon: <Search /> }
const INBOX: BottomBarItem = { value: 'inbox', label: 'Inbox', icon: <Inbox /> }
const SAVED: BottomBarItem = { value: 'saved', label: 'Saved', icon: <Bookmark /> }
const PROFILE: BottomBarItem = { value: 'profile', label: 'Profile', icon: <User /> }

const TAB_COUNTS = [3, 4, 5] as const
type TabCount = (typeof TAB_COUNTS)[number]

// one stable array per count, so the autoplay timer does not restart on every render
const TAB_SETS: Record<TabCount, readonly BottomBarItem[]> = {
  3: [HOME, SEARCH, PROFILE],
  4: [HOME, SEARCH, SAVED, PROFILE],
  5: [HOME, SEARCH, INBOX, SAVED, PROFILE],
}

// the source steps every 1.7s and waits 7s after the viewer picks a tab
const AUTOPLAY_MS = 1700
const PAUSE_AFTER_PICK_MS = 7000

const DEFAULTS = {
  tabs: 4 as TabCount,
  autoplay: true,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'items',
    type: '{ value: string; label: string; icon: ReactNode }[]',
    description: 'The tabs, in order. Icons are sized to 22px; the label shows only on the picked tab.',
  },
  { name: 'value', type: 'string', description: 'Controlled picked tab. Use with `onValueChange`.' },
  {
    name: 'defaultValue',
    type: 'string',
    default: 'items[0].value',
    description: 'Picked tab when uncontrolled.',
  },
  {
    name: 'onValueChange',
    type: '(value: string) => void',
    description: 'Fires when the user picks a different tab.',
  },
  {
    name: 'aria-label',
    type: 'string',
    description: 'Name of the navigation landmark, e.g. `Main`.',
  },
  { name: 'className', type: 'string', description: 'Merged onto the `<nav>`.' },
]

export function BottomBarPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { tabs, autoplay } = settings.values
  const items = TAB_SETS[tabs]
  const [tab, setTab] = useState('home')
  const pausedUntil = useRef(0)
  // a tab that is gone after changing the count falls back to the first one
  const current = items.some((item) => item.value === tab) ? tab : items[0].value

  useEffect(() => {
    if (!autoplay) return
    const id = window.setInterval(() => {
      if (Date.now() < pausedUntil.current) return
      setTab((previous) => {
        const index = items.findIndex((item) => item.value === previous)
        return items[(index + 1) % items.length].value
      })
    }, AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [autoplay, items])

  function handleValueChange(next: string) {
    pausedUntil.current = Date.now() + PAUSE_AFTER_PICK_MS
    setTab(next)
  }

  const usage = toUsageSnippet({
    component: 'BottomBar',
    from: '@/components/ui/bottom-bar',
    props: {
      items: { expression: 'tabs' },
      value: { expression: 'tab' },
      onValueChange: { expression: 'setTab' },
      'aria-label': 'Main',
    },
  })

  return (
    <DemoPage
      eyebrow="ui / bottom-bar"
      title="Bottom Bar"
      description="A mobile tab bar. The picked tab opens to show its name while the old one folds back to an icon, the pill stretches after it as both labels spring, and the icon squashes and pops. Adapted from Design Bookmark's motion studies."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Tabs"
            options={TAB_COUNTS}
            value={tabs}
            onChange={(next) => settings.set('tabs', next)}
          />
          <DemoSwitch
            label="Autoplay"
            checked={autoplay}
            onCheckedChange={(next) => settings.set('autoplay', next)}
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/bottom-bar/'], usage, props: PROPS }}
    >
      <BottomBar
        items={items}
        value={current}
        onValueChange={handleValueChange}
        aria-label="Main"
      />
    </DemoPage>
  )
}
