import type { UsagePropValue, UsageSnippetOptions } from './demo-docs.types'

const formatProp = (name: string, value: UsagePropValue) => {
  if (typeof value === 'object') return `${name}={${value.expression}}`
  if (value === true) return name
  if (typeof value === 'string') return `${name}="${value}"`
  return `${name}={${String(value)}}`
}

const isJsxSource = (children: string) => children.trimStart().startsWith('<')

/**
 * Builds the usage snippet for the docs section from a demo's live settings,
 * printing only props that differ from their defaults — what you would
 * actually have to write.
 */
export function toUsageSnippet({
  component,
  from,
  imports = [],
  props = {},
  defaults = {},
  children,
}: UsageSnippetOptions) {
  const attributes = Object.entries(props)
    .filter(([name, value]) => value !== undefined && value !== defaults[name])
    .map(([name, value]) => formatProp(name, value))

  const inline = attributes.length ? ` ${attributes.join(' ')}` : ''
  const open =
    inline.length > 60
      ? `<${component}\n${attributes.map((a) => `  ${a}`).join('\n')}\n`
      : `<${component}${inline}`

  let element: string
  if (!children) {
    element = `${open}${open.endsWith('\n') ? '/>' : ' />'}`
  } else if (isJsxSource(children)) {
    const body = children
      .trim()
      .split('\n')
      .map((line) => `  ${line}`)
      .join('\n')
    element = `${open}>\n${body}\n</${component}>`
  } else {
    element = `${open}>${children}</${component}>`
  }

  const names = [component, ...imports].join(', ')
  return `import { ${names} } from '${from}'\n\n${element}`
}
