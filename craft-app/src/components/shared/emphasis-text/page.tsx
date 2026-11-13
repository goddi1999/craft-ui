import { useState } from 'react'

import {
  DemoAction,
  DemoControlGroup,
  DemoSettings,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { EmphasisText } from '@/components/ui/emphasis-text'

const SIZES = ['md', 'lg', 'xl'] as const
const SIZE_CLASS = {
  md: 'text-2xl leading-snug',
  lg: 'text-3xl leading-snug sm:text-4xl',
  xl: 'text-4xl leading-tight sm:text-5xl',
}

const DEFAULTS = {
  text: 'The quick brown fox jumps over the lazy dog.',
  size: 'lg' as (typeof SIZES)[number],
}

const PROPS: DemoPropDoc[] = [
  { name: 'text', type: 'string', description: 'The sentence; words are split on spaces.' },
  { name: 'weights', type: 'number[]', description: 'Controlled weight per word, by index.' },
  {
    name: 'onWeightsChange',
    type: '(weights: number[]) => void',
    description: 'Called with every word’s weight after a change.',
  },
  {
    name: 'steps',
    type: '{ name: string; value: number }[]',
    default: 'Regular 400 → Bold 700 → Light 300',
    description: 'Weights a word cycles through; the first is the resting weight. Needs a variable font to animate.',
  },
  { name: 'label', type: 'string', default: "'Set emphasis'", description: 'Accessible name for the toolbar.' },
  { name: 'className', type: 'string', description: 'Merged onto the root; set the type size here.' },
]

export function EmphasisTextPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { text, size } = settings.values
  const [weights, setWeights] = useState<number[] | null>(null)
  // a new sentence starts from resting weights
  const [round, setRound] = useState(0)

  const names: Record<number, string> = { 700: 'Bold', 300: 'Light' }
  const words = text.split(/\s+/).filter(Boolean)
  const emphasised = (weights ?? [])
    .map((weight, i) => (names[weight] ? `${words[i]} ${names[weight]}` : null))
    .filter((entry): entry is string => entry !== null)

  const usage = toUsageSnippet({
    component: 'EmphasisText',
    from: '@/components/ui/emphasis-text',
    props: { text, onWeightsChange: { expression: 'setWeights' }, className: SIZE_CLASS[size] },
  })

  return (
    <DemoPage
      eyebrow="ui / emphasis-text"
      title="Emphasis Text"
      description="Set emphasis on a sentence word by word. Tap a word and a pill slides over to it while the rest dims; tap it again and it slowly thickens to bold, then thins to light. Arrow keys move, Enter changes the weight, Escape lets go."
      previewClassName="min-h-[300px]"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoTextField
            label="Sentence"
            value={text}
            onValueChange={(next) => {
              settings.set('text', next)
              setWeights(null)
              setRound((value) => value + 1)
            }}
          />
          <DemoControlGroup
            title="Size"
            options={SIZES}
            value={size}
            onChange={(next) => settings.set('size', next)}
          />
          <DemoAction
            onClick={() => {
              setWeights(null)
              setRound((value) => value + 1)
            }}
          >
            Clear emphasis
          </DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/emphasis-text/'], usage, props: PROPS }}
    >
      <div className="flex w-full max-w-2xl flex-col items-center gap-6 py-6">
        <EmphasisText
          key={round}
          text={text}
          onWeightsChange={setWeights}
          className={`justify-center text-center ${SIZE_CLASS[size]}`}
        />
        <p className="text-xs text-muted-foreground tabular-nums">
          {emphasised.length > 0
            ? emphasised.join(' · ')
            : 'Tap a word, then tap it again to change its weight'}
        </p>
      </div>
    </DemoPage>
  )
}
