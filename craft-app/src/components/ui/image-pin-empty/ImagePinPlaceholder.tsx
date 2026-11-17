import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

import { ImagePinEmptyArt } from './image-pin-empty-art'
import {
  imagePinPlaceholderVariants,
  type ImagePinPlaceholderBorder,
} from './image-pin-empty.variants'

export type ImagePinPlaceholderProps = Omit<
  ComponentProps<'div'>,
  'children'
> & {
  /** @default 'Nothing here yet' */
  label?: string
  hint?: string
  /** Show the filled block inside the picture icon. @default true */
  showInnerRect?: boolean
  /**
   * Box outline: a full 1px border, or none.
   * Outer L-brackets live in `@/components/ui/corner-frame` — not here.
   * @default 'none'
   */
  border?: ImagePinPlaceholderBorder
  /**
   * Centre empty-picture SVG: open L-brackets or a closed rounded rect.
   * @default 'corners'
   */
  iconFrame?: 'corners' | 'full'
  /** Draw the centre guides + picture mark + label. @default true */
  showArt?: boolean
}

/**
 * Empty state for the image-pin frame: centre SVG art (guides, picture mark,
 * label). Outer corner brackets are a separate `CornerFrame` component.
 */
export function ImagePinPlaceholder({
  label = 'Nothing here yet',
  hint,
  showInnerRect = true,
  border = 'none',
  iconFrame = 'corners',
  showArt = true,
  className,
  ...props
}: ImagePinPlaceholderProps) {
  return (
    <div
      data-slot="image-pin-placeholder"
      data-border={border}
      className={cn(imagePinPlaceholderVariants({ border }), className)}
      {...props}
    >
      {showArt ? (
        <ImagePinEmptyArt
          label={label}
          hint={hint}
          showInnerRect={showInnerRect}
          iconFrame={iconFrame}
        />
      ) : null}
    </div>
  )
}
