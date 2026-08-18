import { cva } from 'class-variance-authority'

export const progressiveBlurVariants = cva('progressive-blur', {
  variants: {
    size: {
      sm: 'progressive-blur--sm',
      default: 'progressive-blur--size-default',
      lg: 'progressive-blur--lg',
    },
    intensity: {
      subtle: 'progressive-blur--subtle',
      default: 'progressive-blur--intensity-default',
      strong: 'progressive-blur--strong',
    },
  },
  defaultVariants: {
    size: 'default',
    intensity: 'default',
  },
})
