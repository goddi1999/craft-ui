import { useLayoutEffect } from 'react'

import { AppTopBar, SiteFooter } from '@/components/layout'
import { CHANGELOG, CHANGELOG_TOTAL, ChangelogFeed } from '@/features/changelog'

export function ChangelogPage() {
  // the router keeps the gallery's scroll position; release notes start at the top
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-svh bg-background px-4 pb-16">
      <AppTopBar backTo="/" backLabel="Gallery" />
      <main className="mx-auto max-w-3xl">
        <header className="mb-2 pt-16 text-center">
          <h1 className="text-4xl font-medium tracking-tight text-foreground">Changelog</h1>
          <p className="mt-4 text-muted-foreground">
            Every component added to Craft UI this year, newest first. {CHANGELOG_TOTAL} components
            across {CHANGELOG.length} releases.
          </p>
        </header>
        <ChangelogFeed entries={CHANGELOG} />
      </main>
      <SiteFooter className="max-w-3xl" />
    </div>
  )
}
