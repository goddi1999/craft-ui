import { useNavigate } from 'react-router-dom'

import {
  TreeSearch,
  TreeSearchInput,
  TreeSearchItem,
  TreeSearchResults,
} from '@/components/ui/tree-search'
import type { TreeSearchNode } from '@/components/ui/tree-search'

import { GALLERY_CATEGORIES, examplePath } from '../gallery.constants'
import type { GalleryExample } from '../gallery.types'
import { groupByCategory } from '../gallery.utils'

const CATEGORY_ID_PREFIX = 'category:'

type GallerySearchProps = {
  query: string
  onQueryChange: (query: string) => void
  /** The submitted search the drill-down results are built from. */
  submittedQuery: string
  onSubmittedQueryChange: (query: string) => void
  results: GalleryExample[]
  total: number
}

/**
 * Typing filters the grid live. Pressing Enter opens a drill-down of the
 * matches grouped by category; picking one opens its demo.
 */
export function GallerySearch({
  query,
  onQueryChange,
  submittedQuery,
  onSubmittedQueryChange,
  results,
  total,
}: GallerySearchProps) {
  const navigate = useNavigate()

  const handleSelect = (item: TreeSearchNode) => {
    if (item.id.startsWith(CATEGORY_ID_PREFIX)) return
    navigate(examplePath(item.id))
  }

  const handleSubmittedChange = (submitted: boolean) => {
    if (!submitted) onSubmittedQueryChange('')
  }

  return (
    <TreeSearch
      query={query}
      onQueryChange={onQueryChange}
      submitted={submittedQuery !== ''}
      onSubmittedChange={handleSubmittedChange}
      onSubmit={onSubmittedQueryChange}
      onSelect={handleSelect}
      loadingDuration={350}
      height="22rem"
      className="gap-6"
    >
      <TreeSearchInput
        label="Search examples"
        placeholder={`Search ${total} components`}
      />
      <TreeSearchResults
        searchLabel="Your search"
        summaryLabel={`${results.length} matches`}
        empty={
          <p className="text-sm text-muted-foreground">
            Nothing matches “{submittedQuery}”. Try another word or category.
          </p>
        }
      >
        {groupByCategory(results).map(({ category, examples }) => (
          <TreeSearchItem
            key={category}
            id={`${CATEGORY_ID_PREFIX}${category}`}
            label={GALLERY_CATEGORIES[category].label}
            description={`${examples.length} ${examples.length === 1 ? 'example' : 'examples'}`}
          >
            {examples.map((example) => (
              <TreeSearchItem
                key={example.slug}
                id={example.slug}
                label={example.title}
                description={example.description}
              />
            ))}
          </TreeSearchItem>
        ))}
      </TreeSearchResults>
    </TreeSearch>
  )
}
