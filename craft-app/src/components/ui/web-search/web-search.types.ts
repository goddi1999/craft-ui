import type { ComponentProps } from 'react'

export type WebSearchStatus = 'searching' | 'done'

export type WebSource = {
  id: string
  title: string
  url: string
  snippet?: string
  /** Image URL; without one a coloured letter stands in. */
  favicon?: string
}

export type WebSearchProps = Omit<ComponentProps<'div'>, 'children'> & {
  sources: WebSource[]
  /** Searching shimmers the label and holds empty slots for results on the way. @default 'done' */
  status?: WebSearchStatus
  /** Shown in the label while searching. */
  query?: string
  /** Replaces the default "Searching the web" / "Searched 6 sites" label. */
  label?: string
  /** 0–1, drawn as the ring round the globe. Omit to step it per source. */
  progress?: number
  /** Whether cards open their source in a new tab. @default true */
  linked?: boolean
  open?: boolean
  /** @default true */
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export type WebSearchCitationProps = Omit<ComponentProps<'span'>, 'children'> & {
  source: WebSource
  /** A number shown after the site name, for numbered references. */
  index?: number
  /** @default true */
  linked?: boolean
}

export type WebSearchAnswerProps = ComponentProps<'div'> & {
  /** Starts typing the answer. @default true */
  play?: boolean
  /** Average characters per second. @default 80 */
  speed?: number
  /** Called once the last character is typed. */
  onComplete?: () => void
}
