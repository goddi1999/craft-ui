/**
 * Builds `src/features/changelog/changelogEntries.json` from this year's git history.
 *
 *   npm run changelog
 *
 * Each gallery example is dated by the first commit that added its demo or component
 * folder (`components/shared/<slug>/`, `components/ui/<slug>/`), or, failing that,
 * the commit that first listed its slug in the gallery registry. Examples are then grouped by that commit.
 * Titles and descriptions come from the registry as it is now, so removed demos drop out.
 */
import { execFileSync } from 'node:child_process'
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const root = new URL('..', import.meta.url)
const cwd = fileURLToPath(root)
const YEAR = new Date().getFullYear()
const REGISTRY = 'src/features/gallery/gallery.examples.ts'

// commits whose subject does not read as a release note
const SUMMARY_OVERRIDES = {
  '33d6296': 'Build, wire and route nine components',
}

const git = (...args) => execFileSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 1 << 26 })

/** The current registry, parsed from source so the script needs no TypeScript build. */
async function readRegistry() {
  const source = await readFile(new URL(REGISTRY, root), 'utf8')
  const blocks = source.split(/\n  \{\n/).slice(1)
  return blocks.flatMap((block) => {
    // single- or double-quoted, optionally on the next line
    const field = (name) => {
      const match = block.match(new RegExp(`${name}:\\s*(['"])((?:(?!\\1)[^\\\\]|\\\\.)*)\\1`))
      return match?.[2].replace(/\\(['"])/g, '$1')
    }
    const slug = field('slug')
    if (!slug) return []
    const categories = [...(block.match(/categories: \[([^\]]*)\]/)?.[1] ?? '').matchAll(/'([^']+)'/g)].map((m) => m[1])
    return [{
      slug,
      title: field('title'),
      description: field('description'),
      categories,
    }]
  })
}

/** Every commit of the year, oldest first, with the files it added. */
function readCommits() {
  const log = git('log', `--since=${YEAR}-01-01`, '--reverse', '--diff-filter=A', '--name-only', '--relative', '--format=@@%h|%ad|%s', '--date=short', '--', '.')
  return log.split('@@').filter(Boolean).map((chunk) => {
    const [head, ...files] = chunk.trim().split('\n')
    const [hash, date, ...subject] = head.split('|')
    return { hash, date, subject: subject.join('|'), files: files.filter(Boolean) }
  })
}

/** `feat(gallery): add x` → `Add x`, so the page reads as release notes. */
function toSummary(commit) {
  const text = SUMMARY_OVERRIDES[commit.hash] ?? commit.subject.replace(/^\w+(\([^)]*\))?!?:\s*/, '')
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/** Falls back to the commit that first wrote `slug: '<slug>'` into the registry. */
function registryCommit(slug, commits) {
  const hashes = git('log', `--since=${YEAR}-01-01`, '--reverse', '--format=%h', '-S', `slug: '${slug}'`, '--', REGISTRY).split('\n').filter(Boolean)
  return commits.find((commit) => commit.hash === hashes[0])
}

const registry = await readRegistry()
const commits = readCommits()
const bySlug = new Map()

for (const example of registry) {
  const folders = [`src/components/shared/${example.slug}/`, `src/components/ui/${example.slug}/`]
  const commit =
    commits.find((c) => c.files.some((file) => folders.some((folder) => file.startsWith(folder)))) ??
    registryCommit(example.slug, commits)
  if (!commit) {
    console.warn(`– ${example.slug}: no commit found this year, skipped`)
    continue
  }
  const list = bySlug.get(commit.hash) ?? []
  list.push(example)
  bySlug.set(commit.hash, list)
}

const entries = commits
  .filter((commit) => bySlug.has(commit.hash))
  .reverse()
  .map((commit) => ({
    date: commit.date,
    commit: commit.hash,
    summary: toSummary(commit),
    components: bySlug.get(commit.hash).sort((a, b) => a.title.localeCompare(b.title)),
  }))

const out = { $schema: './changelogEntries.schema.json', generatedAt: new Date().toISOString().slice(0, 10), entries }
await writeFile(new URL('src/features/changelog/changelogEntries.json', root), `${JSON.stringify(out, null, 2)}\n`)

const total = entries.reduce((sum, entry) => sum + entry.components.length, 0)
console.log(`✓ ${entries.length} releases, ${total} of ${registry.length} components`)
