export type FeatureCarouselImages = {
  step1light1: string
  step1light2: string
  step2light1: string
  step2light2: string
  step3light: string
  step4light: string
  alt: string
}

export type FeatureCarouselProps = {
  title: string
  description: string
  image: FeatureCarouselImages
  step1img1Class?: string
  step1img2Class?: string
  step2img1Class?: string
  step2img2Class?: string
  step3imgClass?: string
  step4imgClass?: string
  /** Background classes for the card surface. */
  bgClass?: string
  /** Milliseconds between automatic steps. */
  interval?: number
  className?: string
}

export type FeatureCarouselStep = {
  id: string
  name: string
  title: string
  description: string
}

export type StepImagePreset = 'fadeInScale' | 'slideInLeft' | 'slideInRight'
