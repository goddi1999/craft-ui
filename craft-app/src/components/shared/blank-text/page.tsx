import { useRef, useState } from 'react'

import {
  DemoAction,
  DemoControlGroup,
  DemoSettings,
  DemoSwitch,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { Button } from '@/components/ui/button'
import { BlankText, type BlankCheck, type BlankTextHandle } from '@/components/ui/blank-text'

const SIZES = ['md', 'lg', 'xl'] as const
const SIZE_CLASS = {
  md: 'text-2xl',
  lg: 'text-3xl sm:text-4xl',
  xl: 'text-4xl sm:text-5xl',
}

// the default soft pair, pure primaries, or green for right
// classic is the component's own theme-aware default; the others are fixed colours
const PALETTES = {
  classic: { correct: 'var(--blank-correct)', wrong: 'var(--blank-wrong)' },
  soft: { correct: '#4F6BFE', wrong: '#FF6B6B' },
  pure: { correct: '#0000FF', wrong: '#FF0000' },
  green: { correct: '#00BF8F', wrong: '#FF6B6B' },
} as const

// a reason per word of the demo sentence; words without one show none
const REASONS: Record<string, { correct: string; wrong: string }> = {
  yo: {
    correct: '“Yo” is the subject pronoun for I.',
    wrong: 'The subject here is I, which is “yo” in Spanish.',
  },
  soy: {
    correct: '“Soy” is ser in the yo form: ser is for who you are, like being a student.',
    wrong: 'Being a student is who you are, so it takes ser, not estar: yo soy.',
  },
  estudiante: {
    correct: '“Estudiante” ends in -e, so it stays the same for any gender.',
    wrong: 'Student is “estudiante”, the same word for a man or a woman.',
  },
}
type Palette = keyof typeof PALETTES

const DEFAULTS = {
  text: 'Yo soy estudiante.',
  size: 'lg' as (typeof SIZES)[number],
  palette: 'classic' as Palette,
  muted: true,
  matchCase: false,
  reasons: true,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'text',
    type: 'string',
    description: 'The sentence. Punctuation stays outside the blank.',
  },
  {
    name: 'defaultBlank / blank',
    type: 'number | null',
    description: 'Which word is the blank, by index. One at a time.',
  },
  {
    name: 'onBlankChange',
    type: '(blank: number | null) => void',
    description: 'When the blank moves.',
  },
  {
    name: 'onCheck',
    type: '({ index, answer, value, correct }) => void',
    description: 'Called when the blank is checked, by Enter or `ref.check()`.',
  },
  {
    name: 'ref',
    type: '{ check(), show(status), reset() }',
    description: 'Check from your own button, play a result without checking, or clear the blank.',
  },
  {
    name: 'selectable',
    type: 'boolean',
    default: 'true',
    description:
      'Tap a word to blank it, another to move it, the empty blank again to bring it back.',
  },
  {
    name: 'matchCase',
    type: 'boolean',
    default: 'false',
    description: 'Compare case too. Accents always count.',
  },
  {
    name: 'muted',
    type: 'boolean',
    default: 'false',
    description: 'Every word but the blank in the palette’s grey, so the blank stands out.',
  },
  {
    name: 'reason',
    type: 'string | { correct, wrong } | (answer) => …',
    description:
      'Why, typed out in a tooltip once the pointer rests on the blank. Per result, or per word with a function.',
  },
  {
    name: 'reasonDelay',
    type: 'number',
    default: '700',
    description: 'Ms of hover before the reason opens.',
  },
  {
    name: 'correctColor',
    type: 'string',
    default: 'green, #128238 light / #34A85F dark',
    description: 'Box colour when right.',
  },
  {
    name: 'wrongColor',
    type: 'string',
    default: 'deep red, #A50B0B light / #D9473F dark',
    description: 'Box colour when wrong.',
  },
]

export function BlankTextPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { text, size, palette, matchCase, reasons, muted } = settings.values
  const colors = PALETTES[palette]
  const blank = useRef<BlankTextHandle>(null)
  const [round, setRound] = useState(0)
  const [last, setLast] = useState<BlankCheck | null>(null)

  const restart = () => {
    setLast(null)
    setRound((value) => value + 1)
  }

  const usage = toUsageSnippet({
    component: 'BlankText',
    from: '@/components/ui/blank-text',
    props: {
      ref: { expression: 'blank' },
      text,
      defaultBlank: 1,
      matchCase,
      muted,
      correctColor: colors.correct,
      wrongColor: colors.wrong,
    },
    defaults: {
      matchCase: false,
      muted: false,
      correctColor: 'var(--blank-correct)',
      wrongColor: 'var(--blank-wrong)',
    },
  })

  return (
    <DemoPage
      eyebrow="ui / blank-text"
      title="Blank Text"
      description="One word of a sentence as a fill-in-the-blank. Tap a word: a grey box appears, the word dissolves, and the box grows and shrinks as you type. Tap another word to move the blank, or the empty blank again to bring the word back. Check turns it blue with an elastic jump when right, red with a small shake when not."
      previewClassName="min-h-[320px]"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoTextField
            label="Sentence"
            value={text}
            onValueChange={(next) => {
              settings.set('text', next)
              restart()
            }}
          />
          <DemoControlGroup
            title="Size"
            options={SIZES}
            value={size}
            onChange={(next) => settings.set('size', next)}
          />
          <DemoControlGroup
            title="Colours"
            options={Object.keys(PALETTES) as Palette[]}
            value={palette}
            onChange={(next) => settings.set('palette', next)}
          />
          <DemoSwitch
            label="Match case"
            checked={matchCase}
            onCheckedChange={(next) => settings.set('matchCase', next)}
          />
          <DemoSwitch
            label="Gray words"
            checked={muted}
            onCheckedChange={(next) => settings.set('muted', next)}
          />
          <DemoSwitch
            label="Reasons on hover"
            checked={reasons}
            onCheckedChange={(next) => settings.set('reasons', next)}
          />
          <DemoAction onClick={restart}>Start over</DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/blank-text/'], usage, props: PROPS }}
    >
      <div className="flex w-full max-w-2xl flex-col items-center gap-7 py-6 [--blank-correct:#128238] [--blank-wrong:#A50B0B] dark:[--blank-correct:#34A85F] dark:[--blank-wrong:#D9473F]">
        <BlankText
          key={round}
          ref={blank}
          text={text}
          defaultBlank={1}
          matchCase={matchCase}
          muted={muted}
          correctColor={colors.correct}
          wrongColor={colors.wrong}
          onCheck={setLast}
          reason={reasons ? (answer) => REASONS[answer.toLowerCase()] : undefined}
          className={`justify-center text-center font-semibold ${SIZE_CLASS[size]}`}
        />

        <div className="flex flex-wrap justify-center gap-2">
          <Button className="h-11 px-5 sm:h-9" onClick={() => blank.current?.check()}>
            Check
          </Button>
          {/* preview a result straight away, in the colours it will use */}
          <Button
            className="h-11 px-5 text-white hover:opacity-90 sm:h-9"
            style={{ backgroundColor: colors.correct }}
            onClick={() => blank.current?.show('correct')}
          >
            Correct
          </Button>
          <Button
            className="h-11 px-5 text-white hover:opacity-90 sm:h-9"
            style={{ backgroundColor: colors.wrong }}
            onClick={() => blank.current?.show('wrong')}
          >
            Wrong
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          {last
            ? `${last.correct ? 'Correct' : 'Wrong'}: “${last.value}” for “${last.answer}”`
            : 'Type into the box, then Check or press Enter'}
        </p>
      </div>
    </DemoPage>
  )
}
