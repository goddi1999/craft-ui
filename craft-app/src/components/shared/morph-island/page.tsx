import { useEffect, useState } from 'react'

import {
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { MorphIsland, type MorphIslandState } from '@/components/ui/morph-island'

const STATES: readonly MorphIslandState[] = ['idle', 'timer', 'upload', 'call']
// the little story the island plays until someone touches it
const STORY: readonly MorphIslandState[] = ['timer', 'upload', 'call', 'idle']
// --island-cycle-ms: one step of the story
const CYCLE_MS = 2800
const START_MS = 600

const DEFAULTS = {
  autoplay: true,
  caller: 'Maya Collins',
  file: 'release-2.4.zip',
  minutes: 25,
}

const COMPONENT_DEFAULTS = {
  timerLabel: 'Timer',
  timerSeconds: 299,
  uploadFile: 'file.zip',
  callerName: 'Unknown caller',
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'value',
    type: "'idle' | 'timer' | 'upload' | 'call'",
    description: 'The activity on show. Pass it with onValueChange to control the island.',
  },
  {
    name: 'defaultValue',
    type: "'idle' | 'timer' | 'upload' | 'call'",
    default: "'idle'",
    description: 'Starting state when uncontrolled.',
  },
  {
    name: 'onValueChange',
    type: '(value) => void',
    description:
      'Called when the island is tapped (it steps to the next activity) or a call is answered or declined (idle).',
  },
  { name: 'timerLabel', type: 'string', default: "'Timer'", description: 'Label next to the timer icon.' },
  {
    name: 'timerSeconds',
    type: 'number',
    default: '299',
    description: 'The timer counts down from here each time it opens.',
  },
  { name: 'uploadLabel', type: 'string', default: "'Uploading'", description: 'First line of the upload.' },
  { name: 'uploadFile', type: 'string', default: "'file.zip'", description: 'File name under it.' },
  {
    name: 'uploadProgress',
    type: 'number',
    description: '0 to 1. Leave it out and the ring fills over 2.4s each time the upload opens.',
  },
  { name: 'callerName', type: 'string', default: "'Unknown caller'", description: 'Who is calling.' },
  { name: 'callerDetail', type: 'string', default: "'Incoming call'", description: 'Line under the name.' },
  {
    name: 'callerAvatar',
    type: 'ReactNode',
    description: 'Replaces the glowing orb, e.g. an <img>. Clipped to a 48px circle.',
  },
  { name: 'onAccept', type: '() => void', description: 'Accept button; the island also goes back to idle.' },
  { name: 'onDecline', type: '() => void', description: 'Decline button; the island also goes back to idle.' },
  { name: 'className', type: 'string', description: 'Merged onto the island.' },
]

export function MorphIslandPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { autoplay, caller, file, minutes } = settings.values
  const [state, setState] = useState<MorphIslandState>('idle')

  useEffect(() => {
    if (!autoplay) return
    let step = 0
    let cycle: ReturnType<typeof setInterval> | undefined
    const next = () => setState(STORY[step++ % STORY.length])
    const start = setTimeout(() => {
      next()
      cycle = setInterval(next, CYCLE_MS)
    }, START_MS)
    return () => {
      clearTimeout(start)
      clearInterval(cycle)
    }
  }, [autoplay])

  // any touch hands the island over to the viewer
  const handleChange = (next: MorphIslandState) => {
    settings.set('autoplay', false)
    setState(next)
  }

  const usage = toUsageSnippet({
    component: 'MorphIsland',
    from: '@/components/ui/morph-island',
    props: {
      value: { expression: 'activity' },
      onValueChange: { expression: 'setActivity' },
      timerLabel: 'Focus',
      timerSeconds: minutes * 60,
      uploadFile: file,
      callerName: caller,
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / morph-island"
      title="Morph Island"
      description="A grey pill that morphs between live activities: a focus timer, an upload ring and an incoming call. Width and height ride separate springs, so each change lands sideways first and then drops into place while the content cross-fades with blur. Adapted from Design Bookmark's motion studies."
      align="start"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup title="State" options={STATES} value={state} onChange={handleChange} />
          <DemoSwitch
            label="Autoplay"
            checked={autoplay}
            onCheckedChange={(next) => settings.set('autoplay', next)}
          />
          <DemoTextField
            label="Caller"
            value={caller}
            onValueChange={(next) => settings.set('caller', next)}
            maxLength={40}
          />
          <DemoTextField
            label="File"
            value={file}
            onValueChange={(next) => settings.set('file', next)}
            maxLength={40}
          />
          <DemoSlider
            label="Focus timer"
            value={minutes}
            onValueChange={(next) => settings.set('minutes', next)}
            min={1}
            max={60}
            unit=" min"
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/morph-island/'], usage, props: PROPS }}
    >
      {/* the island hangs from the top and grows down, like the real one */}
      <div className="flex w-full justify-center pt-16">
        <MorphIsland
          value={state}
          onValueChange={handleChange}
          timerLabel="Focus"
          timerSeconds={minutes * 60}
          uploadFile={file}
          callerName={caller}
        />
      </div>
    </DemoPage>
  )
}
