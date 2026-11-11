import { Bot, Briefcase } from 'lucide-react'
import { useState } from 'react'

import {
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { MatchField } from '@/components/ui/match-field'

import {
  BOTS,
  BOT_SECTORS,
  CANDIDATES,
  CANDIDATE_SECTORS,
} from './match-field.data'

const DATASETS = ['Candidates', 'Bots'] as const

const DEFAULTS = {
  dataset: 'Candidates' as (typeof DATASETS)[number],
  threshold: 85,
  rings: true,
}

const PROPS: DemoPropDoc[] = [
  { name: 'sectors', type: 'string[]', description: 'Categories around the edge, clockwise from the top.' },
  { name: 'items', type: 'MatchItem[]', description: 'Placed in their sector, closer to the middle the higher they score. Items at or above the threshold get a label.' },
  { name: 'title', type: 'string', description: 'Header title.' },
  { name: 'subtitle', type: 'string', description: 'Secondary line under the title.' },
  { name: 'rings', type: 'number[]', default: '[0.5, 0.7, 0.85]', description: 'Scores drawn as dashed, labeled rings.' },
  { name: 'threshold', type: 'number', default: 'highest ring', description: 'Strong-fit score. Its ring and the dots inside it are tinted.' },
  { name: 'min', type: 'number', default: 'lowest ring − 0.15', description: 'Score on the outer edge. Lower scores are clamped to it.' },
  { name: 'icon', type: 'LucideIcon', default: 'Briefcase', description: 'Lucide icon in the middle: the role or request being matched.' },
  { name: 'onSelect', type: '(item: MatchItem) => void', description: 'Called when an item is hovered, clicked or reached with the arrow keys.' },
  { name: 'className', type: 'string', description: 'Extra classes for the root.' },
]

export function MatchFieldPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { dataset, threshold, rings } = settings.values
  const [picked, setPicked] = useState<string | null>(null)

  const bots = dataset === 'Bots'
  const ringValues = rings ? (bots ? [0.5, 0.7, 0.9] : [0.5, 0.7, 0.85]) : []
  // The threshold slider overrides the highest ring's role as the strong-fit line.
  const strongAt = threshold / 100

  const usage = toUsageSnippet({
    component: 'MatchField',
    from: '@/components/ui/match-field',
    props: {
      title: bots ? 'Best bot for this request' : 'Senior product designer',
      sectors: { expression: bots ? 'BOT_SECTORS' : 'SECTORS' },
      items: { expression: 'items' },
      rings: { expression: JSON.stringify(ringValues) },
      threshold: strongAt,
      min: 0.4,
      icon: bots ? { expression: 'Bot' } : undefined,
      onSelect: { expression: '(item) => openProfile(item.id)' },
    },
    defaults: {},
  })

  return (
    <DemoPage
      eyebrow="ui / match-field"
      title="Match Field"
      description={
        <>
          A polar fit field: sectors are categories and distance from the
          middle is how well something matches. Hover, click or step through
          matches with the arrow keys, Home, End and Escape. Adapted from{' '}
          <a href="https://tuffui.com" target="_blank" rel="noreferrer">
            TuffUI
          </a>{' '}
          (MIT).
        </>
      }
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Data"
            options={DATASETS}
            value={dataset}
            onChange={(next) => settings.set('dataset', next)}
          />
          <DemoSlider
            label="Strong-fit threshold"
            value={threshold}
            onValueChange={(next) => settings.set('threshold', next)}
            min={60}
            max={95}
            unit="%"
          />
          <DemoSwitch
            label="Score rings"
            checked={rings}
            onCheckedChange={(next) => settings.set('rings', next)}
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/ui/match-field/', 'src/components/ui/surface/'],
        usage,
        props: PROPS,
      }}
    >
      <div className="flex w-full flex-col items-center gap-3">
        <MatchField
          key={dataset}
          title={bots ? 'Best bot for this request' : 'Senior product designer'}
          subtitle={
            bots ? '“I was charged twice for March”' : '148 applicants · ranked by fit'
          }
          sectors={bots ? BOT_SECTORS : CANDIDATE_SECTORS}
          items={bots ? BOTS : CANDIDATES}
          rings={ringValues}
          threshold={strongAt}
          min={0.4}
          icon={bots ? Bot : Briefcase}
          onSelect={(item) => setPicked(item.name)}
        />
        <p className="text-xs text-muted-foreground" aria-live="polite">
          {picked ? `Last read: ${picked}` : 'Hover a match or focus the field and use the arrow keys.'}
        </p>
      </div>
    </DemoPage>
  )
}
