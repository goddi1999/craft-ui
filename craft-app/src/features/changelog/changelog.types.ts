import type { GalleryCategory } from '@/features/gallery'

/** One component as it appears in the gallery registry. */
export type ChangelogComponent = {
  /** Route under `/examples/` and the preview image name. */
  slug: string
  title: string
  description: string
  categories: GalleryCategory[]
}

/** One commit that added components. Shape of `changelogEntries.json`. */
export type ChangelogEntry = {
  /** Commit day, `YYYY-MM-DD`. */
  date: string
  /** Short commit hash. */
  commit: string
  /** The commit subject, written as a release note. */
  summary: string
  components: ChangelogComponent[]
}

export type ChangelogFile = {
  generatedAt: string
  entries: ChangelogEntry[]
}

/** Entries of one calendar month, for the month bar and the group headings. */
export type ChangelogMonth = {
  /** `YYYY-MM` */
  key: string
  /** `November 2026` */
  label: string
  /** `Nov` */
  short: string
  entries: ChangelogEntry[]
  count: number
}
