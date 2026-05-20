import type { ReactNode } from 'react'

export type ScrollDrivenIndexItem = {
  id: string
  label: string
  href?: string
}

export type ScrollDrivenIndexAlignment = 'left' | 'center' | 'right'

export type ScrollDrivenIndexTone = 'default' | 'muted'

export type ScrollDrivenIndexProps = {
  items: ScrollDrivenIndexItem[]
  label?: string
  alignment?: ScrollDrivenIndexAlignment
  tone?: ScrollDrivenIndexTone
  popoverId?: string
  className?: string
  children?: ReactNode
}

export type ScrollDrivenIndexTriggerProps = {
  label: string
  popoverId: string
  tone?: ScrollDrivenIndexTone
  className?: string
}

export type ScrollDrivenIndexPanelProps = {
  popoverId: string
  label: string
  items: ScrollDrivenIndexItem[]
  className?: string
}

export type ScrollDrivenIndexListProps = {
  items: ScrollDrivenIndexItem[]
  popoverId: string
  className?: string
}

export type ScrollDrivenIndexLinkProps = {
  item: ScrollDrivenIndexItem
  popoverId: string
  className?: string
}
