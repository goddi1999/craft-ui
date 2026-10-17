import { useState } from 'react'

import type { GalleryCategory, GalleryExample } from '../gallery.types'
import { countByCategory, filterExamples } from '../gallery.utils'

/** Search text and category chips for the gallery, with the derived results. */
export function useGalleryFilter(examples: GalleryExample[]) {
  const [query, setQuery] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')
  const [categories, setCategories] = useState<GalleryCategory[]>([])

  // A live query wins; once it is submitted (and cleared) the grid keeps showing its matches.
  const activeQuery = query.trim() ? query : submittedQuery
  const searchResults = filterExamples(examples, activeQuery, [])
  const results = filterExamples(searchResults, '', categories)

  const toggleCategory = (category: GalleryCategory) => {
    setCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category],
    )
  }

  return {
    query,
    setQuery,
    submittedQuery,
    setSubmittedQuery,
    categories,
    toggleCategory,
    clearCategories: () => setCategories([]),
    results,
    /** Chip counts reflect the search, so they say how many each chip would show. */
    categoryCounts: countByCategory(searchResults),
  }
}
