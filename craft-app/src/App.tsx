import { ThemeProvider } from 'next-themes'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { DemoLayout } from '@/components/layout'
import { GALLERY_EXAMPLES, examplePath } from '@/features/gallery'
import { HomePage } from '@/pages/HomePage'

export function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route element={<DemoLayout />}>
            {GALLERY_EXAMPLES.map(({ slug, page: Page }) => (
              <Route key={slug} path={examplePath(slug)} element={<Page />} />
            ))}
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
