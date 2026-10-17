import { DemoPage } from '@/components/shared/demo-page'
import {
  TreeSearch,
  TreeSearchContent,
  TreeSearchInput,
  TreeSearchItem,
  TreeSearchResults,
} from '@/components/ui/tree-search'

export function TreeSearchPage() {
  return (
    <DemoPage
      eyebrow="ui / tree-search"
      title="Tree search"
      description="A minimal underline prompt with a round submit button. After search, your query appears under “Your search” with a two-paragraph skeleton while results load."
      align="start"
    >
      <div className="w-full max-w-2xl px-6 sm:px-10">
        <TreeSearch height="26rem">
          <TreeSearchInput placeholder="Ask about pricing" />
          <TreeSearchResults>
            <TreeSearchItem
              id="openai"
              label="OpenAI: Research, Products, Business, Developers, Company, Foundation"
            >
              <TreeSearchItem
                id="wikipedia"
                label="OpenAI - Wikipedia"
                description="en.wikipedia.org/wiki/OpenAI"
              />
              <TreeSearchItem
                id="x"
                label="OpenAI (@OpenAI) / X"
                description="x.com/OpenAI"
              />
              <TreeSearchItem
                id="pricing"
                label="Pricing"
                description="openai.com/pricing"
              >
                <TreeSearchContent>
                  <div className="space-y-3 rounded-xl border border-foreground/10 bg-foreground/[0.03] p-4">
                    <p className="text-sm font-medium text-foreground">Pricing overview</p>
                    <p className="text-sm text-muted-foreground">
                      Swap this panel for plans, tables, or any custom React content.
                    </p>
                  </div>
                </TreeSearchContent>
              </TreeSearchItem>
            </TreeSearchItem>

            <TreeSearchItem
              id="design"
              label="Design system documentation"
              description="Components, tokens, and patterns"
            >
              <TreeSearchItem id="colour" label="Colour tokens" />
              <TreeSearchItem id="type" label="Typography" />
              <TreeSearchItem id="spacing" label="Spacing scale" />
            </TreeSearchItem>

            <TreeSearchItem
              id="engineering"
              label="Engineering handbook"
              description="Architecture, testing, and release"
            >
              <TreeSearchItem id="architecture" label="Architecture" />
              <TreeSearchItem id="testing" label="Testing" />
              <TreeSearchItem id="release" label="Release process" />
            </TreeSearchItem>
          </TreeSearchResults>
        </TreeSearch>
      </div>
    </DemoPage>
  )
}
