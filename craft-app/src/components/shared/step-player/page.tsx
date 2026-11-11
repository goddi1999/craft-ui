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
  StepPlayer,
  type StepPlayerControlPosition,
} from '@/components/ui/step-player'

const POSITIONS: StepPlayerControlPosition[] = ['left', 'right']

const DEFAULTS = {
  steps: 4,
  seconds: 4,
  size: 48,
  controlPosition: 'right' as StepPlayerControlPosition,
  loop: false,
  seekable: false,
  showControl: true,
}

const COMPONENT_DEFAULTS = { ...DEFAULTS, duration: 4000 }

const PROPS: DemoPropDoc[] = [
  {
    name: 'steps',
    type: 'number | { duration?: number; label?: string }[]',
    default: '4',
    description: 'How many steps, or one entry per step with its own length and label.',
  },
  {
    name: 'duration',
    type: 'number',
    default: '4000',
    description: 'Default length of each step in milliseconds.',
  },
  {
    name: 'value / defaultValue',
    type: 'number',
    default: '0',
    description: 'Active step, controlled or initial. Pair value with onValueChange.',
  },
  {
    name: 'playing / defaultPlaying',
    type: 'boolean',
    default: 'false',
    description: 'Play state, controlled or initial. Pair playing with onPlayingChange.',
  },
  {
    name: 'loop',
    type: 'boolean',
    default: 'false',
    description: 'Start over after the last step instead of showing Replay.',
  },
  {
    name: 'size',
    type: 'number',
    default: '48',
    description: 'Track height in px; dots, bar and icon scale from it.',
  },
  {
    name: 'showControl',
    type: 'boolean',
    default: 'true',
    description: 'Show the play / pause / replay button.',
  },
  {
    name: 'controlPosition',
    type: "'left' | 'right'",
    default: "'right'",
    description: 'Which side the button sits on.',
  },
  {
    name: 'seekable',
    type: 'boolean',
    default: 'false',
    description: 'Click a dot to jump to that step.',
  },
  {
    name: 'onComplete',
    type: '() => void',
    description: 'Called when the last step finishes.',
  },
]

export function StepPlayerPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { steps, seconds, size, controlPosition, loop, seekable, showControl } =
    settings.values

  const usage = toUsageSnippet({
    component: 'StepPlayer',
    from: '@/components/ui/step-player',
    props: {
      steps,
      duration: seconds * 1000,
      size,
      controlPosition,
      loop,
      seekable,
      showControl,
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / step-player"
      title="Step Player"
      description="An iOS-style story progress bar: the active dot stretches into a filling bar, and the play button morphs between play, pause and replay."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSlider
            label="Steps"
            value={steps}
            onValueChange={(value) => settings.set('steps', value)}
            min={2}
            max={8}
          />
          <DemoSlider
            label="Step length"
            value={seconds}
            onValueChange={(value) => settings.set('seconds', value)}
            min={1}
            max={8}
            unit="s"
          />
          <DemoSlider
            label="Size"
            value={size}
            onValueChange={(value) => settings.set('size', value)}
            min={28}
            max={72}
            step={4}
            unit="px"
          />
          <DemoControlGroup
            title="Control position"
            options={POSITIONS}
            value={controlPosition}
            onChange={(value) => settings.set('controlPosition', value)}
          />
          <DemoSwitch
            label="Show control"
            checked={showControl}
            onCheckedChange={(value) => settings.set('showControl', value)}
          />
          <DemoSwitch
            label="Loop"
            checked={loop}
            onCheckedChange={(value) => settings.set('loop', value)}
          />
          <DemoSwitch
            label="Seekable dots"
            checked={seekable}
            onCheckedChange={(value) => settings.set('seekable', value)}
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/step-player/'], usage, props: PROPS }}
    >
      <StepPlayer
        key={steps}
        steps={steps}
        duration={seconds * 1000}
        size={size}
        controlPosition={controlPosition}
        loop={loop}
        seekable={seekable}
        showControl={showControl}
        defaultPlaying
      />
    </DemoPage>
  )
}
