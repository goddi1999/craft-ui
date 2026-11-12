import { useEffect, useState } from 'react'

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
import { UnlockFaceId, type UnlockStatus } from '@/components/ui/unlock-face-id'

const OUTCOMES = ['match', 'no match'] as const

const DEFAULTS = {
  outcome: 'match' as (typeof OUTCOMES)[number],
  scanDuration: 1800,
  size: 128,
  gated: true,
}

const COMPONENT_DEFAULTS = { scanDuration: 1800, size: 128 }

const SECRETS = [
  { name: 'STRIPE_SECRET_KEY', value: 'sk_live_••••••••4f2a', meta: 'Rotated 3 days ago' },
  { name: 'DATABASE_URL', value: 'postgres://app@db-prod-eu-1', meta: 'Updated 2 weeks ago' },
  { name: 'SENTRY_AUTH_TOKEN', value: 'sntrys_••••••••91c0', meta: 'Rotated yesterday' },
]

const PROPS: DemoPropDoc[] = [
  {
    name: 'children',
    type: 'ReactNode',
    description: 'Content gated behind the scan: blurred and inert while locked, sharp once unlocked.',
  },
  {
    name: 'status',
    type: "'idle' | 'scanning' | 'success' | 'error'",
    description: 'Controlled status. You decide how a scan ends by setting `success` or `error`.',
  },
  {
    name: 'defaultStatus',
    type: 'UnlockStatus',
    default: "'idle'",
    description: 'Starting status when uncontrolled.',
  },
  {
    name: 'onStatusChange',
    type: '(status: UnlockStatus) => void',
    description:
      'Called with the status a press asks for (`scanning`, or `idle` after an error), and with `success` when an uncontrolled scan resolves.',
  },
  { name: 'onScan', type: '() => void', description: 'Called whenever the trigger is pressed.' },
  { name: 'onComplete', type: '() => void', description: 'Called when an uncontrolled scan resolves.' },
  {
    name: 'scanDuration',
    type: 'number',
    default: '1800',
    description: 'How long an uncontrolled scan takes, in ms.',
  },
  { name: 'size', type: 'number', default: '128', description: 'Rendered size of the glyph, in px.' },
  {
    name: 'label',
    type: 'string',
    default: "'Scan to unlock'",
    description: 'Accessible label for the scan trigger.',
  },
  {
    name: 'errorMessage',
    type: 'string',
    default: "'Face not recognized. Try again.'",
    description: 'Status message shown on `error`.',
  },
  { name: 'className', type: 'string', description: 'Merged onto the root element.' },
]

function SecretsCard() {
  return (
    <div className="mx-auto w-full max-w-sm rounded-2xl bg-muted p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <p className="text-sm font-medium text-foreground">Production secrets</p>
        <p className="text-xs text-muted-foreground">{SECRETS.length} variables</p>
      </div>
      <ul className="flex flex-col gap-3">
        {SECRETS.map((secret) => (
          <li key={secret.name} className="flex flex-col gap-0.5">
            <span className="text-xs font-medium text-foreground">{secret.name}</span>
            <span className="flex justify-between gap-3 text-xs text-muted-foreground">
              <span className="truncate">{secret.value}</span>
              <span className="shrink-0">{secret.meta}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function UnlockFaceIdPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { outcome, scanDuration, size, gated } = settings.values
  // the demo drives the status itself so it can show a miss as well as a match
  const [status, setStatus] = useState<UnlockStatus>('idle')

  useEffect(() => {
    if (status !== 'scanning') return
    const id = setTimeout(
      () => setStatus(outcome === 'match' ? 'success' : 'error'),
      scanDuration,
    )
    return () => clearTimeout(id)
  }, [status, outcome, scanDuration])

  const usage = toUsageSnippet({
    component: 'UnlockFaceId',
    from: '@/components/ui/unlock-face-id',
    props: { scanDuration, size, onComplete: { expression: 'handleUnlock' } },
    defaults: COMPONENT_DEFAULTS,
    children: gated ? '<SecretsList />' : undefined,
  })

  return (
    <DemoPage
      eyebrow="ui / unlock-face-id"
      title="Unlock Face ID"
      description="A Face ID mark that draws itself in, corner by corner. Press it and a scan band sweeps the face; a match springs into a check and unblurs what it guards, a miss shakes the glyph red. Adapted from SmoothUI (MIT)."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Outcome"
            options={OUTCOMES}
            value={outcome}
            onChange={(next) => settings.set('outcome', next)}
          />
          <DemoSlider
            label="Scan time"
            value={scanDuration}
            onValueChange={(next) => settings.set('scanDuration', next)}
            min={600}
            max={4000}
            step={100}
            unit="ms"
          />
          <DemoSlider
            label="Size"
            value={size}
            onValueChange={(next) => settings.set('size', next)}
            min={64}
            max={192}
            step={8}
            unit="px"
          />
          <DemoSwitch
            label="Gate content"
            checked={gated}
            onCheckedChange={(next) => settings.set('gated', next)}
          />
          <DemoAction onClick={() => setStatus('idle')} disabled={status === 'idle'}>
            Lock again
          </DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/unlock-face-id/'], usage, props: PROPS }}
    >
      <UnlockFaceId
        status={status}
        onStatusChange={setStatus}
        scanDuration={scanDuration}
        size={size}
        label="Scan to reveal production secrets"
      >
        {gated ? <SecretsCard /> : null}
      </UnlockFaceId>
    </DemoPage>
  )
}
