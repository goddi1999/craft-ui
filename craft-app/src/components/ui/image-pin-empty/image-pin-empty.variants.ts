import { cva, type VariantProps } from 'class-variance-authority'

/** The placeholder box: frame-height and rounded-4xl, outlined per `border`. */
export const imagePinPlaceholderVariants = cva(
  'relative h-[min(70dvh,52rem)] min-h-72 w-full overflow-hidden rounded-4xl text-foreground',
  {
    variants: {
      border: {
        /** A plain 1px border all the way round. */
        full: 'border border-border',
        /** No outline (use `CornerFrame` separately if you want L-brackets). */
        none: '',
      },
    },
    defaultVariants: { border: 'none' },
  },
)

export type ImagePinPlaceholderBorder = NonNullable<
  VariantProps<typeof imagePinPlaceholderVariants>['border']
>
