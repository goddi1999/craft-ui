import { DemoPage } from '../demo-page'

import { Accordion } from './Accordion'

const FAQ_ITEMS = [
  {
    title: 'Can I cancel anytime?',
    content: 'Yes. Your plan stays active until the period ends.',
  },
  {
    title: 'Do you offer refunds?',
    content: 'Within 14 days of purchase, no questions asked.',
  },
  {
    title: 'Can I switch plans later?',
    content: 'Upgrade or downgrade whenever you like. We prorate the difference.',
  },
]

export function AccordionPage() {
  return (
    <DemoPage
      eyebrow="shared / accordion"
      title="Accordion"
      description="Stacked disclosure rows where one panel opens at a time, with a smooth height spring and a rotating chevron."
    >
      <div className="w-full max-w-lg px-4">
        <Accordion size="lg" items={FAQ_ITEMS} />
      </div>
    </DemoPage>
  )
}
