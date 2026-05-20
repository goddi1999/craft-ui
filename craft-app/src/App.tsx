import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { DemoLayout } from '@/components/layout'
import {
  FauxPipVideoPage,
  ScrollDrivenIndexPage,
  TheCraftOfUiPlaybookCssScrollAnimationWSubgridPage,
} from '@/components/shared'
import { HomePage } from '@/pages/HomePage'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route element={<DemoLayout />}>
          <Route
            path="/examples/scroll-driven-index"
            element={<ScrollDrivenIndexPage />}
          />
          <Route
            path="/examples/faux-pip-video"
            element={<FauxPipVideoPage />}
          />
          <Route
            path="/examples/the-craft-of-ui-playbook-css-scroll-animation-w-subgrid"
            element={<TheCraftOfUiPlaybookCssScrollAnimationWSubgridPage />}
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
