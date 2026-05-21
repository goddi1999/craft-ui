import { cva } from 'class-variance-authority'

export const youCanScrollVariants = cva('', {
  variants: {
    tone: {
      default: '',
    },
  },
  defaultVariants: {
    tone: 'default',
  },
})
