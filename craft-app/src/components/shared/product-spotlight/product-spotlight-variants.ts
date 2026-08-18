import { cva } from 'class-variance-authority'

export const productSpotlightCardVariants = cva('product-spotlight-card', {
  variants: {
    variant: {
      default: 'product-spotlight-card--default',
      blueprint: 'product-spotlight-card--blueprint',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export const productSpotlightVariants = cva('product-spotlight', {
  variants: {
    preset: {
      default: 'product-spotlight--default',
      dramatic: 'product-spotlight--dramatic',
      soft: 'product-spotlight--soft',
      cinematic: 'product-spotlight--cinematic',
    },
  },
  defaultVariants: {
    preset: 'default',
  },
})
