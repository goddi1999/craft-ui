import { Children, isValidElement, type ReactElement, type ReactNode } from 'react'

export const hash = (text: string) => {
  let h = 2166136261
  for (let i = 0; i < text.length; i++) {
    h = Math.imul(h ^ text.charCodeAt(i), 16777619)
  }
  return h >>> 0
}

export const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

// without an href an anchor keeps its look but goes nowhere, for previews that shouldn't send visitors away
export const linkTo = (url: string, linked: boolean) =>
  linked ? { href: url, target: '_blank', rel: 'noreferrer' } : {}

// developer.mozilla.org reads as "mozilla", the way people say it
export const siteName = (url: string) => {
  const parts = hostOf(url).split('.')
  return parts.length > 1 ? parts[parts.length - 2] : parts[0]
}

// fixed jitter, so the pace feels uneven but every replay types the same way
export const jitter = (n: number) => ((Math.imul(n + 1, 2654435761) >>> 0) % 1000) / 1000

export type Parent = ReactElement<{ children?: ReactNode }>

// plain tags like p, li, and strong are typed into; components like citations land whole
export const isTag = (node: ReactNode): node is Parent =>
  isValidElement(node) && typeof node.type === 'string'

export const plain = (node: ReactNode): string => {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (isTag(node)) return Children.toArray(node.props.children).map(plain).join('')
  return isValidElement(node) ? '\u0000' : ''
}
