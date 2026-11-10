import { DemoSettings } from './DemoSettings'
import type { DemoPanelProps } from './demo-controls.types'

/** @deprecated Use `DemoSettings`. Kept so unmigrated pages still render. */
export function DemoPanel(props: DemoPanelProps) {
  return <DemoSettings {...props} />
}
