import type { Chapter } from '@/components/ui/chapter-player'

import {
  Colours,
  Concept,
  Iconography,
  Mockups,
  Outro,
  Reveal,
  Typography,
} from './chapter-player.scenes'

export const DEMO_DURATION = 38

export const DEMO_CHAPTERS: Chapter[] = [
  { label: 'Reveal', start: 0, content: <Reveal /> },
  { label: 'Concept', start: 6, content: <Concept /> },
  { label: 'Mockups', start: 11, content: <Mockups /> },
  { label: 'Typography', start: 17, content: <Typography /> },
  { label: 'Colours', start: 23, content: <Colours /> },
  { label: 'Iconography', start: 28, content: <Iconography /> },
  { label: 'Outro', start: 33, content: <Outro /> },
]
