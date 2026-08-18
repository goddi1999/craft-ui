import { cva } from 'class-variance-authority'

export const multiplayerMaskVariants = cva('multiplayer-mask', {
  variants: {
    size: {
      sm: 'multiplayer-mask--sm',
      default: 'multiplayer-mask--default',
      lg: 'multiplayer-mask--lg',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})
