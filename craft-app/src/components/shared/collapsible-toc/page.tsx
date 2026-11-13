import { useState } from 'react'

import {
  DemoAction,
  DemoSettings,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { CollapsibleToc } from '@/components/ui/collapsible-toc'

import { DEMO_SECTIONS } from './collapsible-toc.data'

const DEFAULTS = { title: 'On this page', hide: 'Hide menu', show: 'Open menu' }

const PROPS: DemoPropDoc[] = [
  {
    name: 'items',
    type: '{ id: string; label: string; depth?: 0 | 1 }[]',
    description: 'The list. Each id must match a heading in the article; scroll-spy marks the current one.',
  },
  { name: 'open', type: 'boolean', description: 'Controlled open state.' },
  { name: 'defaultOpen', type: 'boolean', default: 'wide: open, phone: folded', description: 'Initial state when uncontrolled.' },
  { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the toggle is pressed.' },
  { name: 'title', type: 'string', default: "'On this page'", description: 'Heading over the list.' },
  {
    name: 'labels',
    type: '{ hide: string; show: string }',
    default: "{ hide: 'Hide menu', show: 'Open menu' }",
    description: 'Toggle text in each state; it morphs letter by letter between them.',
  },
  { name: 'children', type: 'ReactNode', description: 'The article.' },
  { name: 'className', type: 'string', description: 'Merged onto the root.' },
]

export function CollapsibleTocPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { title, hide, show } = settings.values
  const [open, setOpen] = useState(() => window.matchMedia('(min-width: 48rem)').matches)

  const usage = toUsageSnippet({
    component: 'CollapsibleToc',
    from: '@/components/ui/collapsible-toc',
    props: {
      items: { expression: 'sections' },
      title,
      labels: { expression: `{ hide: '${hide}', show: '${show}' }` },
    },
    defaults: { title: 'On this page' },
    children: '<article>…</article>',
  })

  return (
    <DemoPage
      eyebrow="ui / collapsible-toc"
      title="Collapsible TOC"
      description="A docs layout with an “On this page” list that tracks where you are. Hide it and the list slides out behind its own left edge while the article glides over to re-centre, and the toggle's label morphs letter by letter. Narrow screens fold the list above the article."
      bleed
      align="stretch"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoTextField
            label="Title"
            value={title}
            onValueChange={(next) => settings.set('title', next)}
          />
          <DemoTextField
            label="Hide label"
            value={hide}
            onValueChange={(next) => settings.set('hide', next)}
          />
          <DemoTextField
            label="Show label"
            value={show}
            onValueChange={(next) => settings.set('show', next)}
          />
          <DemoAction onClick={() => setOpen((value) => !value)}>
            {open ? hide : show}
          </DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/collapsible-toc/'], usage, props: PROPS }}
    >
      <div className="h-[560px] overflow-y-auto overscroll-contain px-5 py-8 sm:px-8">
        <CollapsibleToc
          items={DEMO_SECTIONS}
          title={title}
          labels={{ hide, show }}
          open={open}
          onOpenChange={setOpen}
        >
          <article className="pb-[40vh] text-sm leading-relaxed text-foreground/80">
            {DEMO_SECTIONS.map((section) => (
              <section key={section.id} className="mb-10">
                <h2
                  id={section.id}
                  className="mb-3 scroll-mt-6 text-lg font-semibold text-foreground"
                >
                  {section.label}
                </h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="mb-3">
                    {paragraph}
                  </p>
                ))}
                {section.list && (
                  <ul className="list-disc space-y-1 pl-5">
                    {section.list.map((entry) => (
                      <li key={entry}>{entry}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </article>
        </CollapsibleToc>
      </div>
    </DemoPage>
  )
}
