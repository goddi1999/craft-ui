import { useState } from 'react'

import {
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'

import { VoicePill } from './VoicePill'
import type {
  VoicePillMode,
  VoicePillShape,
  VoicePillSource,
  VoicePillStopReason,
} from './VoicePill'

const SHAPES: VoicePillShape[] = ['pill', 'rounded']
const MODES: VoicePillMode[] = ['auto', 'hold', 'toggle']
const SOURCES: VoicePillSource[] = ['simulated', 'mic']

const DEFAULTS = {
  size: 28,
  shape: 'pill' as VoicePillShape,
  mode: 'auto' as VoicePillMode,
  reactive: 'simulated' as VoicePillSource,
  sensitivity: 1,
  showTime: true,
  waveform: true,
  slideToCancel: true,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'size',
    type: 'number',
    default: '28',
    description: 'Button size in px; the icon, timer and waveform scale with it.',
  },
  {
    name: 'shape',
    type: "'pill' | 'rounded'",
    default: "'pill'",
    description: 'Fully round ends, or a rounded rectangle.',
  },
  {
    name: 'mode',
    type: "'auto' | 'hold' | 'toggle'",
    default: "'auto'",
    description: 'Tap to toggle, hold to talk, or auto: a press longer than holdAfter acts as hold.',
  },
  {
    name: 'holdAfter',
    type: 'number',
    default: '300',
    description: 'In auto mode, ms of pressing after which release stops the take.',
  },
  {
    name: 'reactive',
    type: "'simulated' | 'mic'",
    default: "'simulated'",
    description: 'Drive the waveform from a built-in speech loop or the real microphone.',
  },
  {
    name: 'showTime',
    type: 'boolean',
    default: 'true',
    description: 'Show the running timer while listening.',
  },
  {
    name: 'waveform',
    type: 'boolean',
    default: 'true',
    description: 'Show the scrolling level bars while listening.',
  },
  {
    name: 'slideToCancel',
    type: 'boolean',
    default: 'true',
    description: 'Let a held press slide left to cancel the take.',
  },
  {
    name: 'cancelDistance',
    type: 'number',
    default: '64',
    description: 'How far, in px, to slide before the take is cancelled.',
  },
  {
    name: 'sensitivity',
    type: 'number',
    default: '1',
    description: 'Multiplier on the input level before it is drawn.',
  },
  {
    name: 'attack',
    type: 'number',
    default: '40',
    description: 'Ms for the level to rise toward a louder input.',
  },
  {
    name: 'release',
    type: 'number',
    default: '240',
    description: 'Ms for the level to fall back toward a quieter input.',
  },
  {
    name: 'floor',
    type: 'number',
    default: '0.1',
    description: 'Smallest bar height, as a fraction of the waveform height.',
  },
  {
    name: 'accentColor',
    type: 'string',
    default: "'#f5f5f5'",
    description: 'Colour of the stop icon, timer and waveform while listening.',
  },
  {
    name: 'iconColor',
    type: 'string',
    default: "'#a1a1aa'",
    description: 'Colour of the mic icon at rest.',
  },
  {
    name: 'background',
    type: 'string',
    default: "'#27272a'",
    description: 'Fill of the button and the open pill.',
  },
  {
    name: 'reach',
    type: 'number',
    default: '8',
    description: 'Extra px of pill to the left of the timer when open.',
  },
  {
    name: 'openDuration',
    type: 'number',
    default: '200',
    description: 'Ms the pill takes to open and close.',
  },
  {
    name: 'pressScale',
    type: 'number',
    default: '0.95',
    description: 'Scale of the button while pressed.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disable the button and stop any take in progress.',
  },
  {
    name: 'ariaLabel',
    type: 'string',
    default: "'Dictate'",
    description: 'Accessible name of the button.',
  },
  {
    name: 'onStart',
    type: '(info: { source: VoicePillSource }) => void',
    description: 'Called when listening starts.',
  },
  {
    name: 'onStop',
    type: '(info: { reason: VoicePillStopReason; duration: number }) => void',
    description: 'Called when listening ends, with why and how long (ms).',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Extra classes for the button.',
  },
]

export function VoicePillPage() {
  const settings = useDemoSettings(DEFAULTS)
  const {
    size,
    shape,
    mode,
    reactive,
    sensitivity,
    showTime,
    waveform,
    slideToCancel,
  } = settings.values
  const [lastTake, setLastTake] = useState<string | null>(null)

  const usage = toUsageSnippet({
    component: 'VoicePill',
    from: '@/components/shared/voice-pill',
    props: {
      size,
      shape,
      mode,
      reactive,
      sensitivity,
      showTime,
      waveform,
      slideToCancel,
    },
    defaults: DEFAULTS,
  })

  const handleStop = (info: {
    reason: VoicePillStopReason
    duration: number
  }) => {
    setLastTake(`${info.reason} after ${(info.duration / 1000).toFixed(1)}s`)
  }

  return (
    <DemoPage
      eyebrow="shared / voice-pill"
      title="Voice pill"
      description="Tap to toggle, or hold to talk. The mic button grows into a live waveform pill with a timer; slide left to cancel."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSlider
            label="Size"
            value={size}
            onValueChange={(value) => settings.set('size', value)}
            min={20}
            max={56}
            unit="px"
          />
          <DemoSlider
            label="Sensitivity"
            value={sensitivity}
            onValueChange={(value) => settings.set('sensitivity', value)}
            min={0.25}
            max={3}
            step={0.25}
          />
          <DemoControlGroup
            title="Shape"
            options={SHAPES}
            value={shape}
            onChange={(value) => settings.set('shape', value)}
          />
          <DemoControlGroup
            title="Mode"
            options={MODES}
            value={mode}
            onChange={(value) => settings.set('mode', value)}
          />
          <DemoControlGroup
            title="Input"
            options={SOURCES}
            value={reactive}
            onChange={(value) => settings.set('reactive', value)}
          />
          <DemoSwitch
            label="Timer"
            checked={showTime}
            onCheckedChange={(value) => settings.set('showTime', value)}
          />
          <DemoSwitch
            label="Waveform"
            checked={waveform}
            onCheckedChange={(value) => settings.set('waveform', value)}
          />
          <DemoSwitch
            label="Slide to cancel"
            checked={slideToCancel}
            onCheckedChange={(value) => settings.set('slideToCancel', value)}
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/shared/voice-pill/'],
        usage,
        props: PROPS,
      }}
    >
      <div className="flex flex-col items-center gap-6">
        <VoicePill
          size={size}
          shape={shape}
          mode={mode}
          reactive={reactive}
          sensitivity={sensitivity}
          showTime={showTime}
          waveform={waveform}
          slideToCancel={slideToCancel}
          onStop={handleStop}
        />
        <p className="text-center text-sm text-muted-foreground">
          {lastTake
            ? `Last take: ${lastTake}`
            : reactive === 'mic'
              ? 'Uses your microphone — the browser will ask first.'
              : 'Simulated input, no microphone needed.'}
        </p>
      </div>
    </DemoPage>
  )
}
