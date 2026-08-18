import { cva } from 'class-variance-authority'

export const scrollToTypeVariants = cva('scroll-to-type', {
  variants: {
    size: {
      sm: 'scroll-to-type--sm',
      default: 'scroll-to-type--size-default',
      lg: 'scroll-to-type--lg',
    },
    length: {
      compact: 'scroll-to-type--compact',
      default: 'scroll-to-type--length-default',
      long: 'scroll-to-type--long',
    },
  },
  defaultVariants: {
    size: 'default',
    length: 'default',
  },
})
