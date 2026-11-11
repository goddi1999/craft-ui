import { useEffect, useState } from 'react'

import {
  DemoAction,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import {
  WebSearch,
  WebSearchAnswer,
  WebSearchCitation,
  type WebSearchStatus,
  type WebSource,
} from '@/components/ui/web-search'

const favicon = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=64`

const SOURCES: WebSource[] = [
  {
    id: 'motion',
    title: 'Spring animations: physics based motion for React',
    url: 'https://motion.dev/docs/react-transitions',
    snippet:
      'Springs simulate real physics, so motion keeps its velocity when it is interrupted and settles naturally.',
    favicon: favicon('motion.dev'),
  },
  {
    id: 'mdn',
    title: 'prefers-reduced-motion - CSS media feature',
    url: 'https://developer.mozilla.org/docs/Web/CSS/@media/prefers-reduced-motion',
    snippet:
      'Detects if a user has enabled a setting on their device to minimize the amount of non-essential motion.',
    favicon: favicon('developer.mozilla.org'),
  },
  {
    id: 'react',
    title: 'useEffect: synchronizing with external systems',
    url: 'https://react.dev/reference/react/useEffect',
    snippet: 'useEffect is a React Hook that lets you synchronize a component with an external system.',
    favicon: favicon('react.dev'),
  },
  {
    id: 'webdev',
    title: 'Animations and performance on the web',
    url: 'https://web.dev/articles/animations-and-performance',
    snippet: 'Animating transform and opacity keeps work on the compositor, so frames stay smooth.',
    favicon: favicon('web.dev'),
  },
  {
    id: 'github',
    title: 'rare-ui: animated React components',
    url: 'https://github.com/swamimalode07/rare-ui',
    favicon: favicon('github.com'),
  },
  {
    id: 'vercel',
    title: 'Building interfaces that feel fast',
    url: 'https://vercel.com/blog',
    favicon: favicon('vercel.com'),
  },
]

const [motionDev, mdn, react, webDev] = SOURCES

// a slow network shouldn't hold the demo back for long
const PRELOAD_TIMEOUT = 3000
// when each result lands, in ms from the start of the run
const ARRIVALS = [600, 1000, 1300, 1800, 2200, 2500]
const FINISH_AFTER_LAST = 400

const preload = (urls: string[]) =>
  Promise.race([
    Promise.all(
      urls.map(
        (src) =>
          new Promise<void>((resolve) => {
            const image = new Image()
            image.onload = image.onerror = () => resolve()
            image.src = src
          }),
      ),
    ),
    new Promise<void>((resolve) => setTimeout(resolve, PRELOAD_TIMEOUT)),
  ])

const DEFAULTS = {
  query: 'spring animations react',
  total: 6,
  speed: 80,
  numbered: false,
  linked: false,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'sources',
    type: 'WebSource[]',
    description:
      'The results: id, title and url, plus an optional snippet and favicon. Without a favicon a coloured letter stands in. Required.',
  },
  {
    name: 'status',
    type: "'searching' | 'done'",
    default: "'done'",
    description: 'Searching shimmers the label and holds empty slots for results still on the way.',
  },
  { name: 'query', type: 'string', description: 'Shown in the label while searching.' },
  {
    name: 'label',
    type: 'string',
    description: 'Replaces the label, which otherwise reads "Searching the web", then "Searched 6 sites".',
  },
  {
    name: 'progress',
    type: 'number',
    description: 'How far the search is, 0 to 1, drawn as the ring round the globe. Omit it and the ring fills a step per source.',
  },
  {
    name: 'linked',
    type: 'boolean',
    default: 'true',
    description: 'Whether cards and citations open their source in a new tab. The previews work either way.',
  },
  { name: 'open / defaultOpen', type: 'boolean', default: 'true', description: 'Controlled / initial visibility of the source cards.' },
  { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called each time the cards show or hide.' },
  {
    name: 'play',
    type: 'boolean',
    default: 'true',
    description: 'WebSearchAnswer: starts typing. Paragraphs, lists and bold text are typed into; citations land whole.',
  },
  {
    name: 'speed',
    type: 'number',
    default: '80',
    description: 'WebSearchAnswer: average characters per second. A long backlog types faster so a live stream never falls behind.',
  },
  { name: 'onComplete', type: '() => void', description: 'WebSearchAnswer: called once the last character is typed.' },
  { name: 'source', type: 'WebSource', description: 'WebSearchCitation: the source the inline chip links to and previews.' },
  { name: 'index', type: 'number', description: 'WebSearchCitation: a number shown after the site name.' },
]

export function WebSearchPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { query, total, speed, numbered, linked } = settings.values

  const [run, setRun] = useState(0)
  const [count, setCount] = useState(0)
  const [status, setStatus] = useState<WebSearchStatus>('searching')
  const [ready, setReady] = useState(false)

  const handleReplay = () => {
    setCount(0)
    setStatus('searching')
    setRun((n) => n + 1)
  }

  // a new result count starts a fresh search, derived during render rather than in an effect
  const [searchedTotal, setSearchedTotal] = useState(total)
  if (searchedTotal !== total) {
    setSearchedTotal(total)
    handleReplay()
  }

  // the favicons load before the search starts, so each one lands with its icon instead of popping in late
  useEffect(() => {
    let active = true
    preload(SOURCES.flatMap((source) => source.favicon ?? [])).then(() => active && setReady(true))
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!ready) return
    const arrivals = ARRIVALS.slice(0, searchedTotal)
    const timers = [
      ...arrivals.map((at, i) => window.setTimeout(() => setCount(i + 1), at)),
      window.setTimeout(() => setStatus('done'), arrivals[arrivals.length - 1] + FINISH_AFTER_LAST),
    ]
    return () => timers.forEach(window.clearTimeout)
  }, [run, ready, searchedTotal])

  const cite = (source: WebSource, index: number) => (
    <WebSearchCitation linked={linked} source={source} index={numbered ? index : undefined} />
  )

  const usage = `${toUsageSnippet({
    component: 'WebSearch',
    from: '@/components/ui/web-search',
    imports: ['WebSearchAnswer', 'WebSearchCitation'],
    props: {
      sources: { expression: 'sources' },
      status: { expression: 'status' },
      query: query || undefined,
      linked,
    },
    defaults: { linked: true },
  })}

<WebSearchAnswer play={status === 'done'}${speed === DEFAULTS.speed ? '' : ` speed={${speed}}`}>
  Use a spring for anything the user can interrupt{' '}
  <WebSearchCitation source={sources[0]}${numbered ? ' index={1}' : ''} />.
</WebSearchAnswer>`

  return (
    <DemoPage
      eyebrow="ui / web-search"
      title="Web Search"
      description={
        <>
          The sources behind an AI answer: a search pill whose ring fills as results stream in, source
          cards, an answer that types itself out, and inline citations that preview their page on hover.
          Ported from{' '}
          <a href="https://github.com/swamimalode07/rare-ui" target="_blank" rel="noreferrer">
            rare-ui
          </a>
          .
        </>
      }
      previewClassName="min-h-[26rem]"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoTextField
            label="Query"
            value={query}
            onValueChange={(next) => settings.set('query', next)}
            maxLength={40}
          />
          <DemoSlider
            label="Results"
            value={total}
            onValueChange={(next) => settings.set('total', next)}
            min={1}
            max={SOURCES.length}
          />
          <DemoSlider
            label="Typing speed"
            value={speed}
            onValueChange={(next) => settings.set('speed', next)}
            min={20}
            max={200}
            step={10}
            unit=" ch/s"
          />
          <DemoSwitch
            label="Numbered citations"
            checked={numbered}
            onCheckedChange={(next) => settings.set('numbered', next)}
          />
          <DemoSwitch
            label="Open links"
            checked={linked}
            onCheckedChange={(next) => settings.set('linked', next)}
          />
          <DemoAction onClick={handleReplay}>Replay</DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/web-search/'], usage, props: PROPS }}
    >
      <div className="flex w-[560px] max-w-full flex-col gap-5">
        <WebSearch
          key={run}
          status={status}
          query={query || undefined}
          sources={SOURCES.slice(0, count)}
          linked={linked}
        />

        <WebSearchAnswer key={`answer-${run}`} play={status === 'done'} speed={speed}>
          Use a spring for anything the user can interrupt, since it keeps its velocity instead of
          restarting {cite(motionDev, 1)}. Stick to transform and opacity so the work stays on the
          compositor {cite(webDev, 4)}, and turn the motion off when the user asks for less{' '}
          {cite(mdn, 2)}. Start the animation from an effect, not during render {cite(react, 3)}.
        </WebSearchAnswer>
      </div>
    </DemoPage>
  )
}
