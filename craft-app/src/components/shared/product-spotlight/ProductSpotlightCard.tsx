import { type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

import { productSpotlightCardVariants } from './product-spotlight-variants'
import type {
  ProductSpotlightCardProps,
  ProductSpotlightStackProps,
} from './product-spotlight.types'

export function ProductSpotlightCard({
  children,
  variant = 'default',
  className,
  ...props
}: ProductSpotlightCardProps &
  VariantProps<typeof productSpotlightCardVariants>) {
  const isBlueprint = variant === 'blueprint'

  return (
    <article
      data-slot="product-spotlight-card"
      data-variant={variant}
      // The blueprint is decoration behind the real card, so keep it out of
      // both the accessibility tree and the tab order.
      aria-hidden={isBlueprint || undefined}
      tabIndex={isBlueprint ? -1 : undefined}
      className={cn(productSpotlightCardVariants({ variant }), className)}
      {...props}
    >
      {children}
    </article>
  )
}

/** Layers a blueprint card behind the real one and fans them apart. */
export function ProductSpotlightStack({
  children,
  reveal = false,
  className,
  ...props
}: ProductSpotlightStackProps) {
  return (
    <div
      data-slot="product-spotlight-stack"
      data-reveal={reveal}
      className={cn(className)}
      {...props}
    >
      {children}
    </div>
  )
}
