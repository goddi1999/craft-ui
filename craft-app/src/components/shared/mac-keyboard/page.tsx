import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { MacKeyboard } from '@/components/ui/mac-keyboard'

const PROPS: DemoPropDoc[] = [
  { name: 'className', type: 'string', description: 'Merged onto the outer wrapper.' },
]

export function MacKeyboardPage() {
  const usage = toUsageSnippet({
    component: 'MacKeyboard',
    from: '@/components/ui/mac-keyboard',
    props: {},
    defaults: {},
  })

  return (
    <DemoPage
      eyebrow="ui / mac-keyboard"
      title="Mac Keyboard"
      description="A laptop keyboard illustration with a function row, Touch ID and an inverted-T arrow cluster. Click a key to press it. Adapted from cult-ui."
      docs={{ paths: ['src/components/ui/mac-keyboard/'], usage, props: PROPS }}
    >
      <div className="flex w-full items-center justify-center overflow-x-auto py-8">
        <MacKeyboard />
      </div>
    </DemoPage>
  )
}
