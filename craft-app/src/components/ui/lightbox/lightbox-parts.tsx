import { Dialog as DialogPrimitive } from 'radix-ui'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from 'lucide-react'
import type { ComponentProps } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { useLightbox } from './lightbox.context'
import type {
  LightboxCounterProps,
  LightboxItemProps,
  LightboxMediaProps,
  LightboxThumbnailProps,
  LightboxTriggerProps,
  LightboxZoomProps,
} from './lightbox.types'
import {
  LightboxPrimitiveBackdrop,
  LightboxPrimitiveCaption,
  LightboxPrimitiveContent,
  LightboxPrimitiveCounter,
  LightboxPrimitiveItem,
  LightboxPrimitiveMedia,
  LightboxPrimitiveSlide,
  LightboxPrimitiveSlides,
  LightboxPrimitiveThumbnail,
  LightboxPrimitiveThumbnailStrip,
  LightboxPrimitiveTrigger,
  LightboxPrimitiveZoom,
} from './lightbox-primitives'

type ButtonStyleProps = Pick<ComponentProps<typeof Button>, 'variant' | 'size'>

/** Hides chrome while a pull-to-dismiss is under the finger. */
const HIDE_WHILE_PULLING =
  'group-data-pulling/lightbox:invisible group-data-pulling/lightbox:opacity-0'

/** Chrome starts hidden and fades in with the backdrop. */
const FADE_WITH_BACKDROP =
  'invisible opacity-0 group-data-open/lightbox:visible group-data-open/lightbox:opacity-100'

export function LightboxTrigger({ className, ...props }: LightboxTriggerProps) {
  return (
    <LightboxPrimitiveTrigger
      data-slot="lightbox-trigger"
      className={cn(
        'cursor-zoom-in outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
        className,
      )}
      {...props}
    />
  )
}

export function LightboxPortal(props: ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="lightbox-portal" {...props} />
}

export function LightboxBackdrop({
  className,
  ...props
}: ComponentProps<typeof LightboxPrimitiveBackdrop>) {
  return (
    <LightboxPrimitiveBackdrop
      className={cn(
        'fixed inset-0 z-50 bg-background opacity-0',
        // Same ease-out as the open/close morph, so the two land together.
        'transition-opacity duration-360 ease-[cubic-bezier(0.16,1,0.3,1)]',
        'data-open:opacity-[calc(1-var(--lightbox-pull-progress,0)*0.6)]',
        'data-pulling:transition-none',
        className,
      )}
      {...props}
    />
  )
}

export function LightboxContent({
  className,
  ...props
}: ComponentProps<typeof LightboxPrimitiveContent>) {
  return (
    <LightboxPortal>
      <LightboxBackdrop />
      <LightboxPrimitiveContent
        className={cn(
          'group/lightbox fixed inset-0 z-50 flex flex-col overscroll-contain outline-none',
          // Shared by the slides, header, and footer so they stay aligned.
          '[--lb-inset-bottom:calc(4rem+env(safe-area-inset-bottom,0px))] [--lb-inset-top:calc(4rem+env(safe-area-inset-top,0px))] [--lb-inset-x:0px]',
          'md:[--lb-inset-bottom:calc(4.5rem+env(safe-area-inset-bottom,0px))] md:[--lb-inset-top:calc(4.5rem+env(safe-area-inset-top,0px))] md:[--lb-inset-x:4.5rem]',
          'has-data-[slot=lightbox-thumbnail-strip]:[--lb-inset-bottom:calc(8rem+env(safe-area-inset-bottom,0px))]',
          className,
        )}
        {...props}
      />
    </LightboxPortal>
  )
}

export function LightboxSlides({
  className,
  ...props
}: ComponentProps<typeof LightboxPrimitiveSlides>) {
  return (
    <LightboxPrimitiveSlides
      className={cn('flex-1 gap-4 md:gap-0', className)}
      {...props}
    />
  )
}

