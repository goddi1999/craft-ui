import {
  DemoControlGroup,
  DemoSettings,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'

import { SwitchMode } from './SwitchMode'
import type { SwitchModeSize } from './switch-mode.types'

const SIZES: SwitchModeSize[] = ['xs', 'sm', 'default', 'lg']

const DEFAULTS = {
  size: 'default' as SwitchModeSize,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'size',
    type: "'xs' | 'sm' | 'default' | 'lg'",
    default: "'default'",
    description: 'Track and knob scale; xs fits a toolbar.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Extra classes for the switch track.',
  },
]

export function SwitchModePage() {
  const settings = useDemoSettings(DEFAULTS)
  const { size } = settings.values

  const usage = toUsageSnippet({
    component: 'SwitchMode',
    from: '@/components/shared/switch-mode',
    props: { size },
    defaults: DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="shared / switch-mode"
      title="Switch mode"
      description="A theme toggle wired to next-themes. The knob moves as a layout animation rather than a hard-coded offset, so every size variant lands correctly, and the sun and moon counter-rotate as the theme flips."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Size"
            options={SIZES}
            value={size}
            onChange={(value) => settings.set('size', value)}
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/shared/switch-mode/'],
        usage,
        props: PROPS,
      }}
    >
      <SwitchMode size={size} />
    </DemoPage>
  )
}
