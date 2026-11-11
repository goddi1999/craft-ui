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
  ToolApprovalQueue,
  type GrantScope,
  type ToolApprovalRequest,
  type ToolDecision,
} from '@/components/ui/tool-approval-queue'

import { REQUESTS } from './tool-approval-queue.data'

const LAYOUTS = ['grouped', 'flat'] as const
const IDLE = 'Open a request, or select several for bulk actions'

const DEFAULTS = {
  layout: 'grouped' as (typeof LAYOUTS)[number],
  undoMs: 5,
  expanded: true,
}

const COMPONENT_DEFAULTS = { layout: 'grouped', undoMs: 5000 }

const PROPS: DemoPropDoc[] = [
  { name: 'data', type: 'ToolApprovalRequest[]', description: 'Tool calls waiting on the user: id, tool, title, risk, payload (shell, diff, email or json) and an optional status and scope. Set status to approved or denied to move a request into the resolved log yourself.' },
  { name: 'layout', type: "'grouped' | 'flat'", default: "'grouped'", description: 'Grouped sections requests by risk, high first; flat keeps arrival order and shows the risk on each row.' },
  { name: 'onDecide', type: '(requests, decision, scope) => void', description: 'Called from a row (with the scope picked there) or from the bulk bar for every selected request (scope once).' },
  { name: 'onUndo', type: '(request) => void', description: 'Called when the user undoes a decision from the resolved log.' },
  { name: 'undoMs', type: 'number', default: '5000', description: 'How long Undo stays available after a decision.' },
  { name: 'selected', type: 'string[]', description: 'Controlled selection of request ids. Leave unset to let the queue own it.' },
  { name: 'onSelectedChange', type: '(ids: string[]) => void', description: 'Called when rows are selected or cleared.' },
  { name: 'defaultExpanded', type: 'string', description: 'Id of a request to open on mount.' },
  { name: 'className', type: 'string', description: 'Extra classes for the root.' },
]

export function ToolApprovalQueuePage() {
  const settings = useDemoSettings(DEFAULTS)
  const { layout, undoMs, expanded } = settings.values
  // Bumping the key remounts the queue, which clears its resolved log and refills it.
  const [round, setRound] = useState(0)
  const [log, setLog] = useState(IDLE)

  const refill = () => {
    setRound((n) => n + 1)
    setLog(IDLE)
  }

  const handleDecide = (
    requests: ToolApprovalRequest[],
    decision: ToolDecision,
    scope: GrantScope,
  ) =>
    setLog(
      `${decision} ${requests.map((r) => r.id).join(', ')}${decision === 'approved' ? ` (${scope})` : ''}`,
    )

  const usage = toUsageSnippet({
    component: 'ToolApprovalQueue',
    from: '@/components/ui/tool-approval-queue',
    props: {
      data: { expression: 'requests' },
      layout,
      undoMs: undoMs * 1000,
      onDecide: { expression: '(picked, decision, scope) => agent.resolve(picked, decision, scope)' },
      onUndo: { expression: '(request) => agent.reopen(request.id)' },
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / tool-approval-queue"
      title="Tool Approval Queue"
      description={
        <>
          Permission requests from an agent, ready to resolve one by one or in
          bulk. Rows expand to show the exact payload and a grant scope;
          decisions land in a resolved log with a short Undo window. Arrow keys
          move between rows, Space selects and Enter opens. Adapted from{' '}
          <a href="https://tuffui.com" target="_blank" rel="noreferrer">
            TuffUI
          </a>{' '}
          (MIT).
        </>
      }
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Layout"
            options={LAYOUTS}
            value={layout}
            onChange={(next) => settings.set('layout', next)}
          />
          <DemoSlider
            label="Undo window"
            value={undoMs}
            onValueChange={(next) => settings.set('undoMs', next)}
            min={2}
            max={15}
            unit="s"
          />
          <DemoSwitch
            label="Open first request"
            checked={expanded}
            onCheckedChange={(next) => {
              settings.set('expanded', next)
              setRound((n) => n + 1)
            }}
          />
          <DemoAction onClick={refill}>Reset queue</DemoAction>
        </DemoSettings>
      }
      docs={{
        paths: [
          'src/components/ui/tool-approval-queue/',
          'src/components/ui/surface/',
          'src/components/ui/segmented-control/',
          'src/components/ui/rolling-number/',
          'src/components/ui/checkbox.tsx',
          'src/components/ui/empty.tsx',
          'src/components/ui/button.tsx',
        ],
        usage,
        props: PROPS,
      }}
    >
      <div className="flex w-full max-w-xl flex-col items-center gap-4">
        <ToolApprovalQueue
          key={round}
          data={REQUESTS}
          layout={layout}
          undoMs={undoMs * 1000}
          defaultExpanded={expanded ? 'publish' : undefined}
          onDecide={handleDecide}
          onUndo={(r) => setLog(`undid ${r.id}`)}
        />
        <p
          role="status"
          aria-live="polite"
          className="min-h-5 text-center font-mono text-xs text-muted-foreground"
        >
          {log}
        </p>
      </div>
    </DemoPage>
  )
}
