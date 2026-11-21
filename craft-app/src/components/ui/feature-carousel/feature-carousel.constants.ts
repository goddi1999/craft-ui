import type { FeatureCarouselStep, StepImagePreset } from './feature-carousel.types'

export const DEFAULT_INTERVAL = 3000

export const STEPS: readonly FeatureCarouselStep[] = [
  { id: '1', name: 'Step 1', title: 'Feature 1', description: 'Feature 1 description' },
  { id: '2', name: 'Step 2', title: 'Feature 2', description: 'Feature 2 description' },
  { id: '3', name: 'Step 3', title: 'Feature 3', description: 'Feature 3 description' },
  { id: '4', name: 'Step 4', title: 'Feature 4', description: 'Feature 4 description' },
]

export const SPRING = { type: 'spring', stiffness: 300, damping: 25, mass: 0.5 } as const

export const EASE_OUT = [0.23, 1, 0.32, 1] as const

export const IMAGE_PRESETS: Record<
  StepImagePreset,
  { initial: Record<string, number>; animate: Record<string, number>; exit: Record<string, number> }
> = {
  fadeInScale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  slideInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  slideInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
}

export const FADE_ONLY = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

const IMAGE_BASE = 'pointer-events-none border border-border/50 transition-all duration-500 rounded-2xl'

export const DEFAULT_IMAGE_CLASSES = {
  step1img1: `${IMAGE_BASE} w-[50%]`,
  step1img2: `${IMAGE_BASE} w-[60%] overflow-hidden`,
  step2img1: `${IMAGE_BASE} w-[50%] overflow-hidden`,
  step2img2: `${IMAGE_BASE} w-[40%] overflow-hidden`,
  step3img: `${IMAGE_BASE} w-[90%] overflow-hidden`,
  step4img: `${IMAGE_BASE} w-[90%] overflow-hidden`,
} as const
