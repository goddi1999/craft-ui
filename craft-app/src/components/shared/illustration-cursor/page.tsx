import { useState } from 'react'
import { RotateCcw } from 'lucide-react'

import { DemoAction, DemoSettings, DemoSwitch, DemoTextField } from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { IllustrationCursor, type CursorSide } from '@/components/ui/illustration-cursor'

type DemoCursor = { name: string; color: string; side: CursorSide; x: number; y: number }

/** Fixed layout of the original's seeded scatter, so the demo is stable. */
const CURSORS: DemoCursor[] = [
  { name: 'John', color: '#7c3aed', side: 'left', x: -86, y: 18 },
  { name: 'Jane', color: '#2563eb', side: 'right', x: 52, y: 30 },
  { name: 'Jim', color: '#db2777', side: 'left', x: -30, y: -34 },
  { name: 'Jill', color: '#ea580c', side: 'right', x: 70, y: -22 },
  { name: 'Jack', color: '#059669', side: 'left', x: -120, y: -18 },
  { name: 'Mina', color: '#0f766e', side: 'right', x: 10, y: 4 },
]

const PROPS: DemoPropDoc[] = [
  { name: 'name', type: 'string', description: 'Label shown in the pill.' },
  { name: 'color', type: 'string', description: 'CSS colour for the arrow and the pill.' },
  { name: 'side', type: "'left' | 'right'", description: 'Which way the arrow points.' },
  { name: 'delay', type: 'boolean', default: 'false', description: 'Fade in after 800 ms instead of at mount.' },
  { name: 'float', type: 'boolean', default: 'true', description: 'Drift in place. Off under reduced motion.' },
  { name: 'style', type: 'CSSProperties', description: 'Position it; the cursor is absolutely placed.' },
  { name: 'className', type: 'string', description: 'Merged onto the outer wrapper.' },
]

export function IllustrationCursorPage() {
  const [float, setFloat] = useState(true)
  const [stagger, setStagger] = useState(true)
  const [firstName, setFirstName] = useState('John')
  const [run, setRun] = useState(0)

  const usage = toUsageSnippet({
    component: 'IllustrationCursor',
    from: '@/components/ui/illustration-cursor',
    props: { name: firstName, color: '#7c3aed', side: 'left', float, delay: stagger },
    defaults: { float: true, delay: false },
  })

  return (
    <DemoPage
      eyebrow="ui / illustration-cursor"
      title="Illustration Cursor"
      description="Named collaborator cursors that blur in and drift gently in place, for multiplayer illustrations. Adapted from cult-ui."
      settings={
        <DemoSettings>
          <DemoTextField label="First name" value={firstName} onValueChange={setFirstName} maxLength={16} />
          <DemoSwitch label="Float" checked={float} onCheckedChange={setFloat} />
          <DemoSwitch label="Stagger arrival" checked={stagger} onCheckedChange={setStagger} />
          <DemoAction onClick={() => setRun((n) => n + 1)}>
            <RotateCcw className="size-4" aria-hidden /> Replay
          </DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/illustration-cursor/'], usage, props: PROPS }}
    >
      <div className="flex w-full max-w-md flex-col gap-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-foreground">Live collaborators</h4>
          <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
            {CURSORS.length} online
          </span>
        </div>
        <div
          key={run}
          className="relative h-44 overflow-hidden rounded-[calc(var(--radius)+8px)] bg-card shadow-sm ring-1 ring-border"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[26px_26px] opacity-70"
          />
          {CURSORS.map((cursor, index) => (
            <IllustrationCursor
              key={cursor.color}
              name={index === 0 ? firstName : cursor.name}
              color={cursor.color}
              side={cursor.side}
              float={float}
              delay={stagger && index > 1}
              style={{ left: `calc(50% + ${cursor.x}px)`, bottom: `calc(48% + ${cursor.y}px)` }}
            />
          ))}
        </div>
      </div>
    </DemoPage>
  )
}
