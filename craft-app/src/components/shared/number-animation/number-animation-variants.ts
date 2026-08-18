import { cva } from 'class-variance-authority'

export const numberAnimationVariants = cva('number-animation', {
  variants: {
    size: {
      sm: 'number-animation--sm',
      default: 'number-animation--size-default',
      lg: 'number-animation--lg',
      xl: 'number-animation--xl',
    },
    mode: {
      transition: 'number-animation--transition',
      animation: 'number-animation--animation',
    },
  },
  defaultVariants: {
    size: 'default',
    mode: 'transition',
  },
})
