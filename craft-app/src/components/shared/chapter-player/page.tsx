import { MotionConfig } from 'motion/react'
import { useState } from 'react'

import {
  DemoControlGroup,
  DemoSettings,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import {
  ChapterPlayer,
  type ChapterPlayerColor,
  type ChapterPlayerNavigation,
} from '@/components/ui/chapter-player'

import { DEMO_CHAPTERS, DEMO_DURATION } from './chapter-player.data'

const COLORS: readonly ChapterPlayerColor[] = ['blue', 'violet', 'green', 'orange', 'neutral']

const NAVIGATIONS: readonly ChapterPlayerNavigation[] = ['buttons', 'stepper']

const STAGES = ['scenes', 'html'] as const

const DEFAULTS = {
  stage: 'scenes' as (typeof STAGES)[number],
  navigation: 'buttons' as ChapterPlayerNavigation,
  color: 'neutral' as ChapterPlayerColor,
  loop: true,
}
const COMPONENT_DEFAULTS = { navigation: 'buttons', color: 'neutral', loop: true }

// any markup can be the stage; this one is a plain text slide per chapter
function TextSlide({ index, label }: { index: number; label: string }) {
  return (
    <div className="flex size-full flex-col justify-end gap-2 bg-zinc-950 p-6 text-white sm:p-10">
      <p className="font-mono text-xs text-white/50 tabular-nums">
        {String(index + 1).padStart(2, '0')} / {String(DEMO_CHAPTERS.length).padStart(2, '0')}
      </p>
      <h3 className="text-3xl font-semibold tracking-tight sm:text-5xl">{label}</h3>
    </div>
  )
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'chapters',
    type: '{ label: string; start: number; content?: ReactNode }[]',
    description: 'Named chapters by start second. Without `src`, each one’s `content` fills the stage.',
  },
  {
    name: 'duration',
    type: 'number',
    description: 'Total length in seconds. With `src` the video’s own length wins once it loads.',
  },
  {
    name: 'children',
    type: 'ReactNode | ({ index, chapter, playing, seek }) => ReactNode',
    description:
      'Your own stage: slides, HTML, a canvas, any video player. A function gets the current chapter. Wins over `src` and `content`.',
  },
  {
    name: 'src',
    type: 'string',
    description: 'A video to play on the stage when there are no `children`; the chapters then mark timestamps in it.',
  },
  {
    name: 'tapToPause',
    type: 'boolean',
    default: 'true',
    description: 'Tapping the stage pauses and resumes. Turn off when the stage holds links or controls.',
  },
  { name: 'poster', type: 'string', description: 'Poster image for the video.' },
  {
    name: 'autoPlay',
    type: 'boolean',
    default: 'true',
    description: 'Starts playing on mount, unless the viewer prefers reduced motion.',
  },
  { name: 'loop', type: 'boolean', default: 'true', description: 'Starts over at the end.' },
  {
    name: 'navigation',
    type: "'buttons' | 'stepper'",
    default: "'buttons'",
    description:
      'A row of buttons, or the `StepperProgressBarTitles` progress stepper with each chapter as a step.',
  },
  {
    name: 'color',
    type: "'blue' | 'violet' | 'green' | 'orange' | 'neutral'",
    default: "'neutral'",
    description:
      'Theme accent (`data-accent`) for the current chapter and the progress bars. Time labels always stay neutral.',
  },
  {
    name: 'onChapterChange',
    type: '(index: number) => void',
    description: 'Called when playback, a chapter pick or the scrubber moves into another chapter.',
  },
  { name: 'className', type: 'string', description: 'Merged onto the root.' },
]

export function ChapterPlayerPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { stage, navigation, color, loop } = settings.values
  const [chapter, setChapter] = useState(0)

  const usage = toUsageSnippet({
    component: 'ChapterPlayer',
    from: '@/components/ui/chapter-player',
    props: {
      chapters: { expression: 'chapters' },
      duration: DEMO_DURATION,
      navigation,
      color,
      loop,
    },
    defaults: COMPONENT_DEFAULTS,
    children: stage === 'html' ? '{({ chapter }) => <Slide title={chapter.label} />}' : undefined,
  })

  return (
    <DemoPage
      eyebrow="ui / chapter-player"
      title="Chapter Player"
      description="A player for anything split into chapters, listed as plain buttons or as a progress stepper that follow playback. The stage is yours: render slides, HTML or your own video as children, pass a video with `src`, or let it cross-fade each chapter's content. Pick a chapter to jump, drag the tick ruler to scrub, tap the stage to pause."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Stage"
            options={STAGES}
            value={stage}
            onChange={(next) => settings.set('stage', next)}
          />
          <DemoControlGroup
            title="Navigation"
            options={NAVIGATIONS}
            value={navigation}
            onChange={(next) => settings.set('navigation', next)}
          />
          <DemoControlGroup
            title="Colour"
            options={COLORS}
            value={color}
            onChange={(next) => settings.set('color', next)}
          />
          <DemoSwitch
            label="Loop"
            checked={loop}
            onCheckedChange={(next) => settings.set('loop', next)}
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/chapter-player/'], usage, props: PROPS }}
    >
      <MotionConfig reducedMotion="user">
        <div className="flex w-full flex-col items-center gap-2 py-4">
          <ChapterPlayer
            chapters={DEMO_CHAPTERS}
            duration={DEMO_DURATION}
            navigation={navigation}
            color={color}
            loop={loop}
            onChapterChange={setChapter}
          >
            {stage === 'html'
              ? ({ index, chapter }) => <TextSlide index={index} label={chapter.label} />
              : undefined}
          </ChapterPlayer>
          <p className="text-xs text-muted-foreground">
            Chapter {chapter + 1} of {DEMO_CHAPTERS.length}
          </p>
        </div>
      </MotionConfig>
    </DemoPage>
  )
}
