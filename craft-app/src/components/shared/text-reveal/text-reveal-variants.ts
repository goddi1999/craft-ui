import { cva } from 'class-variance-authority'

export const textRevealVariants = cva('text-reveal', {
  variants: {
    size: {
      sm: 'text-reveal--sm',
      default: 'text-reveal--size-default',
      lg: 'text-reveal--lg',
    },
    length: {
      compact: 'text-reveal--compact',
      default: 'text-reveal--length-default',
      long: 'text-reveal--long',
    },
    accent: {
      cyan: 'text-reveal--cyan',
      amber: 'text-reveal--amber',
      magenta: 'text-reveal--magenta',
      plain: 'text-reveal--plain',
    },
  },
  defaultVariants: {
    size: 'default',
    length: 'default',
    accent: 'cyan',
  },
})
