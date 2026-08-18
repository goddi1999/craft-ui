import { useId } from 'react'

import { cn } from '@/lib/utils'

import type { ProductSpotlightBodyProps } from './product-spotlight.types'

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Title, price, and the buy affordance whose arrows slide on hover. */
export function ProductSpotlightBody({
  brand,
  name,
  price,
  href = '#',
  className,
  ...props
}: ProductSpotlightBodyProps) {
  const titleId = useId()
  const actionId = useId()

  return (
    <div data-slot="product-spotlight-body" className={cn(className)}>
      <div data-slot="product-spotlight-meta">
        <h3 data-slot="product-spotlight-title" id={titleId}>
          <span>{brand}</span>
          <span>{name}</span>
        </h3>
        <p data-slot="product-spotlight-price">{price}</p>
      </div>
      <a href={href} aria-labelledby={`${actionId} ${titleId}`} {...props}>
        <span className="sr-only" id={actionId}>
          Buy
        </span>
        <span data-slot="product-spotlight-icons" aria-hidden="true">
          <ArrowIcon />
          <ArrowIcon />
        </span>
      </a>
    </div>
  )
}
