import { useState } from 'react'

import {
  DemoAction,
  DemoSettings,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'

import { PinnedPlacesList } from './PinnedPlacesList'

const DEFAULTS = {
  pinnedTitle: 'Pinned Places',
  allTitle: 'All Places',
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'items',
    type: 'PlaceItem[]',
    default: 'DEFAULT_PLACES',
    description:
      'Places to list — `{ id, name, type, status, icon, pinned? }` each. Read once on mount.',
  },
  {
    name: 'pinnedTitle',
    type: 'string',
    default: "'Pinned Places'",
    description: 'Heading over the pinned list, shown once something is pinned.',
  },
  {
    name: 'allTitle',
    type: 'string',
    default: "'All Places'",
    description: 'Heading over the unpinned list.',
  },
  {
    name: 'onPinnedChange',
    type: '(pinnedIds: string[]) => void',
    description: 'Called with every pinned id after each pin or unpin.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Classes for the root. It is at most 355px wide.',
  },
]

export function PinItemPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { pinnedTitle, allTitle } = settings.values
  /** Bumped to remount the list with nothing pinned. */
  const [run, setRun] = useState(0)

  const usage = toUsageSnippet({
    component: 'PinnedPlacesList',
    from: '@/components/shared/pin-item',
    props: { pinnedTitle, allTitle },
    defaults: DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="shared / pin-item"
      title="Pin item"
      description="Pinning a place moves its card between two lists. Because each card carries a shared layout id, it travels to its new section rather than disappearing from one and reappearing in the other."
      align="start"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoTextField
            label="Pinned title"
            value={pinnedTitle}
            onValueChange={(value) => settings.set('pinnedTitle', value)}
            maxLength={32}
          />
          <DemoTextField
            label="All title"
            value={allTitle}
            onValueChange={(value) => settings.set('allTitle', value)}
            maxLength={32}
          />
          <DemoAction onClick={() => setRun((current) => current + 1)}>
            Unpin all
          </DemoAction>
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/shared/pin-item/'],
        usage,
        props: PROPS,
      }}
    >
      <PinnedPlacesList
        key={run}
        pinnedTitle={pinnedTitle}
        allTitle={allTitle}
      />
    </DemoPage>
  )
}
