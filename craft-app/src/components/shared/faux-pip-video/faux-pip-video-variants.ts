import { cva } from 'class-variance-authority'

export const fauxPipVideoVariants = cva('', {
  variants: {
    size: {
      sm: '[--faux-pip-content-width:480px]',
      default: '[--faux-pip-content-width:640px]',
      lg: '[--faux-pip-content-width:720px]',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})
