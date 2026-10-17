import { CATEGORY_ORDER, GALLERY_CATEGORIES } from './gallery.constants'
import type { GalleryCategory, GalleryExample } from './gallery.types'

/** Text a query is matched against: title, description, technique, and category names. */
function searchText(example: GalleryExample) {
  const categoryLabels = example.categories.map(
    (category) => GALLERY_CATEGORIES[category].label,
  )
  return [example.title, example.description, example.tech, ...categoryLabels]
    .join(' ')
    .toLowerCase()
}

/**
 * Every query term must appear somewhere, so typing more words narrows the
 * list. Selected categories widen it: an example matches if it is in any.
 */
export function filterExamples(
  examples: GalleryExample[],
  query: string,
  categories: GalleryCategory[],
) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean)

  return examples.filter((example) => {
    const inCategory =
      categories.length === 0 ||
      example.categories.some((category) => categories.includes(category))
    if (!inCategory) return false

    const text = searchText(example)
    return terms.every((term) => text.includes(term))
  })
}

export function countByCategory(examples: GalleryExample[]) {
  const counts = Object.fromEntries(
    CATEGORY_ORDER.map((category) => [category, 0]),
  ) as Record<GalleryCategory, number>

  for (const example of examples) {
    for (const category of example.categories) counts[category] += 1
  }
  return counts
}

/** Examples grouped under each category they belong to, in chip order. */
export function groupByCategory(examples: GalleryExample[]) {
  return CATEGORY_ORDER.map((category) => ({
    category,
    examples: examples.filter((example) =>
      example.categories.includes(category),
    ),
  })).filter((group) => group.examples.length > 0)
}
