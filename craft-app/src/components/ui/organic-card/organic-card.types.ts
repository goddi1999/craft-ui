import type { AnchorHTMLAttributes, ComponentPropsWithoutRef, HTMLAttributes, ReactNode } from 'react'

type OrganicCardSharedProps = {
  children: ReactNode
  backgroundColor?: string
  className?: string
}

export type OrganicCardWithHrefProps = OrganicCardSharedProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'href' | 'className'> & {
    href: string
  }

export type OrganicCardWithoutHrefProps = OrganicCardSharedProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'className'> & {
    href?: never
  }

export type OrganicCardProps = OrganicCardWithHrefProps | OrganicCardWithoutHrefProps

export type OrganicCardBodyProps = ComponentPropsWithoutRef<'div'>
export type OrganicCardImageProps = Omit<ComponentPropsWithoutRef<'img'>, 'src' | 'alt'> & {
  src: string
  alt?: string
}
export type OrganicCardEyebrowProps = ComponentPropsWithoutRef<'p'>
export type OrganicCardTitleProps = ComponentPropsWithoutRef<'h3'>
export type OrganicCardDescriptionProps = ComponentPropsWithoutRef<'p'>
export type OrganicCardBandProps = ComponentPropsWithoutRef<'svg'>
export type OrganicCardFooterProps = ComponentPropsWithoutRef<'div'>
export type OrganicCardFooterLabelProps = ComponentPropsWithoutRef<'p'>
export type OrganicCardFooterIconProps = ComponentPropsWithoutRef<'div'>