export function LightboxSlide({ className, ...props }: ComponentProps<'div'>) {
  return (
    <LightboxPrimitiveSlide
      data-slot="lightbox-slide"
      className={cn(
        'h-full min-w-full flex-[0_0_100%] px-(--lb-inset-x) pt-(--lb-inset-top) pb-(--lb-inset-bottom)',
        className,
      )}
      {...props}
    />
  )
}

export function LightboxItem({ className, ...props }: LightboxItemProps) {
  return (
    <LightboxPrimitiveItem
      data-slot="lightbox-item"
      className={cn('size-full [container-type:size]', className)}
      {...props}
    />
  )
}

export function LightboxZoom({ className, ...props }: LightboxZoomProps) {
  return <LightboxPrimitiveZoom className={cn('cursor-zoom-in', className)} {...props} />
}

export function LightboxMedia({ className, ...props }: LightboxMediaProps) {
  return (
    <LightboxPrimitiveMedia
      className={cn(
        'overflow-hidden md:rounded-xl [&_img]:size-full [&_img]:object-contain [&_img]:select-none',
        // Keeps image edges from blending into the backdrop.
        'after:pointer-events-none after:absolute after:inset-0 after:z-10 after:rounded-[inherit] md:after:inset-ring md:after:inset-ring-foreground/10',
        className,
      )}
      {...props}
    />
  )
}

export function LightboxHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="lightbox-header"
      className={cn(
        'pointer-events-none absolute inset-x-0 top-0 z-10 flex h-(--lb-inset-top) items-center justify-end gap-2 px-3 pt-[env(safe-area-inset-top,0px)] *:pointer-events-auto',
        'transition-[opacity,visibility] duration-200',
        FADE_WITH_BACKDROP,
        HIDE_WHILE_PULLING,
        // Zoomed media fills small screens.
        'max-md:group-data-zoomed/lightbox:invisible max-md:group-data-zoomed/lightbox:opacity-0',
        className,
      )}
      {...props}
    />
  )
}

export function LightboxFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="lightbox-footer"
      className={cn(
        'pointer-events-none absolute inset-x-0 bottom-0 z-10 flex h-(--lb-inset-bottom) flex-col items-center justify-center gap-3 px-4 pb-[env(safe-area-inset-bottom,0px)] text-center *:pointer-events-auto',
        'transition-[opacity,visibility] duration-200',
        FADE_WITH_BACKDROP,
        HIDE_WHILE_PULLING,
        'group-data-zoomed/lightbox:invisible group-data-zoomed/lightbox:opacity-0',
        className,
      )}
      {...props}
    />
  )
}

export function LightboxClose({
  variant = 'secondary',
  size = 'icon',
  children,
  onClick,
  ...props
}: ComponentProps<'button'> & ButtonStyleProps) {
  const { close } = useLightbox()
  return (
    <Button
      data-slot="lightbox-close"
      variant={variant}
      size={size}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) close()
      }}
      {...props}
    >
      {children ?? (
        <>
          <XIcon />
          <span className="sr-only">Close</span>
        </>
      )}
    </Button>
  )
}

export function LightboxZoomIn({
  variant = 'secondary',
  size = 'icon',
  children,
  onClick,
  ...props
}: ComponentProps<'button'> & ButtonStyleProps) {
  const { zoom } = useLightbox()
  return (
    <Button
      data-slot="lightbox-zoom-in"
      variant={variant}
      size={size}
      disabled={!zoom.canZoomIn}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) zoom.zoomBy(zoom.configRef.current.zoomStep)
      }}
      {...props}
    >
      {children ?? (
        <>
          <ZoomInIcon />
          <span className="sr-only">Zoom in</span>
        </>
      )}
    </Button>
  )
}

export function LightboxZoomOut({
  variant = 'secondary',
  size = 'icon',
  children,
  onClick,
  ...props
}: ComponentProps<'button'> & ButtonStyleProps) {
  const { zoom } = useLightbox()
  return (
    <Button
      data-slot="lightbox-zoom-out"
      variant={variant}
      size={size}
      disabled={!zoom.canZoomOut}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) zoom.zoomBy(1 / zoom.configRef.current.zoomStep)
      }}
      {...props}
    >
      {children ?? (
        <>
          <ZoomOutIcon />
          <span className="sr-only">Zoom out</span>
        </>
      )}
    </Button>
  )
}

