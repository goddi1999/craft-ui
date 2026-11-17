import type {
  MarkedWord,
  MarkerResult,
  MarkerSentence,
  MarkerSpec,
  MarkType,
} from './marker-text.types'

export type SentenceSegment = {
  text: string
  /** Set on the words to mark; plain text has none. */
  spec?: MarkerSpec
}

export type ResolvedSentence = {
  segments: SentenceSegment[]
  className?: string
}

type Scoped = { spec: MarkerSpec; scope: string }

type Hit = { start: number; end: number; scoped: Scoped; word: string }

const WORD_CHAR = '[\\p{L}\\p{N}_]'

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Every place `phrase` occurs in `text`, honouring the spec's case and whole-word rules. */
function findAll(text: string, phrase: string, spec: MarkerSpec) {
  const body = escapeRegExp(phrase)
  const source = spec.wholeWord === false ? body : `(?<!${WORD_CHAR})${body}(?!${WORD_CHAR})`
  const flags = spec.caseSensitive ? 'gu' : 'giu'
  return [...text.matchAll(new RegExp(source, flags))].map((match) => ({
    start: match.index,
    end: match.index + match[0].length,
  }))
}

function pick<T>(hits: T[], occurrence: MarkerSpec['occurrence'] = 'all'): T[] {
  if (occurrence === 'all') return hits
  const hit = hits.at(occurrence)
  return hit === undefined ? [] : [hit]
}

const phrasesOf = (spec: MarkerSpec) =>
  (typeof spec.words === 'string' ? [spec.words] : [...spec.words])
    .map((word) => word.trim())
    .filter((word) => word !== '')

/**
 * Finds the words of `specs` in one sentence and cuts it into plain and marked
 * segments. Earlier specs win where two matches overlap.
 */
function splitSentence(text: string, specs: readonly Scoped[]) {
  const taken: Hit[] = []
  const seen = new Set<string>()

  for (const scoped of specs) {
    for (const word of phrasesOf(scoped.spec)) {
      const hits = pick(findAll(text, word, scoped.spec), scoped.spec.occurrence)
      for (const hit of hits) {
        if (taken.some((other) => hit.start < other.end && hit.end > other.start)) continue
        taken.push({ ...hit, scoped, word })
        seen.add(`${scoped.scope}\u0000${word}`)
      }
    }
  }

  taken.sort((a, b) => a.start - b.start)
  const segments: SentenceSegment[] = []
  let cursor = 0
  for (const hit of taken) {
    if (hit.start > cursor) segments.push({ text: text.slice(cursor, hit.start) })
    segments.push({ text: text.slice(hit.start, hit.end), spec: hit.scoped.spec })
    cursor = hit.end
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor) })

  const matched: Omit<MarkedWord, 'sentence'>[] = taken.map((hit) => ({
    text: text.slice(hit.start, hit.end),
    type: (hit.scoped.spec.type ?? 'highlight') as MarkType,
    start: hit.start,
    end: hit.end,
  }))
  return { segments, matched, seen }
}

/**
 * Turns sentences and their marks into segments to render, plus a report of
 * which words were found and which were asked for but are not in the text.
 */
export function resolveSentences(
  sentences: readonly MarkerSentence[],
  shared: readonly MarkerSpec[] = [],
): { sentences: ResolvedSentence[]; result: MarkerResult } {
  const result: MarkerResult = { matched: [], missed: [] }
  const seen = new Set<string>()
  const asked = new Map<string, string>()

  const resolved = sentences.map((sentence, index) => {
    const { text, marks = [], className } =
      typeof sentence === 'string' ? { text: sentence } : sentence
    const specs: Scoped[] = [
      ...marks.map((spec, i) => ({ spec, scope: `own-${index}-${i}` })),
      ...shared.map((spec, i) => ({ spec, scope: `shared-${i}` })),
    ]
    for (const { spec, scope } of specs) {
      for (const word of phrasesOf(spec)) asked.set(`${scope}\u0000${word}`, word)
    }

    const split = splitSentence(text, specs)
    split.seen.forEach((key) => seen.add(key))
    result.matched.push(...split.matched.map((word) => ({ ...word, sentence: index })))
    return { segments: split.segments, className }
  })

  asked.forEach((word, key) => {
    if (!seen.has(key)) result.missed.push(word)
  })
  return { sentences: resolved, result }
}
