import { ThemeProvider } from 'next-themes'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { DemoLayout } from '@/components/layout'
import {
  AccordionPageTransitionPage,
  CurtainPageTransitionPage,
} from '@/components/shared'
import { AccordionPageTransition } from '@/components/ui/accordion-page-transition'
import { CurtainPageTransition } from '@/components/ui/curtain-page-transition'
import { GALLERY_EXAMPLES, examplePath } from '@/features/gallery'
import { ChangelogPage } from '@/pages/ChangelogPage'
import { HomePage } from '@/pages/HomePage'

/**
 * Two separate page transitions rebuilt from the live sites:
 * - accordion → Accordion / HOLOGRAPHIK clip-path + slat + curve mask
 * - curtain → Art of Documentary / DashDigital scale .8166 + vertical slide
 *
 * Demoed on their own routes only (occasional / explanatory). Not on every gallery hop.
 */
export const PAGE_TRANSITIONS = {
  accordion: {
    slug: 'accordion-page-transition',
    Page: AccordionPageTransitionPage,
    Transition: AccordionPageTransition,
  },
  curtain: {
    slug: 'curtain-page-transition',
    Page: CurtainPageTransitionPage,
    Transition: CurtainPageTransition,
  },
} as const

export function App() {
  const transitionSlugs = new Set<string>(
    Object.values(PAGE_TRANSITIONS).map((entry) => entry.slug),
  )

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/changelog" element={<ChangelogPage />} />
          <Route element={<DemoLayout />}>
            {Object.values(PAGE_TRANSITIONS).map(({ slug, Page }) => (
              <Route key={slug} path={examplePath(slug)} element={<Page />} />
            ))}
            {GALLERY_EXAMPLES.filter((example) => !transitionSlugs.has(example.slug)).map(
              ({ slug, page: Page }) => (
                <Route key={slug} path={examplePath(slug)} element={<Page />} />
              ),
            )}
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
