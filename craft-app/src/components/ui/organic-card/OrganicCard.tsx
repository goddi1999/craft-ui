import { createContext, useContext } from 'react'
import { ArrowRight } from 'lucide-react'

import { cn } from '@/lib/utils'

import { BAND_HOVER_CLASS, BAND_PATH, DEFAULT_BACKGROUND, FADE_IN_UP } from './organic-card.constants'
import './organic-card.module.css'
import type {
  OrganicCardBandProps,
  OrganicCardBodyProps,
  OrganicCardDescriptionProps,
  OrganicCardEyebrowProps,
  OrganicCardFooterIconProps,
  OrganicCardFooterLabelProps,
  OrganicCardFooterProps,
  OrganicCardImageProps,
  OrganicCardProps,
  OrganicCardTitleProps,
  OrganicCardWithHrefProps,
  OrganicCardWithoutHrefProps,
} from './organic-card.types'

const OrganicCardContext = createContext<{ backgroundColor: string } | null>(null)

function useOrganicCardContext() {
  const context = useContext(OrganicCardContext)
  if (!context) throw new Error('OrganicCard components must be used inside OrganicCard.')
  return context
}

const CARD_CLASS =
  'group/organic-card relative flex h-full w-full max-w-[617px] flex-col overflow-hidden rounded-lg lg:rounded-xl'

export function OrganicCard({ children, backgroundColor = DEFAULT_BACKGROUND, className, ...props }: OrganicCardProps) {
  const content =
    'href' in props && props.href !== undefined ? (
      <a
        {...(props as Omit<OrganicCardWithHrefProps, 'children' | 'backgroundColor' | 'className'>)}
        className={cn(CARD_CLASS, className)}
        data-slot="organic-card"
      >
        {children}
      </a>
    ) : (
      <div
        {...(props as Omit<OrganicCardWithoutHrefProps, 'children' | 'backgroundColor' | 'className'>)}
        className={cn(CARD_CLASS, className)}
        data-slot="organic-card"
      >
        {children}
      </div>
    )

  return <OrganicCardContext.Provider value={{ backgroundColor }}>{content}</OrganicCardContext.Provider>
}

export function OrganicCardBody({ className, style, ...props }: OrganicCardBodyProps) {
  const { backgroundColor } = useOrganicCardContext()
  return (
    <div
      {...props}
      className={cn(
        'flex w-full flex-1 flex-col justify-between rounded-t-lg p-4 text-foreground lg:rounded-t-xl',
        className,
      )}
      data-slot="organic-card-body"
      style={{ backgroundColor, ...style }}
    />
  )
}

export function OrganicCardImage({
  alt = 'Card image',
  className,
  style,
  height = 208,
  width = 670,
  ...props
}: OrganicCardImageProps) {
  return (
    <img
      {...props}
      alt={alt}
      className={cn('mb-5 h-[138px] w-full rounded object-cover sm:h-[168px]', FADE_IN_UP, className)}
      data-slot="organic-card-image"
      height={height}
      style={{ animationDelay: '150ms', ...style }}
      width={width}
    />
  )
}

export function OrganicCardEyebrow({ className, style, ...props }: OrganicCardEyebrowProps) {
  return (
    <p
      {...props}
      className={cn(
        'mb-5 text-xs font-medium tracking-wider text-muted-foreground uppercase',
        FADE_IN_UP,
        className,
      )}
      data-slot="organic-card-eyebrow"
      style={{ animationDelay: '200ms', ...style }}
    />
  )
}

export function OrganicCardTitle({ className, style, ...props }: OrganicCardTitleProps) {
  return (
    <h3
      {...props}
      className={cn('mb-2 text-xl font-medium text-foreground lg:text-2xl', FADE_IN_UP, className)}
      data-slot="organic-card-title"
      style={{ animationDelay: '250ms', ...style }}
    />
  )
}

export function OrganicCardDescription({ className, style, ...props }: OrganicCardDescriptionProps) {
  return (
    <p
      {...props}
      className={cn(
        'text-base leading-relaxed text-pretty text-muted-foreground lg:text-lg',
        FADE_IN_UP,
        className,
      )}
      data-slot="organic-card-description"
      style={{ animationDelay: '300ms', ...style }}
    />
  )
}

export function OrganicCardBand({ className, ...props }: OrganicCardBandProps) {
  const { backgroundColor } = useOrganicCardContext()
  return (
    <svg
      {...props}
      className={cn('-mt-px -mr-px', className)}
      data-slot="organic-card-band"
      preserveAspectRatio="none"
      viewBox="0 0 670 111"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path className={cn('w-full', BAND_HOVER_CLASS)} d={BAND_PATH} fill={backgroundColor} />
    </svg>
  )
}

export function OrganicCardFooter({ className, ...props }: OrganicCardFooterProps) {
  return (
    <div
      {...props}
      className={cn('absolute bottom-3 flex w-full items-center justify-between px-4 md:bottom-4', className)}
      data-slot="organic-card-footer"
    />
  )
}

export function OrganicCardFooterLabel({
  className,
  style,
  children = 'Read more',
  ...props
}: OrganicCardFooterLabelProps) {
  return (
    <p
      {...props}
      className={cn('text-base font-medium text-foreground lg:text-lg', FADE_IN_UP, className)}
      data-slot="organic-card-footer-label"
      style={{ animationDelay: '350ms', ...style }}
    >
      {children}
    </p>
  )
}

export function OrganicCardFooterIcon({ className, style, children, ...props }: OrganicCardFooterIconProps) {
  return (
    <div
      {...props}
      className={cn(
        'flex size-8 items-center justify-center rounded-full bg-foreground text-background transition-transform duration-300 group-hover/organic-card:scale-110 motion-reduce:transition-none',
        FADE_IN_UP,
        className,
      )}
      data-slot="organic-card-footer-icon"
      style={{ animationDelay: '400ms', ...style }}
    >
      {children ?? <ArrowRight className="size-4" aria-hidden />}
    </div>
  )
}
