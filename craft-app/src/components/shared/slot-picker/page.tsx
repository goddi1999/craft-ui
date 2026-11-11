import { useState } from 'react'

import {
  DemoAction,
  DemoControlGroup,
  DemoSettings,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { SlotPicker, type Slot } from '@/components/ui/slot-picker'

import { ATTENDEE_ZONE, SLOTS, TIME_ZONE } from './slot-picker.data'

const VARIANTS = ['week', 'day'] as const

const DEFAULTS = {
  variant: 'week' as (typeof VARIANTS)[number],
  attendeeZone: true,
}

const COMPONENT_DEFAULTS = { variant: 'week' }

const PROPS: DemoPropDoc[] = [
  {
    name: 'data',
    type: '{ title?: string; slots: Slot[]; timeZone: SlotZone; attendeeZone?: SlotZone }',
    description:
      'Candidate slots in timeZone (id, day, start, end, busy, suggested). With attendeeZone a switch shows the times in the other person’s zone.',
  },
  { name: 'variant', type: "'week' | 'day'", default: "'week'", description: 'Day columns for up to five days, or one day at a time with durations.' },
  { name: 'selectedId / onSelect', type: 'string | null', description: 'The picked slot. Picking shows a confirm row under the panel.' },
  { name: 'onConfirm', type: '(slot: Slot) => void', description: 'Called from the confirm row; the card switches to the confirmed summary.' },
  { name: 'confirmedId / onChange', type: 'string | null', description: 'Controls the confirmed state. onChange fires from “Pick another time”.' },
  { name: 'className', type: 'string', description: 'Extra classes for the shell.' },
]

export function SlotPickerPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { variant, attendeeZone } = settings.values
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [confirmedId, setConfirmedId] = useState<string | null>(null)
  const [log, setLog] = useState('Pick a slot, then confirm')

  const reset = () => {
    setSelectedId(null)
    setConfirmedId(null)
    setLog('Pick a slot, then confirm')
  }

  const usage = toUsageSnippet({
    component: 'SlotPicker',
    from: '@/components/ui/slot-picker',
    props: {
      data: {
        expression:
          "{ title: 'Design review with Ana', slots, timeZone: { label: 'Lisbon (UTC+0)', offset: 0 } }",
      },
      variant,
      onConfirm: { expression: '(slot) => agent.sendToolResult(callId, { slotId: slot.id })' },
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / slot-picker"
      title="Slot Picker"
      description={
        <>
          An agent proposes free meeting times and the viewer picks one. Week
          shows up to five days of slots, day shows one at a time with
          durations; a switch flips the times into the attendee&apos;s time zone.
          Arrow keys move between slots like a grid. Adapted from{' '}
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
            onChange={(next) => settings.set('variant', next)}
          />
          <DemoSwitch
            label="Time-zone toggle"
            checked={attendeeZone}
            onCheckedChange={(next) => settings.set('attendeeZone', next)}
          />
          <DemoAction onClick={reset}>Start over</DemoAction>
        </DemoSettings>
      }
      docs={{
        paths: [
          'src/components/ui/slot-picker/',
          'src/components/ui/surface/',
          'src/components/ui/status-pill/',
          'src/components/ui/segmented-control/',
          'src/components/ui/switch.tsx',
          'src/components/ui/button.tsx',
        ],
        usage,
        props: PROPS,
      }}
    >
      <div className="flex w-full max-w-xl flex-col items-center gap-4">
        <SlotPicker
          variant={variant}
          data={{
            title: 'Design review with Ana',
            slots: SLOTS,
            timeZone: TIME_ZONE,
            attendeeZone: attendeeZone ? ATTENDEE_ZONE : undefined,
          }}
          selectedId={selectedId}
          onSelect={(slot: Slot | null) => {
            setSelectedId(slot?.id ?? null)
            setLog(slot ? `Selected ${slot.day} ${slot.start}` : 'Selection cleared')
          }}
          confirmedId={confirmedId}
          onConfirm={(slot) => {
            setConfirmedId(slot.id)
            setLog(`Confirmed ${slot.day} ${slot.start}`)
          }}
          onChange={() => {
            setConfirmedId(null)
            setSelectedId(null)
            setLog('Pick a slot, then confirm')
          }}
        />
        <p role="status" aria-live="polite" className="min-h-5 font-mono text-xs text-muted-foreground">
          {log}
        </p>
      </div>
    </DemoPage>
  )
}
