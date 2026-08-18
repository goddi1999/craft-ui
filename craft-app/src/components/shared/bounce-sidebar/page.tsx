import { useState } from 'react'

import { DemoControlGroup, DemoPanel } from '@/components/shared/demo-controls'

import { BounceSidebar } from './BounceSidebar'

const ITEMS = [
  'Overview',
  'Components',
  'Patterns',
  'Tokens',
  'Changelog',
  'Roadmap',
]

const DOT_COLORS = ['#fcd601', '#38bdf8', '#f472b6', '#4ade80']

export function BounceSidebarPage() {
  const [active, setActive] = useState(0)
  const [dotColor, setDotColor] = useState('#fcd601')

  return (
    <div className="min-h-svh bg-background px-4 py-16 text-foreground">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-12">
        <header className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            shared / bounce-sidebar
          </p>
          <h1 className="mt-3 text-4xl font-medium tracking-tight">
            Bounce sidebar
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
            A nav marker that squashes and stretches as it travels between
            items, easing along an arc rather than a straight line.
          </p>
        </header>

        <section className="flex flex-col items-center gap-8">
          <div className="w-full max-w-xs rounded-2xl border border-border bg-card p-8">
            <BounceSidebar
              items={ITEMS}
              value={active}
              onChange={setActive}
              dotColor={dotColor}
            />
          </div>

          <DemoPanel>
            <DemoControlGroup
              title="dot color"
              options={DOT_COLORS}
              value={dotColor}
              onChange={setDotColor}
            />
            <p className="text-xs text-muted-foreground">
              Active: <span className="font-medium">{ITEMS[active]}</span>
            </p>
          </DemoPanel>
        </section>
      </div>
    </div>
  )
}
