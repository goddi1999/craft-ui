import { useEffect, useEffectEvent, useLayoutEffect, useRef, useState, type FocusEvent } from 'react'

import {
  DemoAction,
  DemoSettings,
  DemoSlider,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { PromptBox } from '@/components/ui/prompt-box'

const PROMPTS = [
  'Draft the 2.4 release email from the merged pull requests',
  'Turn these meeting notes into three clear next steps',
  'Find unused feature flags across web and api',
]

// the demo types, sends and answers by itself until you click into the field
const START_MS = 600
const TYPE_MS = 35
const SEND_PAUSE_MS = 700
// matches the component: the field empties 300ms after sending,
// and a finished status folds away after 1.6s
const CLEAR_MS = 300
const LINGER_MS = 1600
const NEXT_PROMPT_MS = 700

const DEFAULTS = {
  placeholder: 'Ask anything',
  doneStatus: 'Draft ready',
  answerSeconds: 2.3,
}

const COMPONENT_DEFAULTS = { placeholder: 'Ask anything', busy: false }

const PROPS: DemoPropDoc[] = [
  { name: 'value', type: 'string', description: 'The prompt text. Pass it with onValueChange to control the field.' },
  { name: 'defaultValue', type: 'string', default: "''", description: 'Starting text when uncontrolled.' },
  { name: 'onValueChange', type: '(value: string) => void', description: 'Called on every edit.' },
  {
    name: 'onSubmit',
    type: '(prompt: string) => void',
    description: 'Enter or Send, with the trimmed prompt. The field empties 300ms later. Shift+Enter is a new line.',
  },
  {
    name: 'busy',
    type: 'boolean',
    default: 'false',
    description: 'An answer is being written: the status line opens and Send turns into Stop.',
  },
  { name: 'onStop', type: '() => void', description: 'Stop was pressed while busy.' },
  {
    name: 'status',
    type: 'string',
    description:
      'Status line text. Shimmers while busy; once busy ends it shows with a green dot for 1.6s, then folds away. Defaults to Thinking / Done.',
  },
  { name: 'placeholder', type: 'string', default: "'Ask anything'", description: "Also the field's accessible name." },
  { name: 'className', type: 'string', description: 'Merged onto the box.' },
]

export function PromptBoxPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { placeholder, doneStatus, answerSeconds } = settings.values
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('Thinking')
  const [autoplay, setAutoplay] = useState(true)
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>())
  const nextPrompt = useRef(0)
  // scheduled steps run later, so they read the settings from here
  const live = useRef({ ...settings.values, autoplay })
  useLayoutEffect(() => {
    live.current = { ...settings.values, autoplay }
  })

  const later = (ms: number, step: () => void) => {
    const timer = setTimeout(() => {
      timers.current.delete(timer)
      step()
    }, ms)
    timers.current.add(timer)
  }

  const clearAll = () => {
    timers.current.forEach(clearTimeout)
    timers.current.clear()
  }

  const finishAnswer = () => {
    setBusy(false)
    setStatus(live.current.doneStatus)
    if (live.current.autoplay) later(LINGER_MS + NEXT_PROMPT_MS, typeNextPrompt)
  }

  const startAnswer = () => {
    setStatus('Thinking')
    setBusy(true)
    later(live.current.answerSeconds * 1000, finishAnswer)
  }

  function typeNextPrompt() {
    const prompt = PROMPTS[nextPrompt.current++ % PROMPTS.length]
    for (let i = 1; i <= prompt.length; i++) later(i * TYPE_MS, () => setText(prompt.slice(0, i)))
    later(prompt.length * TYPE_MS + SEND_PAUSE_MS, () => {
      startAnswer()
      later(CLEAR_MS, () => setText(''))
    })
  }

  const startStory = useEffectEvent(() => {
    // a running answer carries the story on when it finishes
    if (busy) return
    clearAll()
    later(START_MS, typeNextPrompt)
  })

  useEffect(() => {
    if (autoplay) startStory()
  }, [autoplay])

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach(clearTimeout)
  }, [])

  // clicking into the field takes over from the story
  const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
    if (!autoplay || !(event.target instanceof HTMLTextAreaElement)) return
    setAutoplay(false)
    if (busy) return
    clearAll()
    setText('')
  }

  const handleSubmit = () => {
    if (autoplay) {
      setAutoplay(false)
      clearAll()
    }
    startAnswer()
  }

  const handleStop = () => {
    setAutoplay(false)
    clearAll()
    setBusy(false)
    setStatus('Stopped')
  }

  const usage = toUsageSnippet({
    component: 'PromptBox',
    from: '@/components/ui/prompt-box',
    props: {
      value: { expression: 'prompt' },
      onValueChange: { expression: 'setPrompt' },
      onSubmit: { expression: 'ask' },
      busy: { expression: 'answering' },
      onStop: { expression: 'stop' },
      status: { expression: `answering ? 'Thinking' : '${doneStatus}'` },
      placeholder,
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / prompt-box"
      title="Prompt Box"
      description="An AI prompt field. It grows with the text on a spring, Send spins into Stop while it answers, and a status line opens above the text, shimmering while it thinks and turning green when the draft is ready. Adapted from Design Bookmark's motion studies."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoTextField
            label="Placeholder"
            value={placeholder}
            onValueChange={(next) => settings.set('placeholder', next)}
            maxLength={40}
          />
          <DemoTextField
            label="Done status"
            value={doneStatus}
            onValueChange={(next) => settings.set('doneStatus', next)}
            maxLength={30}
          />
          <DemoSlider
            label="Answer time"
            value={answerSeconds}
            onValueChange={(next) => settings.set('answerSeconds', next)}
            min={0.5}
            max={6}
            step={0.1}
            unit="s"
          />
          <DemoAction onClick={() => setAutoplay(true)} disabled={autoplay}>
            Play demo
          </DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/prompt-box/'], usage, props: PROPS }}
    >
      <PromptBox
        value={text}
        onValueChange={setText}
        onSubmit={handleSubmit}
        busy={busy}
        onStop={handleStop}
        status={status}
        placeholder={placeholder}
        onFocus={handleFocus}
      />
    </DemoPage>
  )
}
