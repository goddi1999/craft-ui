import { CuisineSelector } from '@/components/ui/cuisine-selector'

import { DemoPage } from '../demo-page'

export function CuisineSelectorPage() {
  return (
    <DemoPage
      eyebrow="ui / cuisine-selector"
      title="Cuisine Selector with :has()"
      description="A multi-select chip list driven by :has(:checked) — selected chips reveal a check, grow a soft orange ring, and a reset clears the set."
    >
      <div className="flex justify-center px-4 pb-24">
        <CuisineSelector />
      </div>
    </DemoPage>
  )
}
