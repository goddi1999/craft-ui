import { cva } from 'class-variance-authority'

export const avatarRingsVariants = cva('flex flex-wrap items-center', {
  variants: {
    size: {
      sm: '[--avatar-size:2.5rem] text-xs',
      md: '[--avatar-size:3.5rem] text-sm',
      lg: '[--avatar-size:4.5rem] text-base',
    },
  },
  defaultVariants: { size: 'md' },
})
