import { cva } from 'class-variance-authority'

export const carousel3dVariants = cva('carousel-3d', {
  variants: {
    size: {
      sm: 'carousel-3d--sm',
      default: 'carousel-3d--size-default',
      lg: 'carousel-3d--lg',
    },
    speed: {
      slow: 'carousel-3d--slow',
      default: 'carousel-3d--speed-default',
      fast: 'carousel-3d--fast',
    },
    depth: {
      subtle: 'carousel-3d--subtle',
      default: 'carousel-3d--depth-default',
      extreme: 'carousel-3d--extreme',
    },
  },
  defaultVariants: {
    size: 'default',
    speed: 'default',
    depth: 'default',
  },
})
