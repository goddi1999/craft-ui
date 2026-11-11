import {
  DemoSettings,
  DemoSlider,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DEMO_IMAGES } from '@/components/shared/demo-media'
import { DemoPage } from '@/components/shared/demo-page'
import {
  AnimatedHoverDisclosures,
  HOVER_DISCLOSURE_ITEMS,
} from '@/components/ui/animated-hover-disclosures'

/** The component's copy and icons, with the shared demo photos. */
const ITEMS = HOVER_DISCLOSURE_ITEMS.map((item, index) => ({
  ...item,
  image: DEMO_IMAGES[index % DEMO_IMAGES.length].src,
}))

const DEFAULTS = {
  count: ITEMS.length,
  defaultActiveIndex: 0,
  linkLabel: 'Watch now',
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'items',
    type: 'readonly HoverDisclosureItem[]',
    default: 'HOVER_DISCLOSURE_ITEMS',
    description: 'Columns to render — `{ title, description, icon?, image?, href? }` each.',
  },
  {
    name: 'defaultActiveIndex',
    type: 'number',
    default: '0',
    description: 'Column expanded on mount when uncontrolled.',
  },
  {
    name: 'activeIndex',
    type: 'number',
    description: 'Controlled expanded column.',
  },
  {
    name: 'onActiveIndexChange',
    type: '(index: number) => void',
    description: 'Called when pointer, focus or a tap expands another column.',
  },
  {
    name: 'linkLabel',
    type: 'string',
    default: "'Watch now'",
    description: 'Call-to-action label on the expanded column.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Extra classes for the root list.',
  },
]

export function AnimatedHoverDisclosuresPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { count, defaultActiveIndex, linkLabel } = settings.values
  const items = ITEMS.slice(0, count)
  const activeIndex = Math.min(defaultActiveIndex, count - 1)

  const usage = toUsageSnippet({
    component: 'AnimatedHoverDisclosures',
    from: '@/components/ui/animated-hover-disclosures',
    props: {
      items: '{items}',
      defaultActiveIndex: activeIndex,
      linkLabel: linkLabel || undefined,
    },
    defaults: DEFAULTS,
  }).replace(/"\{(\w+)\}"/g, '{$1}')

  return (
    <DemoPage
      eyebrow="ui / animated-hover-disclosures"
      title="Animated Hover Disclosures"
      description="A row of course cards where hovering, focusing, or tapping a column grows it with a grid-template-columns transition — revealing its copy, link, and a colour photo while the rest fold into rotated labels."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSlider
            label="Columns"
            value={count}
            onValueChange={(value) => settings.set('count', value)}
            min={3}
            max={ITEMS.length}
          />
          <DemoSlider
            label="Open on mount"
            value={activeIndex + 1}
            onValueChange={(value) => settings.set('defaultActiveIndex', value - 1)}
            min={1}
            max={count}
          />
          <DemoTextField
            label="Link label"
            value={linkLabel}
            onValueChange={(value) => settings.set('linkLabel', value)}
            maxLength={20}
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/ui/animated-hover-disclosures/'],
        usage,
        props: PROPS,
      }}
    >
      <AnimatedHoverDisclosures
        // Remount so a new column count or start column applies right away.
        key={`${count}-${activeIndex}`}
        items={items}
        defaultActiveIndex={activeIndex}
        linkLabel={linkLabel || undefined}
      />
    </DemoPage>
  )
}
