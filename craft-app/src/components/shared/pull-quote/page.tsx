import {
  DemoSettings,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { PullQuote } from '@/components/ui/pull-quote'

const DEFAULTS = {
  quote: 'awesome. Love the components, especially slide-to-unlock. Great job',
  authorName: 'Guillermo Rauch',
  authorTagline: 'CEO at Vercel',
  url: 'https://x.com/rauchg/status/1978913158514237669',
}

const PROPS: DemoPropDoc[] = [
  { name: 'quote', type: 'string', description: 'The testimonial text. Required.' },
  { name: 'authorName', type: 'string', description: 'Full display name of the person. Required.' },
  { name: 'authorTagline', type: 'string', description: 'Short title or description of the person. Required.' },
  {
    name: 'url',
    type: 'string',
    description: "Link to the person's profile or the post. Covers the whole quote. Required.",
  },
  { name: 'className', type: 'string', description: 'Merged onto the <figure>.' },
]

export function PullQuotePage() {
  const settings = useDemoSettings(DEFAULTS)
  const { quote, authorName, authorTagline, url } = settings.values

  const usage = toUsageSnippet({
    component: 'PullQuote',
    from: '@/components/ui/pull-quote',
    props: { quote, authorName, authorTagline, url },
  })

  return (
    <DemoPage
      eyebrow="ui / pull-quote"
      title="Pull Quote"
      description="A testimonial with hanging quote marks and a hairline leading to the author. The whole quote links to its source."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoTextField label="Quote" value={quote} onValueChange={(next) => settings.set('quote', next)} />
          <DemoTextField label="Author" value={authorName} onValueChange={(next) => settings.set('authorName', next)} />
          <DemoTextField label="Tagline" value={authorTagline} onValueChange={(next) => settings.set('authorTagline', next)} />
          <DemoTextField label="Link" value={url} onValueChange={(next) => settings.set('url', next)} />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/pull-quote/'], usage, props: PROPS }}
    >
      <PullQuote quote={quote} authorName={authorName} authorTagline={authorTagline} url={url} />
    </DemoPage>
  )
}
