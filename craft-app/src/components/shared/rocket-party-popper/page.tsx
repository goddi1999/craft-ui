import {
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { RocketPartyPopper } from '@/components/ui/rocket-party-popper'

const DEFAULTS = {
  title: 'Mission Accomplished',
  description: 'All registry sync, lint, and SEO checks passed.',
  metric: '58 Components Live',
  triggerLabel: 'Launch celebration',
  confettiCount: 50,
  defaultLaunched: false,
}

const COMPONENT_DEFAULTS = {
  triggerLabel: 'Launch celebration',
  confettiCount: 50,
  defaultLaunched: false,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'title',
    type: 'string',
    description:
      'Headline shown with the confetti. Leave out all three texts for just Launch again.',
  },
  { name: 'description', type: 'string', description: 'A line under the headline.' },
  {
    name: 'metric',
    type: 'string',
    description: 'A small badge above the headline, such as a version or a count.',
  },
  {
    name: 'triggerLabel',
    type: 'string',
    default: "'Launch celebration'",
    description: 'Label of the launch button.',
  },
  {
    name: 'confettiCount',
    type: 'number',
    default: '50',
    description: 'Pieces of confetti per launch. None with reduced motion.',
  },
  {
    name: 'defaultLaunched',
    type: 'boolean',
    default: 'false',
    description: 'Start on the celebration. Read once, on mount.',
  },
  { name: 'onLaunch', type: '() => void', description: 'Called when the rocket is launched.' },
  { name: 'onReset', type: '() => void', description: 'Called when Launch again resets it.' },
  {
    name: 'className',
    type: 'string',
    description:
      'Merged onto the root. The confetti canvas reaches 128px above it and 80px past each side.',
  },
]

export function RocketPartyPopperPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { title, description, metric, triggerLabel, confettiCount, defaultLaunched } =
    settings.values

  const usage = toUsageSnippet({
    component: 'RocketPartyPopper',
    from: '@/components/ui/rocket-party-popper',
    props: {
      title: title || undefined,
      description: description || undefined,
      metric: metric || undefined,
      triggerLabel: triggerLabel || undefined,
      confettiCount,
      defaultLaunched,
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / rocket-party-popper"
      title="Rocket Party Popper"
      description="A rocket idling on its launchpad with a flickering pilot light. Launch it and it lifts off on a flame, then bursts into confetti that flies past the edges of the box and reveals the milestone. Reduced motion skips the flight and fades straight to it. Adapted from EasyUI."
      previewClassName="min-h-[28rem]"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoTextField
            label="Title"
            value={title}
            onValueChange={(next) => settings.set('title', next)}
            maxLength={40}
          />
          <DemoTextField
            label="Description"
            value={description}
            onValueChange={(next) => settings.set('description', next)}
            maxLength={80}
          />
          <DemoTextField
            label="Metric"
            value={metric}
            onValueChange={(next) => settings.set('metric', next)}
            maxLength={28}
          />
          <DemoTextField
            label="Button label"
            value={triggerLabel}
            onValueChange={(next) => settings.set('triggerLabel', next)}
            maxLength={28}
          />
          <DemoSlider
            label="Confetti"
            value={confettiCount}
            onValueChange={(next) => settings.set('confettiCount', next)}
            min={10}
            max={150}
            step={10}
          />
          <DemoSwitch
            label="Start launched"
            checked={defaultLaunched}
            onCheckedChange={(next) => settings.set('defaultLaunched', next)}
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/rocket-party-popper/'], usage, props: PROPS }}
    >
      {/* the start state is read once, so a new one remounts it */}
      <RocketPartyPopper
        key={String(defaultLaunched)}
        title={title || undefined}
        description={description || undefined}
        metric={metric || undefined}
        triggerLabel={triggerLabel || undefined}
        confettiCount={confettiCount}
        defaultLaunched={defaultLaunched}
      />
    </DemoPage>
  )
}
