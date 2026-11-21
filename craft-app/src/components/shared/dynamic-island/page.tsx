import { Loader, Mail, MessageCircle, MousePointerClick, User, Waves } from 'lucide-react'

import { DemoAction, DemoSettings } from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DynamicContainer,
  DynamicDescription,
  DynamicDiv,
  DynamicIsland,
  DynamicIslandProvider,
  DynamicTitle,
  useDynamicIslandSize,
  useScheduledAnimations,
  type SizePresets,
} from '@/components/ui/dynamic-island'

const CYCLE: SizePresets[] = ['compact', 'large', 'tall', 'long', 'medium']

const INTRO = [
  { size: 'compact', delay: 1000 },
  { size: 'large', delay: 1200 },
  { size: 'tall', delay: 1600 },
  { size: 'long', delay: 1800 },
  { size: 'medium', delay: 2200 },
] satisfies { size: SizePresets; delay: number }[]

const PROPS: DemoPropDoc[] = [
  {
    name: 'initialSize',
    type: 'SizePresets',
    default: "'default'",
    description: 'Provider: the size the island starts at.',
  },
  {
    name: 'initialAnimation',
    type: '{ size, delay }[]',
    default: '[]',
    description: 'Provider: sizes to play through on mount, each delay in ms after the previous.',
  },
  { name: 'id', type: 'string', description: 'DynamicIsland: id on the island element.' },
  { name: 'className', type: 'string', description: 'Merged onto the island and every Dynamic* part.' },
]

function CompactState() {
  return (
    <DynamicContainer className="flex h-full w-full items-center justify-between px-4">
      <MessageCircle className="size-5 fill-cyan-400 text-cyan-400" aria-hidden />
      <DynamicDescription className="text-lg font-bold tracking-tighter">newcult.co</DynamicDescription>
    </DynamicContainer>
  )
}

function LargeState() {
  return (
    <DynamicContainer className="flex h-full w-full items-center justify-between gap-6 px-4">
      <Loader className="size-12 animate-spin text-yellow-300 motion-reduce:animate-none" aria-hidden />
      <DynamicTitle className="text-2xl font-black tracking-tighter">loading</DynamicTitle>
    </DynamicContainer>
  )
}

function TallState() {
  return (
    <DynamicContainer className="mt-6 flex w-full flex-col items-start gap-1 px-8 font-semibold">
      <DynamicDescription className="rounded-2xl bg-cyan-300 p-2 leading-5 tracking-tight text-black">
        The Cult of Pythagoras
      </DynamicDescription>
      <DynamicDescription className="rounded-2xl bg-cyan-300 p-2 text-left leading-5 tracking-tight text-black">
        Music of the Spheres, an idea that celestial bodies produce a form of music through their
        movements
      </DynamicDescription>
      <DynamicTitle className="text-4xl font-black tracking-tighter text-cyan-100">any cool cults?</DynamicTitle>
    </DynamicContainer>
  )
}

function LongState() {
  return (
    <DynamicContainer className="flex h-full w-full items-center">
      <DynamicDiv className="flex w-full items-center justify-between gap-6 px-4">
        <Waves className="size-8 shrink-0 text-cyan-400" aria-hidden />
        <DynamicTitle className="truncate text-xl font-black tracking-tighter">
          Supercalifragilisticexpialidocious
        </DynamicTitle>
      </DynamicDiv>
    </DynamicContainer>
  )
}

function MediumState() {
  return (
    <DynamicContainer className="flex h-full flex-col px-2 pt-4 text-left">
      <DynamicTitle className="pl-3 text-2xl font-black tracking-tighter">Reincarnation, welcome back</DynamicTitle>
      <DynamicDescription className="pl-3 leading-5 text-neutral-500">
        Good for small tasks or call outs
      </DynamicDescription>
      <DynamicDiv className="mt-auto mb-2 flex flex-col gap-1 rounded-b-2xl bg-neutral-800 p-2">
        <Button variant="secondary">
          <Mail className="size-4" aria-hidden /> Login with email
        </Button>
        <Button variant="secondary">
          <User className="size-4" aria-hidden /> Join the cult now
        </Button>
      </DynamicDiv>
    </DynamicContainer>
  )
}

const STATES: Partial<Record<SizePresets, () => React.JSX.Element>> = {
  compact: CompactState,
  large: LargeState,
  tall: TallState,
  long: LongState,
  medium: MediumState,
}

function IslandStage() {
  const { state } = useDynamicIslandSize()
  useScheduledAnimations(INTRO)
  const State = STATES[state.size]

  return (
    <div className="flex h-[260px] w-full flex-col items-center gap-6">
      <div className="flex gap-2">
        <Badge variant="outline">prev · {state.previousSize ?? '—'}</Badge>
        <Badge variant="outline">current · {state.size}</Badge>
      </div>
      <DynamicIsland id="dynamic-island-demo">{State ? <State /> : null}</DynamicIsland>
    </div>
  )
}

function CycleAction() {
  const { state, setSize } = useDynamicIslandSize()
  const next = CYCLE[(CYCLE.indexOf(state.size) + 1) % CYCLE.length]
  return (
    <DemoAction onClick={() => setSize(next)} disabled={state.isAnimating}>
      <MousePointerClick className="size-4" aria-hidden /> Cycle states
    </DemoAction>
  )
}

export function DynamicIslandPage() {
  const usage = toUsageSnippet({
    component: 'DynamicIslandProvider',
    from: '@/components/ui/dynamic-island',
    props: { initialSize: 'default' },
    defaults: {},
  })

  return (
    <DynamicIslandProvider initialSize="default">
      <DemoPage
        eyebrow="ui / dynamic-island"
        title="Dynamic Island"
        description="An iPhone-style island that springs between size presets while its content blurs and fades in. Plays an intro sequence, then click to cycle compact, large, tall, long and medium. Adapted from cult-ui."
        settings={
          <DemoSettings>
            <CycleAction />
          </DemoSettings>
        }
        docs={{ paths: ['src/components/ui/dynamic-island/'], usage, props: PROPS }}
      >
        <IslandStage />
      </DemoPage>
    </DynamicIslandProvider>
  )
}
