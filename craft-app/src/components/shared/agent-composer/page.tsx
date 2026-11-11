import { useCallback, useEffect, useRef, useState } from 'react'

import {
  DemoAction,
  DemoControlGroup,
  DemoSettings,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import {
  AgentComposer,
  type ComposerContextItem,
  type ComposerMessage,
  type ComposerMode,
  type ComposerQueued,
} from '@/components/ui/agent-composer'

import { COMMANDS, FILES, MODELS } from './agent-composer.data'

// How long the simulated agent run lasts before it pops the next queued message.
const RUN_MS = 3000

const STATUSES = ['idle', 'streaming'] as const

const DEFAULTS = {
  showModes: true,
  allowAttachments: true,
  status: 'idle' as (typeof STATUSES)[number],
}

const COMPONENT_DEFAULTS = {
  showModes: true,
  allowAttachments: true,
  status: 'idle',
}

const PROPS: DemoPropDoc[] = [
  { name: 'onSubmit', type: '(message: ComposerMessage) => void', description: 'Called on Enter or Send when the agent is idle, with the text, mode, context items and model. The context tray clears afterwards.' },
  { name: 'status', type: "'idle' | 'streaming'", default: "'idle'", description: 'While streaming, Enter queues the message instead of sending, and a Stop button appears.' },
  { name: 'queue / onQueueChange', type: 'ComposerQueued[]', description: 'Messages written while the agent works, shown above the input with remove buttons. Send the next one when a run ends.' },
  { name: 'onStop', type: '() => void', description: 'Called by the Stop button.' },
  { name: 'mode / onModeChange', type: "'ask' | 'plan' | 'act'", default: "'act'", description: 'The Ask / Plan / Act switch in the header, with a hint for the active mode.' },
  { name: 'showModes', type: 'boolean', default: 'true', description: 'Hide the mode switch; messages are then sent as act.' },
  { name: 'context / onContextChange', type: 'ComposerContextItem[]', description: 'Files and attachments in the context tray, each with a token count and a running total.' },
  { name: 'files', type: 'ComposerFile[]', description: 'Candidates for the @ mention menu. Picking one adds it to the tray.' },
  { name: 'commands', type: 'ComposerCommand[]', description: 'Slash commands. Typing / at the start opens a filterable menu.' },
  { name: 'models / model / onModelChange', type: 'ComposerModel[] · string', description: 'Shown as the model id in the header; clicking switches to the next model.' },
  { name: 'value / onValueChange', type: 'string', description: 'Control the text. Uncontrolled when omitted, like mode, context and queue.' },
  { name: 'allowAttachments', type: 'boolean', default: 'true', description: 'Shows Add context, which opens a file picker (tokens estimated at 4 bytes each).' },
  { name: 'placeholder', type: 'string', description: 'Textarea placeholder.' },
  { name: 'className', type: 'string', description: 'Extra classes for the root element.' },
]

export function AgentComposerPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { showModes, allowAttachments, status } = settings.values
  const [value, setValue] = useState('')
  const [mode, setMode] = useState<ComposerMode>('act')
  const [context, setContext] = useState<ComposerContextItem[]>([
    { id: FILES[1].id, name: FILES[1].path, tokens: FILES[1].tokens },
  ])
  const [queue, setQueue] = useState<ComposerQueued[]>([])
  const [model, setModel] = useState(MODELS[0].id)
  const [last, setLast] = useState<ComposerMessage | null>(null)
  const queueRef = useRef(queue)
  queueRef.current = queue

  // settings.set changes identity every render; a stable wrapper keeps the run timer from resetting.
  const setRef = useRef(settings.set)
  setRef.current = settings.set
  const setStatus = useCallback(
    (next: (typeof STATUSES)[number]) => setRef.current('status', next),
    [],
  )

  // Simulated agent run: after RUN_MS take the next queued message and keep
  // working on it, otherwise go idle.
  useEffect(() => {
    if (status !== 'streaming') return
    const timer = setTimeout(() => {
      const [next, ...rest] = queueRef.current
      if (next) {
        setQueue(rest)
        setLast((prev) => (prev ? { ...prev, text: next.text } : prev))
        setStatus('streaming')
      } else setStatus('idle')
    }, RUN_MS)
    return () => clearTimeout(timer)
  }, [status, queue.length, setStatus])

  const usage = toUsageSnippet({
    component: 'AgentComposer',
    from: '@/components/ui/agent-composer',
    props: {
      status,
      files: { expression: 'files' },
      commands: { expression: 'commands' },
      models: { expression: 'models' },
      queue: { expression: 'queue' },
      onQueueChange: { expression: 'setQueue' },
      onSubmit: { expression: '({ text, mode, context, model }) => send(text)' },
      onStop: { expression: 'stop' },
      showModes,
      allowAttachments,
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / agent-composer"
      title="Agent Composer"
      description={
        <>
          A chat input for AI agents: an Ask / Plan / Act switch, a model
          chip, a context tray with token counts, @ file mentions and / command
          menus (arrows, Enter or Tab to pick, Escape to dismiss) and a message
          queue while the agent is working. Adapted from{' '}
          <a href="https://tuffui.com" target="_blank" rel="noreferrer">
            TuffUI
          </a>{' '}
          (MIT).
        </>
      }
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSwitch
            label="Show modes"
            checked={showModes}
            onCheckedChange={(next) => settings.set('showModes', next)}
          />
          <DemoSwitch
            label="Allow attachments"
            checked={allowAttachments}
            onCheckedChange={(next) => settings.set('allowAttachments', next)}
          />
          <DemoControlGroup
            title="Status"
            options={STATUSES}
            value={status}
            onChange={(next) => settings.set('status', next)}
          />
          <DemoAction
            onClick={() => {
              setValue('')
              setQueue([])
              setStatus('idle')
              setLast(null)
            }}
          >
            Clear
          </DemoAction>
        </DemoSettings>
      }
      docs={{
        paths: [
          'src/components/ui/agent-composer/',
          'src/components/ui/kbd/',
          'src/components/ui/segmented-control/',
          'src/components/ui/surface/',
        ],
        usage,
        props: PROPS,
      }}
    >
      {/* Room above for the @ and / menus, which open upwards. */}
      <div className="flex w-full max-w-xl flex-col justify-end gap-3 pt-40">
        <AgentComposer
          value={value}
          onValueChange={setValue}
          mode={mode}
          onModeChange={setMode}
          showModes={showModes}
          context={context}
          onContextChange={setContext}
          files={FILES}
          commands={COMMANDS}
          models={MODELS}
          model={model}
          onModelChange={setModel}
          status={status}
          queue={queue}
          onQueueChange={setQueue}
          allowAttachments={allowAttachments}
          onSubmit={(message) => {
            setLast(message)
            setStatus('streaming')
          }}
          onStop={() => {
            setQueue([])
            setStatus('idle')
          }}
        />
        <p
          role="status"
          aria-live="polite"
          className="min-h-5 truncate px-2 font-mono text-xs text-muted-foreground"
        >
          {last
            ? `Sent: "${last.text}" · ${last.mode} · ${last.context.length} files · ${last.model}`
            : 'Type a message and press Enter'}
        </p>
      </div>
    </DemoPage>
  )
}
