import type { ReactNode } from 'react'

import type { DemoDocsProps } from '../demo-docs/demo-docs.types'

export type DemoPageAlign = 'center' | 'start' | 'stretch'

/**
 * - `card`: the demo sits in a bordered preview card, settings as its footer.
 * - `fullscreen`: the demo spans the page (full-page scroll effects); the
 *   settings card and docs follow it.
 */
export type DemoPageLayout = 'card' | 'fullscreen'

export type DemoPageProps = {
  /** Breadcrumb line, e.g. `ui / sparkle-button`. */
  eyebrow: string
  title: string
  description: ReactNode
  /** How the preview lays its child out. */
  align?: DemoPageAlign
  layout?: DemoPageLayout
  /** Drop the preview padding so a custom stage fills the card edge to edge. */
  bleed?: boolean
  /** Classes for the preview surface — a custom stage background, a height. */
  previewClassName?: string
  /** A `<DemoSettings>`; always rendered at the bottom of the preview. */
  settings?: ReactNode
  /** Installation path, usage snippet and API table under the demo. */
  docs?: DemoDocsProps
  /** The live demo. */
  children: ReactNode
  className?: string
}
