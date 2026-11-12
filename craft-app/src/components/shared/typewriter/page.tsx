import { useState } from 'react'

import {
  DemoAction,
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import {
  Typewriter,
  type TypewriterDeleteMode,
  type TypewriterSequence,
} from '@/components/ui/typewriter'

const PHRASES: TypewriterSequence[] = [
  { text: 'Write the tests', deleteAfter: true },
  { text: 'Fix the build', deleteAfter: true },
  { text: 'Ship on Friday', deleteAfter: false },
]

const DELETE_MODES: readonly TypewriterDeleteMode[] = ['backspace', 'select']

const DEFAULTS = {
  deleteMode: 'backspace' as TypewriterDeleteMode,
  typingSpeed: 50,
  typos: true,
  naturalVariance: true,
  paused: false,
}

const COMPONENT_DEFAULTS = {
  deleteMode: 'backspace',
  typingSpeed: 50,
  typos: false,
  naturalVariance: true,
  paused: false,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'sequences',
    type: '{ text: string; deleteAfter?: boolean; pauseAfter?: number }[]',
    description: 'Phrases to type, in order. `pauseAfter` overrides `pauseBeforeDelete` for one phrase.',
  },
  { name: 'typingSpeed', type: 'number', default: '50', description: 'Milliseconds per character.' },
  { name: 'deleteSpeed', type: 'number', default: '30', description: 'Milliseconds per character when backspacing.' },
  { name: 'startDelay', type: 'number', default: '200', description: 'Milliseconds before the first key.' },
  {
    name: 'pauseBeforeDelete',
    type: 'number',
    default: '1000',
    description: 'Milliseconds a finished phrase holds before it is erased.',
  },
  { name: 'autoLoop', type: 'boolean', default: 'true', description: 'Start over after the last phrase, erasing it too.' },
  { name: 'loopDelay', type: 'number', default: '1000', description: 'Milliseconds between the last phrase and the first again.' },
  {
    name: 'naturalVariance',
    type: 'boolean',
    default: 'true',
    description: 'Type like a person: occasional hesitations and bursts, otherwise +/- 40%.',
  },
  {
    name: 'deleteMode',
    type: "'backspace' | 'select'",
    default: "'backspace'",
    description: 'Erase key by key, or highlight right to left like Shift+Home and cut in one go.',
  },
  {
    name: 'typos',
    type: 'boolean | number',
    default: 'false',
    description: 'Now and then hit a neighbouring key, pause, backspace and fix it. `true` is about 4% per letter.',
  },
  { name: 'seed', type: 'number', default: '7', description: 'Seeds the variance and typos, so every visit types the same way.' },
  {
    name: 'paused',
    type: 'boolean',
    default: 'false',
    description: 'Stops where it is (WCAG 2.2.2). It also pauses off screen; with reduced motion only the last phrase shows.',
  },
  { name: 'as', type: "'div' | 'p' | 'span' | 'h1' | 'h2' | 'h3'", default: "'div'", description: 'Element to render, e.g. `h1` for a page title.' },
  { name: 'textClassName', type: 'string', description: 'Classes for the text, e.g. to fix the font size. Otherwise the wrapper width picks it.' },
  { name: 'className', type: 'string', description: 'Merged onto the wrapper.' },
]

export function TypewriterPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { deleteMode, typingSpeed, typos, naturalVariance, paused } = settings.values
  const [run, setRun] = useState(0)

  const usage = toUsageSnippet({
    component: 'Typewriter',
    from: '@/components/ui/typewriter',
    props: {
      sequences: { expression: 'phrases' },
      deleteMode,
      typingSpeed,
      typos,
      naturalVariance,
      paused,
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / typewriter"
      title="Typewriter"
      description="Types each phrase with a human rhythm, slips on a neighbouring key now and then and fixes it, then erases key by key or highlights and cuts. The caret stays solid while typing and blinks once idle. Adapted from Kokonut UI (MIT)."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Delete mode"
            options={DELETE_MODES}
            value={deleteMode}
            onChange={(next) => settings.set('deleteMode', next)}
          />
          <DemoSlider
            label="Typing speed"
            value={typingSpeed}
            onValueChange={(next) => settings.set('typingSpeed', next)}
            min={20}
            max={150}
            step={5}
            unit="ms"
          />
          <DemoSwitch label="Typos" checked={typos} onCheckedChange={(next) => settings.set('typos', next)} />
          <DemoSwitch
            label="Natural rhythm"
            checked={naturalVariance}
            onCheckedChange={(next) => settings.set('naturalVariance', next)}
          />
          <DemoSwitch label="Paused" checked={paused} onCheckedChange={(next) => settings.set('paused', next)} />
          <DemoAction onClick={() => setRun((value) => value + 1)}>Restart</DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/typewriter/'], usage, props: PROPS }}
    >
      <div className="w-full max-w-3xl">
        <Typewriter
          key={run}
          sequences={PHRASES}
          deleteMode={deleteMode}
          typingSpeed={typingSpeed}
          typos={typos}
          naturalVariance={naturalVariance}
          paused={paused}
          className="font-semibold"
        />
      </div>
    </DemoPage>
  )
}
