import {
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import {
  MorphingDisclosure,
  type MorphingDisclosureBorderStyle,
} from '@/components/ui/morphing-disclosure'

const BORDER_STYLES: MorphingDisclosureBorderStyle[] = ['border', 'pseudo']

const DEFAULTS = {
  highlight: true,
  bordered: true,
  translate: true,
  depth: false,
  borderStyle: 'border' as MorphingDisclosureBorderStyle,
  borderWidth: 2,
  blur: 4,
  speed: 1,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'items',
    type: 'readonly MorphingDisclosureItem[]',
    default: 'MORPHING_DISCLOSURE_ITEMS',
    description:
      'Rows to render — `{ title, content, icon? }` each. Only one opens at a time.',
  },
  {
    name: 'defaultOpenIndex',
    type: 'number',
    description: 'Row open on first render.',
  },
  {
    name: 'bordered',
    type: 'boolean',
    default: 'true',
    description: 'Draw separators between closed rows.',
  },
  {
    name: 'translate',
    type: 'boolean',
    default: 'true',
    description:
      'Push siblings away so the open row detaches into its own card.',
  },
  {
    name: 'highlight',
    type: 'boolean',
    default: 'true',
    description: 'Give the open row a high-contrast border.',
  },
  {
    name: 'depth',
    type: 'boolean',
    default: 'false',
    description:
      'Lift the open row towards the viewer in 3D and fade the rest.',
  },
  {
    name: 'borderStyle',
    type: "'border' | 'pseudo'",
    default: "'border'",
    description: 'Draw the outline with real borders or pseudo-element rings.',
  },
  {
    name: 'borderWidth',
    type: 'number',
    default: '2',
    description: 'Border width in px.',
  },
  {
    name: 'blur',
    type: 'number',
    default: '4',
    description: 'How blurred the copy is while closed, in px.',
  },
  {
    name: 'contentOpacity',
    type: 'number',
    default: '0.4',
    description: 'Opacity of the copy while closed.',
  },
  {
    name: 'contentOffset',
    type: 'number',
    default: '1',
    description: 'How far the copy sits below its place while closed, in rem.',
  },
  {
    name: 'gap',
    type: 'number',
    default: '1.5',
    description: 'Gap opened around the active row, in rem.',
  },
  {
    name: 'depthAmount',
    type: 'number',
    default: '0.5',
    description: 'Z distance of the depth effect, in rem.',
  },
  {
    name: 'speed',
    type: 'number',
    default: '1',
    description: 'Animation speed multiplier.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Extra classes for the root element.',
  },
]

export function MorphingDisclosurePage() {
  const settings = useDemoSettings(DEFAULTS)
  const {
    highlight,
    bordered,
    translate,
    depth,
    borderStyle,
    borderWidth,
    blur,
    speed,
  } = settings.values

  const usage = toUsageSnippet({
    component: 'MorphingDisclosure',
    from: '@/components/ui/morphing-disclosure',
    props: {
      defaultOpenIndex: 1,
      highlight,
      bordered,
      translate,
      depth,
      borderStyle,
      borderWidth,
      blur,
      speed,
    },
    defaults: DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / morphing-disclosure"
      title="Exclusive Morphing Disclosure"
      description="An exclusive <details name> group: opening a row detaches it into its own card — corners round off, borders morph, and the panel springs open with interpolate-size while the copy de-blurs into place."
      align="start"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSwitch
            label="Highlight"
            checked={highlight}
            onCheckedChange={(value) => settings.set('highlight', value)}
          />
          <DemoSwitch
            label="Bordered"
            checked={bordered}
            onCheckedChange={(value) => settings.set('bordered', value)}
          />
          <DemoSwitch
            label="Translate"
            checked={translate}
            onCheckedChange={(value) => settings.set('translate', value)}
          />
          <DemoSwitch
            label="Depth"
            checked={depth}
            onCheckedChange={(value) => settings.set('depth', value)}
          />
          <DemoControlGroup
            title="Border style"
            options={BORDER_STYLES}
            value={borderStyle}
            onChange={(value) => settings.set('borderStyle', value)}
          />
          <DemoSlider
            label="Border width"
            value={borderWidth}
            onValueChange={(value) => settings.set('borderWidth', value)}
            min={1}
            max={4}
            unit="px"
          />
          <DemoSlider
            label="Content blur"
            value={blur}
            onValueChange={(value) => settings.set('blur', value)}
            min={0}
            max={10}
            unit="px"
          />
          <DemoSlider
            label="Speed"
            value={speed}
            onValueChange={(value) => settings.set('speed', value)}
            min={0.5}
            max={2}
            step={0.25}
            unit="×"
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/ui/morphing-disclosure/'],
        usage,
        props: PROPS,
      }}
    >
      {/* Rows next to the open one translate outwards — leave them room. */}
      <div className="flex w-full justify-center py-6">
        <MorphingDisclosure
          defaultOpenIndex={1}
          highlight={highlight}
          bordered={bordered}
          translate={translate}
          depth={depth}
          borderStyle={borderStyle}
          borderWidth={borderWidth}
          blur={blur}
          speed={speed}
        />
      </div>
    </DemoPage>
  )
}
