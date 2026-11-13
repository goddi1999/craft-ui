import { useState } from 'react'

import { DemoSettings, DemoSlider, useDemoSettings } from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { HistoryOverview } from '@/components/ui/history-overview'

import { DEMO_PAGES } from './history-overview.data'

const DEFAULTS = { scale: 42 }

const PROPS: DemoPropDoc[] = [
  {
    name: 'pages',
    type: '{ id: string; title: string; icon?: ReactNode; content: ReactNode }[]',
    description: 'Visited pages, oldest first. Titles label the cards in the strip.',
  },
  { name: 'current', type: 'string', description: 'Controlled id of the page on screen.' },
  { name: 'defaultCurrent', type: 'string', default: 'the last page', description: 'Initial page when uncontrolled.' },
  { name: 'onCurrentChange', type: '(id: string) => void', description: 'Called when a card is opened or the back arrow is used.' },
  { name: 'overviewScale', type: 'number', default: '0.42', description: 'How small pages get in the strip.' },
  { name: 'className', type: 'string', description: 'Merged onto the root; give it a height.' },
]

export function HistoryOverviewPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { scale } = settings.values
  const [current, setCurrent] = useState(DEMO_PAGES[DEMO_PAGES.length - 1].id)

  const usage = toUsageSnippet({
    component: 'HistoryOverview',
    from: '@/components/ui/history-overview',
    props: {
      pages: { expression: 'visited' },
      overviewScale: scale / 100,
      className: 'h-[480px]',
    },
    defaults: { overviewScale: 0.42 },
  })

  return (
    <DemoPage
      eyebrow="ui / history-overview"
      title="History Overview"
      description="Every page you visited, as one zoomable strip. Press the button at the bottom and the page shrinks back into a row of the others; drag, scroll or arrow through them, pick one and it zooms up to fill the screen. Hover the left edge to step back a page."
      bleed
      align="stretch"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSlider
            label="Strip scale"
            value={scale}
            onValueChange={(next) => settings.set('scale', next)}
            min={28}
            max={60}
            unit="%"
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/history-overview/'], usage, props: PROPS }}
    >
      <div className="w-full p-3 sm:p-5">
        <HistoryOverview
          pages={DEMO_PAGES}
          current={current}
          onCurrentChange={setCurrent}
          overviewScale={scale / 100}
          className="h-[360px] sm:h-[480px]"
        />
      </div>
    </DemoPage>
  )
}
