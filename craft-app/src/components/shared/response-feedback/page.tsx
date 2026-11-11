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
  ResponseFeedback,
  emptyFeedback,
  type Feedback,
  type ResponseFeedbackVariant,
} from '@/components/ui/response-feedback'

const VARIANTS: ResponseFeedbackVariant[] = ['inline', 'detailed']

const DEFAULTS = {
  variant: 'inline' as ResponseFeedbackVariant,
  controlled: false,
  copy: true,
  regenerate: true,
  undoSeconds: 5,
}

const COMPONENT_DEFAULTS = { variant: 'inline', undoMs: 5000 }

const PROPS: DemoPropDoc[] = [
  { name: 'value', type: 'Feedback', description: 'Controlled state: rating, reasons, note and status (idle, open or sent). Leave it out and the component keeps its own.' },
  { name: 'onValueChange', type: '(value: Feedback) => void', description: 'Called on every change of the state.' },
  { name: 'onRate', type: '(rating) => void', description: "Called on a thumbs up, or when a thumbs down or a 1–5 rating is chosen." },
  { name: 'onSubmit', type: '({ rating, reasons, note }) => void', description: 'Called when Send feedback is pressed.' },
  { name: 'onUndo', type: '() => void', description: 'Called when Undo is pressed after a submit.' },
  { name: 'undoMs', type: 'number', default: '5000', description: 'How long Undo stays available after a submit.' },
  { name: 'onCopy', type: '() => void', description: 'Shows a Copy button in the inline row.' },
  { name: 'onRegenerate', type: '() => void', description: 'Shows a Regenerate button in the inline row.' },
  { name: 'reasons', type: 'string[]', default: "['Inaccurate', 'Not helpful', 'Too long', 'Unsafe', 'Other']", description: 'The reason chips.' },
  { name: 'variant', type: "'inline' | 'detailed'", default: "'inline'", description: 'Thumbs under an answer, or a 1–5 rating card with the reasons always shown.' },
  { name: 'className', type: 'string', description: 'Extra classes for the root.' },
]

export function ResponseFeedbackPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { variant, controlled, copy, regenerate, undoSeconds } = settings.values
  const [value, setValue] = useState<Feedback>(emptyFeedback)
  const [log, setLog] = useState('Nothing yet.')
  // Bumping this remounts the uncontrolled component, which clears its own state.
  const [run, setRun] = useState(0)

  const reset = () => {
    setValue(emptyFeedback)
    setRun((n) => n + 1)
    setLog('Nothing yet.')
  }

  const usage = toUsageSnippet({
    component: 'ResponseFeedback',
    from: '@/components/ui/response-feedback',
    props: {
      value: controlled ? { expression: 'feedback' } : undefined,
      onValueChange: controlled ? { expression: 'setFeedback' } : undefined,
      onRate: { expression: '(rating) => track(rating)' },
      onSubmit: { expression: '(feedback) => api.send(feedback)' },
      onCopy: copy ? { expression: 'copyAnswer' } : undefined,
      onRegenerate: regenerate && variant === 'inline' ? { expression: 'regenerate' } : undefined,
      undoMs: undoSeconds * 1000,
      variant,
    },
    defaults: COMPONENT_DEFAULTS,
  })

  const inline = variant === 'inline'

  return (
    <DemoPage
      eyebrow="ui / response-feedback"
      title="Response Feedback"
      description={
        <>
          Feedback on one answer: thumbs under the text that open a reasons
          form on a thumbs down, or a 1–5 rating card. Send can be undone for a
          few seconds. Adapted from{' '}
          <a href="https://tuffui.com" target="_blank" rel="noreferrer">
            TuffUI
          </a>{' '}
          (MIT).
        </>
      }
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Variant"
            options={VARIANTS}
            value={variant}
            onChange={(next) => {
              settings.set('variant', next)
              reset()
            }}
          />
          <DemoSlider
            label="Undo window"
            value={undoSeconds}
            onValueChange={(next) => settings.set('undoSeconds', next)}
            min={1}
            max={10}
            unit="s"
          />
          <DemoSwitch
            label="Controlled"
            checked={controlled}
            onCheckedChange={(next) => settings.set('controlled', next)}
          />
          <DemoSwitch
            label="Copy button"
            checked={copy}
            onCheckedChange={(next) => settings.set('copy', next)}
          />
          <DemoSwitch
            label="Regenerate button"
            checked={regenerate}
            onCheckedChange={(next) => settings.set('regenerate', next)}
          />
          <DemoAction onClick={reset}>Reset feedback</DemoAction>
        </DemoSettings>
      }
      docs={{
        paths: [
          'src/components/ui/response-feedback/',
          'src/components/ui/surface/',
          'src/components/ui/button.tsx',
          'src/components/ui/textarea.tsx',
        ],
        usage,
        props: PROPS,
      }}
    >
      <div className="flex w-full max-w-lg flex-col gap-3">
        {inline && (
          <p className="text-[0.9375rem] leading-relaxed">
            Cache resized images by content hash in{' '}
            <code className="rounded-md bg-foreground/[0.06] px-1 font-mono text-[0.85em]">
              .pressd/cache
            </code>
            . On each build, hash the source and the resize options; if the key
            exists, copy the cached output instead of running sharp again.
          </p>
        )}
        <ResponseFeedback
          key={`${variant}-${controlled}-${run}`}
          variant={variant}
          value={controlled ? value : undefined}
          onValueChange={controlled ? setValue : undefined}
          undoMs={undoSeconds * 1000}
          onRate={(rating) => setLog(`Rated ${rating}`)}
          onSubmit={(feedback) =>
            setLog(`Sent ${feedback.rating}, ${feedback.reasons.join(' + ') || 'no reasons'}${feedback.note ? `, "${feedback.note}"` : ''}`)
          }
          onUndo={() => setLog('Send undone')}
          onCopy={copy ? () => setLog('Copied the answer') : undefined}
          onRegenerate={regenerate && inline ? () => { setLog('Regenerating…'); reset() } : undefined}
        />
        <p className="text-xs text-muted-foreground" aria-live="polite">
          {log}
        </p>
      </div>
    </DemoPage>
  )
}
