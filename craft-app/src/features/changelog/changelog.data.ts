import type { ChangelogFile } from './changelog.types'
import { countComponents } from './changelog.utils'
import file from './changelogEntries.json'

/** Regenerate with `npm run changelog`. */
export const CHANGELOG = (file as ChangelogFile).entries
export const CHANGELOG_LATEST = CHANGELOG[0]
export const CHANGELOG_TOTAL = countComponents(CHANGELOG)
