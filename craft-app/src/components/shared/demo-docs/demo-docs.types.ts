/** One row of a component's API reference table. */
export type DemoPropDoc = {
  name: string
  /** TypeScript type as written, e.g. `'sm' | 'default' | 'lg'`. */
  type: string
  /** Default as source, e.g. `'default'`, `true`, `20`. Omit when required. */
  default?: string
  description: string
}

export type DemoDocsProps = {
  /** Folder(s) to copy into a project, relative to the app root. */
  paths: readonly string[]
  /** Copy-paste snippet; build it with `toUsageSnippet` to follow settings. */
  usage: string
  /** Public props of the main component. */
  props: readonly DemoPropDoc[]
  className?: string
}

export type UsagePropValue = string | number | boolean | undefined

export type UsageSnippetOptions = {
  /** Component name as imported, e.g. `SparkleButton`. */
  component: string
  /** Import specifier, e.g. `@/components/ui/sparkle-button`. */
  from: string
  /** Other names imported from the same module, e.g. sub-components. */
  imports?: readonly string[]
  /** Current values of the props the demo exposes. */
  props?: Record<string, UsagePropValue>
  /** Defaults — any prop equal to its default is left out of the snippet. */
  defaults?: Record<string, UsagePropValue>
  /** Text children, or JSX source for more complex children. */
  children?: string
}
