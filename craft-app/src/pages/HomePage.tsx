import {
  GALLERY_EXAMPLES,
  GalleryCard,
  GalleryCategoryFilter,
  GallerySearch,
  useGalleryFilter,
} from '@/features/gallery'

export function HomePage() {
  const filter = useGalleryFilter(GALLERY_EXAMPLES)
  const total = GALLERY_EXAMPLES.length

  return (
    <div className="min-h-svh bg-background px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-medium tracking-tight text-foreground">
            Craft UI
          </h1>
          <p className="mt-4 text-muted-foreground">
            Browse live examples. Search, filter by category, and open any card
            for its demo.
          </p>
        </header>

        <div className="mx-auto mb-8 max-w-2xl">
          <GallerySearch
            query={filter.query}
            onQueryChange={filter.setQuery}
            submittedQuery={filter.submittedQuery}
            onSubmittedQueryChange={filter.setSubmittedQuery}
            results={filter.results}
            total={total}
          />
        </div>

        <div className="mb-4">
          <GalleryCategoryFilter
            selected={filter.categories}
            counts={filter.categoryCounts}
            total={total}
            onToggle={filter.toggleCategory}
            onClear={filter.clearCategories}
          />
        </div>

        <p
          className="mb-8 text-center text-xs text-muted-foreground"
          aria-live="polite"
        >
          {filter.results.length} of {total} examples
        </p>

        {filter.results.length > 0 ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filter.results.map((example) => (
              <li key={example.slug}>
                <GalleryCard
                  example={example}
                  selectedCategories={filter.categories}
                  onToggleCategory={filter.toggleCategory}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-16 text-center text-muted-foreground">
            No examples match. Clear a filter or try another word.
          </p>
        )}
      </div>
    </div>
  )
}
