import type { ReactNode } from 'react'

export type DemoPageAlign = 'center' | 'start' | 'stretch'

export type DemoPageProps = {
  /** Breadcrumb line, e.g. `shared / calendar-widget`. */
  eyebrow: string
  title: string
  description: string
  /** How the demo stage lays its child out. */
  align?: DemoPageAlign
  children: ReactNode
  className?: string
}
