import { useState } from 'react'

import {
  DemoAction,
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import {
  Mark,
  MarkerText,
  type MarkerResult,
  type MarkerSpec,
  type MarkType,
} from '@/components/ui/marker-text'

const MARK_TYPES: readonly MarkType[] = ['highlight', 'underline', 'circle', 'box', 'strike']

/** `default` keeps each type's own ink. */
const COLORS = {
  default: undefined,
  red: 'var(--color-red-400)',
  blue: 'var(--color-blue-400)',
  green: 'var(--color-green-400)',
  pink: 'var(--color-pink-400)',
} as const

type ColorName = keyof typeof COLORS
const COLOR_NAMES = Object.keys(COLORS) as ColorName[]

const DEFAULTS = {
  headline: 'highlight' as MarkType,
  headlineColor: 'default' as ColorName,
  gap: 140,
  sentence: 'The quick brown fox jumps over the lazy dog.',
  words: 'quick brown, lazy dog',
  wordType: 'circle' as MarkType,
  wordColor: 'default' as ColorName,
}

const COMPONENT_DEFAULTS = { gap: 140 }

const PROPS: DemoPropDoc[] = [
  {
    name: 'children',
    type: 'ReactNode',
    description: 'Text with `Mark` phrases anywhere inside it, at any depth.',
  },
  {
    name: 'sentences',
    type: '(string | { text, marks?, className? })[]',
    description:
      'Sentences to render when the text comes from data. A string is plain text; an object adds `marks` that apply to that sentence only.',
  },
  {
    name: 'marks',
    type: 'MarkerSpec[]',
    description:
      'Marks applied to every sentence after its own. A spec is `{ words, type?, color?, strokeWidth?, occurrence?, caseSensitive?, wholeWord?, className? }`; `words` is a string or an array, `occurrence` is `\'all\'` or a 0-based index (-1 = last).',
  },
  {
    name: 'colors',
    type: 'Partial<Record<MarkType, string>>',
    description:
      'Ink per type from outside, any CSS colour. A mark\'s own `color` wins; types left out keep their default.',
  },
  {
    name: 'onMarks',
    type: '({ matched, missed }) => void',
    description:
      'Reports the words that were found (text, type, sentence, range) and the ones asked for that are not in the text.',
  },
  { name: 'sentenceAs', type: 'ElementType', default: "'span'", description: 'Element each sentence renders as.' },
  {
    name: 'show',
    type: 'boolean',
    description:
      'Controlled. `true` draws the marks, `false` hides them at once. Omit it to draw once, when the text is 60% on screen.',
  },
  {
    name: 'gap',
    type: 'number',
    default: '140',
    description: 'Milliseconds between one mark finishing and the next one starting.',
  },
  { name: 'onDrawn', type: '() => void', description: 'Called after the last mark lands.' },
  { name: 'as', type: 'ElementType', default: "'div'", description: 'Element to render as.' },
  { name: 'className', type: 'string', description: 'Merged onto the root element.' },
  {
    name: 'Mark type',
    type: "'highlight' | 'underline' | 'circle' | 'box' | 'strike'",
    default: "'highlight'",
    description:
      'How the phrase is marked. Highlights render as `<mark>`, strikes as `<s>`; circles and boxes never wrap.',
  },
  {
    name: 'Mark color',
    type: 'string',
    description:
      'Any CSS colour. Defaults: yellow highlight, orange underline, accent circle, green box, destructive strike.',
  },
  {
    name: 'Mark strokeWidth',
    type: 'number',
    description: 'Pen width in px. Defaults to a width that suits the font size.',
  },
]

const typeAttribute = (type: MarkType) => (type === 'highlight' ? '' : ` type="${type}"`)

const toWords = (text: string) =>
  text
    .split(',')
    .map((word) => word.trim())
    .filter((word) => word !== '')

export function MarkerTextPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { headline, headlineColor, gap, sentence, words, wordType, wordColor } = settings.values
  const [round, setRound] = useState(0)
  const [result, setResult] = useState<MarkerResult>({ matched: [], missed: [] })

  const spec: MarkerSpec = {
    words: toWords(words),
    type: wordType,
    color: COLORS[wordColor],
  }

  const usage = toUsageSnippet({
    component: 'MarkerText',
    from: '@/components/ui/marker-text',
    imports: ['Mark'],
    props: {
      gap,
      colors:
        headlineColor === 'default'
          ? undefined
          : { expression: `{ ${headline}: '${COLORS[headlineColor]}' }` },
    },
    defaults: COMPONENT_DEFAULTS,
    children: `<h2>
  Ship release notes <Mark${typeAttribute(headline)}>before standup</Mark>.
</h2>`,
  })
  const sentencesUsage = `<MarkerText
  sentences={[${JSON.stringify(sentence)}]}
  marks={[{ words: ${JSON.stringify(toWords(words))}, type: '${wordType}'${
    COLORS[wordColor] === undefined ? '' : `, color: '${COLORS[wordColor]}'`
  } }]}
  colors={{ underline: 'tomato' }}
  onMarks={({ matched, missed }) => {}}
/>`

  return (
    <DemoPage
      eyebrow="ui / marker-text"
      title="Marker Text"
      description="Phrases get marked up by hand: a chisel highlighter behind the text, then pen underlines, circles, boxes and strikes over it, one stroke after another with the pen pressing in and lifting off. Adapted from Kokonut UI (MIT)."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Headline mark"
            options={MARK_TYPES}
            value={headline}
            onChange={(next) => settings.set('headline', next)}
          />
          <DemoControlGroup
            title="Headline colour"
            options={COLOR_NAMES}
            value={headlineColor}
            onChange={(next) => settings.set('headlineColor', next)}
          />
          <DemoTextField
            label="Your sentence"
            value={sentence}
            onValueChange={(next) => settings.set('sentence', next)}
          />
          <DemoTextField
            label="Words to mark (comma separated)"
            value={words}
            onValueChange={(next) => settings.set('words', next)}
          />
          <DemoControlGroup
            title="Word mark"
            options={MARK_TYPES}
            value={wordType}
            onChange={(next) => settings.set('wordType', next)}
          />
          <DemoControlGroup
            title="Word colour"
            options={COLOR_NAMES}
            value={wordColor}
            onChange={(next) => settings.set('wordColor', next)}
          />
          <DemoSlider
            label="Gap"
            value={gap}
            onValueChange={(next) => settings.set('gap', next)}
            min={0}
            max={600}
            step={20}
            unit="ms"
          />
          <DemoAction onClick={() => setRound((value) => value + 1)}>Replay</DemoAction>
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/ui/marker-text/'],
        usage: `${usage}\n\n${sentencesUsage}`,
        props: PROPS,
      }}
    >
      <div className="w-full max-w-xl px-2 py-6">
        <MarkerText
          // any change replays the whole drawing from blank
          key={`${round}-${headline}-${headlineColor}-${gap}`}
          show={round === 0 ? undefined : true}
          gap={gap}
          colors={headlineColor === 'default' ? undefined : { [headline]: COLORS[headlineColor] }}
          className="text-foreground"
        >
          <h2 className="text-3xl leading-[1.15] font-semibold tracking-tight text-balance sm:text-[2.6rem]">
            Ship release notes <Mark type={headline}>before standup</Mark>.
          </h2>
          <p className="mt-6 text-[17px] leading-8 text-muted-foreground">
            Every merged PR lands in the draft{' '}
            <Mark type="underline">the moment CI goes green</Mark>, the changelog builds in{' '}
            <Mark type="circle">under a second</Mark>, and it all lives in a{' '}
            <Mark type="box">plain Markdown file</Mark> in your repo. No more digging through{' '}
            <Mark type="strike">twelve Slack threads</Mark> on release day.
          </p>
        </MarkerText>

        <MarkerText
          // typing replays the drawing for the new words
          key={`${sentence}|${words}|${wordType}|${wordColor}`}
          sentences={[sentence]}
          marks={[spec]}
          onMarks={setResult}
          className="mt-10 text-xl leading-9 text-foreground"
        />
        <p className="mt-3 text-sm text-muted-foreground" aria-live="polite">
          Marked: {result.matched.map((word) => word.text).join(', ') || 'nothing'}
          {result.missed.length > 0 ? ` · not in the sentence: ${result.missed.join(', ')}` : ''}
        </p>
      </div>
    </DemoPage>
  )
}
