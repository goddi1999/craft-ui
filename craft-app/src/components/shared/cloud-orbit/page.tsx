import { useMemo, useState } from 'react'
import { getAvatarUrls } from '@wq-org/avatars'
import {
  ChartNoAxesColumn,
  Cloud,
  Flower2,
  ListChecks,
  LocateFixed,
  Mail,
  PenLine,
  StickyNote,
} from 'lucide-react'

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
  CloudOrbit,
  type CloudOrbitItem,
  type CloudOrbitPerson,
} from '@/components/ui/cloud-orbit'
import { InputDissolution } from '@/components/ui/input-dissolution'

const TINTS = ['#e0dcff', '#d9f4e1', '#ffdde6', '#fff1c9']
const PEOPLE_COUNT = 4

const icon = 'size-[46%]'
const ITEMS: CloudOrbitItem[] = [
  { id: 'photos', label: 'Photos', node: <Flower2 className={`${icon} text-orange-400`} /> },
  { id: 'mail', label: 'Mail', node: <Mail className={`${icon} text-sky-400`} /> },
  {
    id: 'calendar',
    label: 'Calendar',
    node: (
      <span className="flex flex-col items-center leading-none text-white">
        <span className="text-[1.7cqw] font-semibold text-red-500">MON</span>
        <span className="text-[6.5cqw] font-light">10</span>
      </span>
    ),
  },
  { id: 'notes', label: 'Notes', node: <StickyNote className={`${icon} text-yellow-300`} /> },
  { id: 'icloud', label: 'iCloud', node: <Cloud className={`${icon} text-sky-400`} /> },
  { id: 'find', label: 'Find My', node: <LocateFixed className={`${icon} text-green-400`} /> },
  { id: 'reminders', label: 'Reminders', node: <ListChecks className={`${icon} text-white/80`} /> },
  { id: 'numbers', label: 'Numbers', node: <ChartNoAxesColumn className={`${icon} text-green-400`} /> },
  { id: 'pages', label: 'Pages', node: <PenLine className={`${icon} text-orange-400`} /> },
]

type Mark = 'cloud' | 'tree'
const MARKS: Mark[] = ['cloud', 'tree']
const MARK_LABELS: Record<Mark, string> = { cloud: 'Cloud', tree: 'WQ tree' }

// the wq-app favicon, served from public/ so the component itself stays asset-free
const TREE = (
  <img src="/cloud-orbit/wq-tree.svg" alt="" draggable={false} className="size-full p-[6%]" />
)

const DEFAULTS = { mark: 'cloud' as Mark, hold: 2600, itemCount: 8, paused: false, field: true }

const PROPS: DemoPropDoc[] = [
  { name: 'people', type: 'CloudOrbitPerson[]', description: '{ id, src, name, tint } — one is in the middle at a time. Required.' },
  { name: 'items', type: 'CloudOrbitItem[]', description: '{ id, label, node } chips that circle the avatar. Required.' },
  { name: 'cloud', type: 'ReactNode', description: 'Replaces the default lucide cloud the loop opens and closes on.' },
  { name: 'hold', type: 'number', default: '2600', description: 'How long each person stays, in ms.' },
  { name: 'paused', type: 'boolean', default: 'false', description: 'Freezes the loop. It also pauses itself while off screen.' },
]

export function CloudOrbitPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { mark, hold, itemCount, paused, field } = settings.values
  const [run, setRun] = useState(0)

  const people = useMemo<CloudOrbitPerson[]>(
    () =>
      getAvatarUrls()
        .slice(0, PEOPLE_COUNT)
        .map((avatar, i) => ({
          id: avatar.id,
          src: avatar.imageUrl,
          name: avatar.name,
          tint: TINTS[i % TINTS.length],
        })),
    [],
  )

  const usage = toUsageSnippet({
    component: 'CloudOrbit',
    from: '@/components/ui/cloud-orbit',
    props: {
      people: { expression: 'people' },
      items: { expression: 'items' },
      cloud: mark === 'tree' ? { expression: '<img src="/wq-tree.svg" alt="" />' } : undefined,
      hold,
    },
    defaults: { hold: 2600 },
  })

  return (
    <DemoPage
      eyebrow="ui / cloud-orbit"
      title="Cloud Orbit"
      description="One account, every app, every person: a cloud turns into an avatar, app chips orbit it in depth, and the whole thing folds back into the cloud."
      previewClassName="bg-[#1a1a1c] text-white"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Mark"
            options={MARKS}
            value={mark}
            onChange={(next) => settings.set('mark', next)}
            format={(option) => MARK_LABELS[option]}
          />
          <DemoSlider
            label="Time per person"
            value={hold}
            onValueChange={(next) => settings.set('hold', next)}
            min={1200}
            max={5000}
            step={100}
            unit="ms"
          />
          <DemoSlider
            label="App chips"
            value={itemCount}
            onValueChange={(next) => settings.set('itemCount', next)}
            min={4}
            max={ITEMS.length}
          />
          <DemoSwitch
            label="Paused"
            checked={paused}
            onCheckedChange={(next) => settings.set('paused', next)}
          />
          <DemoSwitch
            label="Sign-up field"
            checked={field}
            onCheckedChange={(next) => settings.set('field', next)}
          />
          <DemoAction onClick={() => setRun((n) => n + 1)}>Restart</DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/cloud-orbit/'], usage, props: PROPS }}
    >
      <div className="flex w-full max-w-sm flex-col items-center gap-6 py-6">
        <CloudOrbit
          key={run}
          people={people}
          items={ITEMS.slice(0, itemCount)}
          cloud={mark === 'tree' ? TREE : undefined}
          hold={hold}
          paused={paused}
        />
        {field && (
          <div className="dark">
            <InputDissolution />
          </div>
        )}
      </div>
    </DemoPage>
  )
}
