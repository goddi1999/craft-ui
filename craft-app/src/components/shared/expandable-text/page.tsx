import { DemoPage } from '../demo-page'

import { ExpandableText } from './ExpandableText'

const REVIEW_PARAGRAPHS = [
  'I bought this for a weekend trip and ended up using it every day since. The fabric holds up in the rain, the zippers glide, and the shoulder straps stay comfortable even when it is fully packed.',
  'My only wish is a dedicated bottle pocket on the outside. The inner sleeve works, but reaching for water on the go means stopping to open the main compartment.',
  'Overall it is the best bag I have owned in years, and the lifetime repair policy made the price easy to justify.',
]

export function ExpandableTextPage() {
  return (
    <DemoPage
      eyebrow="shared / expandable-text"
      title="Expandable text"
      description="Clamps long copy to a few lines with a fade, then reveals the rest in place with a Read more toggle."
    >
      <div className="w-full max-w-md px-4">
        <ExpandableText lines={2}>
          {REVIEW_PARAGRAPHS.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </ExpandableText>
      </div>
    </DemoPage>
  )
}
