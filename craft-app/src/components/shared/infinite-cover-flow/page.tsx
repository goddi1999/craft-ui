import {
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DEMO_IMAGES } from '@/components/shared/demo-media'
import { DemoPage } from '@/components/shared/demo-page'
import {
  DEFAULT_COVERS,
  InfiniteCoverFlow,
  type InfiniteCoverFlowReflection,
} from '@/components/ui/infinite-cover-flow'

const REFLECTIONS: InfiniteCoverFlowReflection[] = ['mirror', 'blur']
const COVER_SETS = ['photos', 'albums'] as const
type CoverSet = (typeof COVER_SETS)[number]

const COVER_SET_LABELS: Record<CoverSet, string> = {
  photos: 'Photos · 16:9',
  albums: 'Albums · 1:1',
}

const DEFAULTS = {
  coverSet: 'photos' as CoverSet,
  reflection: 'blur' as InfiniteCoverFlowReflection,
  radius: 12,
  showHint: true,
}

/** The component's own defaults, so the snippet only prints real changes. */
const COMPONENT_DEFAULTS = {
  reflection: 'mirror',
  aspectRatio: 1,
  showHint: true,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'items',
    type: 'CoverFlowItem[]',
    default: 'DEFAULT_COVERS',
    description: 'Covers to loop through — `{ src, alt }` each.',
  },
  {
    name: 'reflection',
    type: "'mirror' | 'blur'",
    default: "'mirror'",
    description: 'A crisp mirror that fades out, or a soft blurred floor.',
  },
  {
    name: 'aspectRatio',
    type: 'number',
    default: '1',
    description: 'Cover width ÷ height, e.g. 16 / 9 for landscape photos.',
  },
  {
    name: 'showHint',
    type: 'boolean',
    default: 'true',
    description: 'Show the animated "scroll me" hint in the corner.',
  },
  {
    name: 'label',
    type: 'string',
    default: "'Album covers'",
    description: 'Accessible name of the carousel region.',
  },
  {
    name: 'onIndexChange',
    type: '(index: number) => void',
    description: 'Called with the centred cover each time the flow settles.',
  },
  {
    name: '--infinite-cover-flow-radius',
    type: 'CSS length',
    default: '0px',
    description: 'Corner radius of the covers, set through className or style.',
  },
]

export function InfiniteCoverFlowPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { coverSet, reflection, radius, showHint } = settings.values
  const photos = coverSet === 'photos'

  const usage = toUsageSnippet({
    component: 'InfiniteCoverFlow',
    from: '@/components/ui/infinite-cover-flow',
    props: {
      reflection,
      aspectRatio: photos ? { expression: '16 / 9' } : 1,
      showHint,
      className: radius ? `[--infinite-cover-flow-radius:${radius}px]` : undefined,
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / infinite-cover-flow"
      title="Infinite Cover Flow"
      description="An endless 3D carousel built from GSAP timelines — scroll or drag over it to scrub, click a cover to centre it, or use the buttons and arrow keys."
      align="stretch"
      bleed
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Covers"
            options={COVER_SETS}
            value={coverSet}
            onChange={(value) => settings.set('coverSet', value)}
            format={(value) => COVER_SET_LABELS[value]}
          />
          <DemoControlGroup
            title="Reflection"
            options={REFLECTIONS}
            value={reflection}
            onChange={(value) => settings.set('reflection', value)}
          />
          <DemoSlider
            label="Corner radius"
            value={radius}
            onValueChange={(value) => settings.set('radius', value)}
            min={0}
            max={32}
            unit="px"
          />
          <DemoSwitch
            label="Scroll hint"
            checked={showHint}
            onCheckedChange={(value) => settings.set('showHint', value)}
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/ui/infinite-cover-flow/'],
        usage,
        props: PROPS,
      }}
    >
      <InfiniteCoverFlow
        items={photos ? DEMO_IMAGES : DEFAULT_COVERS}
        aspectRatio={photos ? 16 / 9 : 1}
        reflection={reflection}
        showHint={showHint}
        label={photos ? 'Featured photos' : 'Album covers'}
        style={{ ['--infinite-cover-flow-radius' as string]: `${radius}px` }}
      />
    </DemoPage>
  )
}
