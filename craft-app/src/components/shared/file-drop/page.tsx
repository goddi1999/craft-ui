import { useState } from 'react'

import {
  DemoSettings,
  DemoSwitch,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { FileDrop, type FileDropSample } from '@/components/ui/file-drop'

const SAMPLE: FileDropSample = { name: 'launch-brief.pdf', size: 2_400_000 }

const DEFAULTS = {
  autoPlay: true,
  multiple: false,
  hint: 'PDF, PNG or MP4, up to 20 MB',
}

const COMPONENT_DEFAULTS = {
  autoPlay: false,
  multiple: false,
  hint: 'or click to choose one',
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'onFilesChange',
    type: '(files: File[]) => void',
    description:
      'Called with the dropped or picked files (only the first unless `multiple`). Nothing is uploaded for you.',
  },
  {
    name: 'progress',
    type: 'number',
    description:
      'Real upload progress from 0 to 1; the circle floods green once the ring reaches 1. Leave it out to play a simulated 2.1 s upload. Reset it to 0 for each new file.',
  },
  {
    name: 'accept',
    type: 'string',
    description: 'Passed to the file picker. Dropped files are not filtered, so check them yourself.',
  },
  {
    name: 'multiple',
    type: 'boolean',
    default: 'false',
    description: 'Take every file; the zone then shows the count and the total size.',
  },
  {
    name: 'label',
    type: 'string',
    default: "'Drop your file here'",
    description: 'First line while idle.',
  },
  {
    name: 'hint',
    type: 'string',
    default: "'or click to choose one'",
    description: 'Second line while idle.',
  },
  {
    name: 'autoPlay',
    type: 'boolean',
    default: 'false',
    description:
      'While idle, carry `sample` in and upload it on a loop. Pauses for 8 s whenever someone drags, drops or clicks.',
  },
  {
    name: 'sample',
    type: '{ name: string; size: number }',
    default: "{ name: 'brief.pdf', size: 2_400_000 }",
    description: 'The pretend file autoplay carries in.',
  },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Ignores drops and clicks.' },
  { name: 'className', type: 'string', description: 'Merged onto the wrapper; set a width here.' },
]

export function FileDropPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { autoPlay, multiple, hint } = settings.values
  const [received, setReceived] = useState<File[]>([])

  const usage = toUsageSnippet({
    component: 'FileDrop',
    from: '@/components/ui/file-drop',
    props: {
      hint,
      multiple,
      autoPlay,
      onFilesChange: { expression: 'setFiles' },
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / file-drop"
      title="File Drop"
      description="A drop zone that wakes up when a file comes near. The file drifts in on a lazy spring and leans with its speed, the circle gulps it, and a ring fills around a rolling percentage that stalls halfway like a real upload before the circle floods green and the check draws itself. Adapted from Design Bookmark's motion studies."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSwitch
            label="Autoplay"
            checked={autoPlay}
            onCheckedChange={(next) => settings.set('autoPlay', next)}
          />
          <DemoSwitch
            label="Multiple files"
            checked={multiple}
            onCheckedChange={(next) => settings.set('multiple', next)}
          />
          <DemoTextField
            label="Hint"
            value={hint}
            onValueChange={(next) => settings.set('hint', next)}
            maxLength={40}
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/file-drop/'], usage, props: PROPS }}
    >
      <div className="flex w-full flex-col items-center gap-6">
        <FileDrop
          hint={hint}
          sample={SAMPLE}
          autoPlay={autoPlay}
          multiple={multiple}
          onFilesChange={setReceived}
        />
        <p aria-live="polite" className="max-w-xs truncate text-center text-sm text-muted-foreground">
          {received.length === 0
            ? 'Drop a real file. Only its name and size are read.'
            : `Got ${received.map((file) => file.name).join(', ')}`}
        </p>
      </div>
    </DemoPage>
  )
}
