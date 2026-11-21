import { useState } from 'react'
import { RotateCcw } from 'lucide-react'

import { DemoAction, DemoSettings } from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import {
  OrganicCard,
  OrganicCardBand,
  OrganicCardBody,
  OrganicCardDescription,
  OrganicCardEyebrow,
  OrganicCardFooter,
  OrganicCardFooterIcon,
  OrganicCardFooterLabel,
  OrganicCardImage,
  OrganicCardTitle,
} from '@/components/ui/organic-card'

const PROPS: DemoPropDoc[] = [
  {
    name: 'backgroundColor',
    type: 'string',
    default: "'var(--card)'",
    description: 'Fill for the body and the organic band below it.',
  },
  {
    name: 'href',
    type: 'string',
    description: 'Renders the card as a link (<a>); without it the card is a <div>.',
  },
  { name: 'className', type: 'string', description: 'Merged onto the card and every OrganicCard* part.' },
]

export function OrganicCardPage() {
  const [run, setRun] = useState(0)

  const usage = toUsageSnippet({
    component: 'OrganicCard',
    from: '@/components/ui/organic-card',
    props: { backgroundColor: '#f0eee9', href: '#' },
    defaults: {},
  })

  return (
    <DemoPage
      eyebrow="ui / organic-card"
      title="Organic Card"
      description="A content card whose bottom band curves into a notch for the footer; on hover the notch slides wider and the arrow grows. Adapted from cult-ui."
      settings={
        <DemoSettings>
          <DemoAction onClick={() => setRun((n) => n + 1)}>
            <RotateCcw className="size-4" aria-hidden /> Replay entrance
          </DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/organic-card/'], usage, props: PROPS }}
    >
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-0">
        <OrganicCard key={run} backgroundColor="#f0eee9" className="max-w-[617px] text-neutral-900" href="#">
          <OrganicCardBody>
            <div>
              <OrganicCardImage
                alt="Card image"
                className="mb-5 h-[240px] sm:h-[300px]"
                src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=670&h=208&fit=crop"
              />
              <OrganicCardEyebrow className="text-neutral-500">Product update</OrganicCardEyebrow>
              <OrganicCardTitle className="text-neutral-900">North</OrganicCardTitle>
              <OrganicCardDescription className="w-11/12 text-neutral-600">
                Powered by Command A, Compass, Embed, and Rerank - secure AI agents, search, and generative AI in
                one place.
              </OrganicCardDescription>
            </div>
          </OrganicCardBody>
          <OrganicCardBand />
          <OrganicCardFooter>
            <OrganicCardFooterLabel className="text-neutral-900">Read more</OrganicCardFooterLabel>
            <OrganicCardFooterIcon className="bg-neutral-900 text-white" />
          </OrganicCardFooter>
        </OrganicCard>
      </div>
    </DemoPage>
  )
}
