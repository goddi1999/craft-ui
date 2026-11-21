import type { Variants } from 'motion/react'

import type { LoadingTip } from './loading-carousel.types'

export const DEFAULT_AUTOPLAY_INTERVAL = 4500

export const DEFAULT_TIPS: LoadingTip[] = [
  {
    text: 'Backend snippets. Shadcn style headless components.. but for your backend.',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #38bdf8 100%)',
  },
  {
    text: 'Create your first directory app today. AI batch scripts to process 100s of urls in seconds.',
    background: 'radial-gradient(circle at 30% 30%, #f472b6 0%, #7c3aed 45%, #1e1b4b 100%)',
  },
  {
    text: 'Cult landing page template. Framer motion, shadcn, and tailwind.',
    background: 'linear-gradient(160deg, #052e16 0%, #15803d 55%, #bef264 100%)',
  },
  {
    text: 'Vector embeddings, semantic search, and chat based vector retrieval on easy mode.',
    background: 'conic-gradient(from 200deg at 70% 40%, #f97316, #facc15, #ef4444, #7f1d1d, #f97316)',
  },
  {
    text: 'SEO analysis app. Scraping, analysis, insights, and AI recommendations.',
    background: 'linear-gradient(120deg, #18181b 0%, #3f3f46 40%, #a1a1aa 100%)',
  },
]

export const SLIDE_VARIANTS: Variants = {
  enter: (direction: number) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? '-100%' : '100%', opacity: 0 }),
}

export const FADE_VARIANTS: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
}

export const TEXT_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.5 } },
}
