import type { Transition } from 'motion/react'
import { BookOpen, Brain, Droplet, Footprints, LifeBuoy } from 'lucide-react'

import type { CardSwipeItem } from './card-swipe.types'

export const CARD_WIDTH = 320
export const CARD_HEIGHT = 420
export const CARD_GAP = 16
export const CARD_STRIDE = CARD_WIDTH + CARD_GAP

/** Past this drag distance (px) or flick speed (px/s) the deck advances. */
export const DRAG_BUFFER = 50
export const VELOCITY_THRESHOLD = 500

export const CARD_SWIPE_SPRING: Transition = {
  type: 'spring',
  stiffness: 330,
  damping: 30,
}

export const DEFAULT_CARD_SWIPE_ITEMS: CardSwipeItem[] = [
  {
    id: 'reading',
    title: 'Reading',
    description: 'Sharpen your mind & escape to new adventures.',
    icon: BookOpen,
  },
  {
    id: 'water',
    title: 'Drink Water',
    description: 'Stay hydrated & energized. Your body will thank you!',
    icon: Droplet,
  },
  {
    id: 'running',
    title: 'Running',
    description: 'Feel the endorphins! Get a quick energy boost.',
    icon: Footprints,
  },
  {
    id: 'swimming',
    title: 'Swimming',
    description: 'Low-impact workout. Refreshing & invigorating.',
    icon: LifeBuoy,
  },
  {
    id: 'meditation',
    title: 'Meditation',
    description: 'Find inner peace. Just 5 minutes can de-stress.',
    icon: Brain,
  },
]
