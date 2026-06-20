import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { DemoLayout } from '@/components/layout'
import {
  AgentComputerIconPage,
  CurvedScrollbarPage,
  SparkleButtonPage,
  FauxPipVideoPage,
  LinePathAnimationPage,
  ScrollDrivenIndexPage,
  StyleableSelectPage,
  TheCraftOfUiPlaybookCssScrollAnimationWSubgridPage,
  YouCanScrollPage,
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
          <Route
            path="/examples/you-can-select-things-styleable-select"
            element={<StyleableSelectPage />}
          />
          <Route
            path="/examples/you-can-scroll"
            element={<YouCanScrollPage />}
          />
          <Route
            path="/examples/line-path-animation"
            element={<LinePathAnimationPage />}
          />
          <Route
            path="/examples/curved-scrollbar"
            element={<CurvedScrollbarPage />}
          />
          <Route
            path="/examples/agent-computer-icon"
            element={<AgentComputerIconPage />}
          />
          <Route
            path="/examples/sparkle-button"
            element={<SparkleButtonPage />}
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
