import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { DemoLayout } from '@/components/layout'
import {
  AgentComputerIconPage,
  AnimatedBeamPage,
  BounceSidebarPage,
  Carousel3DPage,
  CarouselSliderPage,
  CodeBlockPage,
  CurvedScrollbarPage,
  FlickeringGridPage,
  GithubCalendarPage,
  SparkleButtonPage,
  FauxPipVideoPage,
  LinePathAnimationPage,
  MultiplayerMaskPage,
  NumberAnimationPage,
  OptionWheelPage,
  ProductSpotlightPage,
  ProgressiveBlurPage,
  ProximitySidebarPage,
  ScrollDrivenIndexPage,
  ScrollProgressPage,
  ScrollToTypePage,
  StyleableSelectPage,
  TextRevealPage,
  TheCraftOfUiPlaybookCssScrollAnimationWSubgridPage,
  YearInDotsPage,
  YouCanScrollPage,
  YoutubeEmbedPage,
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
          <Route
            path="/examples/multiplayer-masking-with-grid-mask"
            element={<MultiplayerMaskPage />}
          />
          <Route
            path="/examples/product-spotlight-cards"
            element={<ProductSpotlightPage />}
          />
          <Route
            path="/examples/pure-css-3d-animated-carousel"
            element={<Carousel3DPage />}
          />
          <Route
            path="/examples/scroll-driven-progressive-blur-w-contrast"
            element={<ProgressiveBlurPage />}
          />
          <Route
            path="/examples/css-number-animation"
            element={<NumberAnimationPage />}
          />
          <Route
            path="/examples/css-responsive-scroll-driven-text-reveals"
            element={<TextRevealPage />}
          />
          <Route
            path="/examples/css-scroll-to-type"
            element={<ScrollToTypePage />}
          />
          <Route
            path="/examples/carousel-slider"
            element={<CarouselSliderPage />}
          />
          <Route path="/examples/option-wheel" element={<OptionWheelPage />} />
          <Route path="/examples/year-in-dots" element={<YearInDotsPage />} />
          <Route
            path="/examples/youtube-embed"
            element={<YoutubeEmbedPage />}
          />
          <Route
            path="/examples/animated-beam"
            element={<AnimatedBeamPage />}
          />
          <Route
            path="/examples/bounce-sidebar"
            element={<BounceSidebarPage />}
          />
          <Route path="/examples/code-block" element={<CodeBlockPage />} />
          <Route
            path="/examples/flickering-grid"
            element={<FlickeringGridPage />}
          />
          <Route
            path="/examples/github-calendar"
            element={<GithubCalendarPage />}
          />
          <Route
            path="/examples/proximity-sidebar"
            element={<ProximitySidebarPage />}
          />
          <Route
            path="/examples/scroll-progress"
            element={<ScrollProgressPage />}
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
