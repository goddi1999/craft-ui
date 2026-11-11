import { useState } from 'react'

import { DemoSettings, DemoSwitch, useDemoSettings } from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { LineNav, type LineNavItem } from '@/components/ui/line-nav'

const ITEMS: LineNavItem[] = [
  { title: 'Apple Hello Effect', href: '#apple-hello-effect' },
  { title: 'Code Block Command', href: '#code-block-command' },
  { title: 'Copy Button', href: '#copy-button' },
  { title: 'Dot Grid Spotlight', href: '#dot-grid-spotlight' },
  { title: 'Elastic Slider', href: '#elastic-slider' },
  { title: 'Fluid Gradient Text', href: '#fluid-gradient-text' },
  { title: 'Shimmering Text', href: '#shimmering-text' },
  { title: 'Slide to Unlock', href: '#slide-to-unlock' },
  { title: 'Theme Switcher', href: '#theme-switcher' },
  { title: 'TOC Minimap', href: '#toc-minimap' },
]

const DEFAULTS = { scrollActiveIntoView: false }

const PROPS: DemoPropDoc[] = [
  { name: 'items', type: 'LineNavItem[]', description: 'Links as { title, href }. Required.' },
  { name: 'activeHref', type: 'string', description: 'Href of the active item; its line grows and darkens.' },
  {
    name: 'scrollActiveIntoView',
    type: 'boolean',
    default: 'true',
    description: 'Scrolls the active item to the centre on mount.',
  },
  { name: 'onItemClick', type: '(item, event) => void', description: 'Called when an item is clicked.' },
]

export function LineNavPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { scrollActiveIntoView } = settings.values
  const [activeHref, setActiveHref] = useState('#elastic-slider')

  const usage = toUsageSnippet({
    component: 'LineNav',
    from: '@/components/ui/line-nav',
    props: {
      items: { expression: 'items' },
      activeHref: { expression: 'activeHref' },
      scrollActiveIntoView,
      onItemClick: { expression: '(item) => setActiveHref(item.href)' },
    },
    defaults: { scrollActiveIntoView: true },
  })

  return (
    <DemoPage
      eyebrow="ui / line-nav"
      title="Line Nav"
      description="A table-of-contents rail of short lines: the active line stretches, and hovering any line previews the same stretch."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSwitch
            label="Scroll active into view"
            checked={scrollActiveIntoView}
            onCheckedChange={(next) => settings.set('scrollActiveIntoView', next)}
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/line-nav/'], usage, props: PROPS }}
    >
      <LineNav
        key={String(scrollActiveIntoView)}
        className="w-60"
        items={ITEMS}
        activeHref={activeHref}
        scrollActiveIntoView={scrollActiveIntoView}
        onItemClick={(item) => setActiveHref(item.href)}
      />
    </DemoPage>
  )
}
