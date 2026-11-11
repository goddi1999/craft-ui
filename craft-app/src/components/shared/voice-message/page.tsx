import {
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { VoiceMessage, type VoiceMessageSize } from '@/components/ui/voice-message'

const SIZES: VoiceMessageSize[] = ['sm', 'default', 'lg']
// the three swatches the original demo offers
const ACCENTS = ['#FC4C01', '#1A73F2', '#4ADE80'] as const
const ACCENT_NAMES: Record<(typeof ACCENTS)[number], string> = {
  '#FC4C01': 'Orange',
  '#1A73F2': 'Blue',
  '#4ADE80': 'Green',
}

const DEFAULTS = {
  size: 'default' as VoiceMessageSize,
  accent: '#FC4C01' as (typeof ACCENTS)[number],
  duration: 53,
  bars: 40,
  seed: 7,
  seekable: true,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'src',
    type: 'string',
    description: 'Audio file. Without one the message plays silently for `duration`.',
  },
  {
    name: 'duration',
    type: 'number',
    default: '53',
    description: 'Length in seconds when there is no file, or until its metadata loads.',
  },
  {
    name: 'waveform',
    type: 'number[]',
    description: 'Bar heights from 0 to 1. Generated from `seed` when omitted.',
  },
  { name: 'bars', type: 'number', default: '40', description: 'Number of generated bars.' },
  {
    name: 'seed',
    type: 'number',
    default: '7',
    description: 'Seed for the generated waveform, so it never changes between renders.',
  },
  {
    name: 'playing / defaultPlaying',
    type: 'boolean',
    default: 'false',
    description: 'Play state, controlled or initial. Pair playing with onPlayingChange.',
  },
  {
    name: 'accent',
    type: 'string',
    default: "'#FC4C01'",
    description: 'Any CSS color for the light behind the pill. The waveform itself stays neutral.',
  },
  {
    name: 'size',
    type: "'sm' | 'default' | 'lg'",
    default: "'default'",
    description: 'Height of the pill: 40, 52 or 64 px.',
  },
  {
    name: 'seekable',
    type: 'boolean',
    default: 'true',
    description: 'Drag, click or use arrow keys on the waveform to seek.',
  },
  {
    name: 'speeds',
    type: 'number[]',
    default: '[1, 1.5, 2]',
    description: 'Rates the time label cycles through when pressed.',
  },
  {
    name: 'onEnded / onSpeedChange',
    type: '() => void / (speed: number) => void',
    description: 'Called when playback ends / when the speed changes.',
  },
  {
    name: 'VoiceMessageGroup',
    type: 'component',
    description: 'Wrap several messages so starting one pauses the others.',
  },
]

export function VoiceMessagePage() {
  const settings = useDemoSettings(DEFAULTS)
  const { size, accent, duration, bars, seed, seekable } = settings.values

  const usage = toUsageSnippet({
    component: 'VoiceMessage',
    from: '@/components/ui/voice-message',
    props: { size, accent, duration, bars, seed, seekable },
    defaults: DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / voice-message"
      title="Voice Message"
      description="Press play: the triangle splits into the pause bars, the waveform fills from the left and soft lights circle the inside edge of the pill. Pause and they wind down to a stop. Drag across the waveform to scrub, or focus it and use the arrow keys. Press the time to change playback speed."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Size"
            options={SIZES}
            value={size}
            onChange={(value) => settings.set('size', value)}
          />
          <DemoControlGroup
            title="Accent"
            options={ACCENTS}
            value={accent}
            onChange={(value) => settings.set('accent', value)}
            format={(value) => (
              <span className="flex items-center gap-1.5">
                <span
                  aria-hidden="true"
                  className="size-3 rounded-full"
                  style={{ backgroundColor: value }}
                />
                {ACCENT_NAMES[value]}
              </span>
            )}
          />
          <DemoSlider
            label="Duration"
            value={duration}
            onValueChange={(value) => settings.set('duration', value)}
            min={5}
            max={180}
            unit="s"
          />
          <DemoSlider
            label="Bars"
            value={bars}
            onValueChange={(value) => settings.set('bars', value)}
            min={16}
            max={64}
          />
          <DemoSlider
            label="Waveform seed"
            value={seed}
            onValueChange={(value) => settings.set('seed', value)}
            min={1}
            max={50}
          />
          <DemoSwitch
            label="Seekable"
            checked={seekable}
            onCheckedChange={(value) => settings.set('seekable', value)}
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/voice-message/'], usage, props: PROPS }}
    >
      <VoiceMessage
        size={size}
        accent={accent}
        duration={duration}
        bars={bars}
        seed={seed}
        seekable={seekable}
        className="w-full max-w-[340px]"
      />
    </DemoPage>
  )
}