export function LightboxPrevious({
  className,
  variant = 'secondary',
  size = 'icon',
  children,
  onClick,
  ...props
}: ComponentProps<'button'> & ButtonStyleProps) {
  const { index, previous } = useLightbox()
  return (
    <Button
      data-slot="lightbox-previous"
      variant={variant}
      size={size}
      disabled={index <= 0}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) previous()
      }}
      className={cn(
        'absolute start-4 top-1/2 z-10 -translate-y-1/2 max-md:hidden rtl:[&_svg]:rotate-180',
        'transition-[opacity,visibility] duration-200',
        FADE_WITH_BACKDROP,
        HIDE_WHILE_PULLING,
        'group-data-zoomed/lightbox:invisible group-data-zoomed/lightbox:opacity-0',
        className,
      )}
      {...props}
    >
      {children ?? (
        <>
          <ChevronLeftIcon />
          <span className="sr-only">Previous</span>
        </>
      )}
    </Button>
  )
}

export function LightboxNext({
  className,
  variant = 'secondary',
  size = 'icon',
  children,
  onClick,
  ...props
}: ComponentProps<'button'> & ButtonStyleProps) {
  const { index, total, next } = useLightbox()
  return (
    <Button
      data-slot="lightbox-next"
      variant={variant}
      size={size}
      disabled={index >= total - 1}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) next()
      }}
      className={cn(
        'absolute end-4 top-1/2 z-10 -translate-y-1/2 max-md:hidden rtl:[&_svg]:rotate-180',
        'transition-[opacity,visibility] duration-200',
        FADE_WITH_BACKDROP,
        HIDE_WHILE_PULLING,
        'group-data-zoomed/lightbox:invisible group-data-zoomed/lightbox:opacity-0',
        className,
      )}
      {...props}
    >
      {children ?? (
        <>
          <ChevronRightIcon />
          <span className="sr-only">Next</span>
        </>
      )}
    </Button>
  )
}

export function LightboxCounter({ className, ...props }: LightboxCounterProps) {
  return (
    <LightboxPrimitiveCounter
      data-slot="lightbox-counter"
      className={cn('text-sm text-muted-foreground tabular-nums', className)}
      {...props}
    />
  )
}

export function LightboxCaption({ className, ...props }: ComponentProps<'p'>) {
  return (
    <LightboxPrimitiveCaption
      data-slot="lightbox-caption"
      className={cn('max-w-full truncate text-sm font-medium text-foreground select-text', className)}
      {...props}
    />
  )
}

export function LightboxThumbnailStrip({
  className,
  ...props
}: ComponentProps<'div'>) {
  return (
    <LightboxPrimitiveThumbnailStrip
      data-slot="lightbox-thumbnail-strip"
      className={cn(
        'w-full overflow-x-auto py-1 scrollbar-none [&::-webkit-scrollbar]:hidden',
        'mask-[linear-gradient(to_right,transparent,black_2.5rem,black_calc(100%-2.5rem),transparent)]',
        className,
      )}
      {...props}
    />
  )
}

export function LightboxThumbnailStripTrack({
  className,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div
      data-slot="lightbox-thumbnail-strip-track"
      role="group"
      className={cn('mx-auto flex w-max items-center gap-2 px-10', className)}
      {...props}
    />
  )
}

export function LightboxThumbnail({ className, ...props }: LightboxThumbnailProps) {
  return (
    <LightboxPrimitiveThumbnail
      data-slot="lightbox-thumbnail"
      className={cn(
        'block size-14 shrink-0 cursor-pointer overflow-hidden rounded-md outline-none',
        'ring-offset-2 ring-offset-background focus-visible:ring-3 focus-visible:ring-ring/50 data-active:ring-2 data-active:ring-foreground',
        '[&_img]:size-full [&_img]:object-cover',
        className,
      )}
      {...props}
    />
  )
}
