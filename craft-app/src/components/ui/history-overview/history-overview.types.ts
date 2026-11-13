import type { ComponentProps, ReactNode } from 'react'

export type HistoryPage = {
  id: string
  /** Shown in the strip above the page and used for its accessible name. */
  title: string
  /** A small mark next to the title (favicon). */
  icon?: ReactNode
  content: ReactNode
}

export type HistoryOverviewProps = Omit<ComponentProps<'div'>, 'children'> & {
  pages: HistoryPage[]
  /** Controlled id of the page on screen. */
  current?: string
  /** @default the last page */
  defaultCurrent?: string
  onCurrentChange?: (id: string) => void
  /** How small pages get in the strip. @default 0.42 */
  overviewScale?: number
}
