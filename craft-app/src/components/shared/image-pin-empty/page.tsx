import {
  DemoControlGroup,
  DemoSettings,
  DemoSwitch,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import {
  ImagePinPlaceholder,
  type ImagePinPlaceholderBorder,
} from '@/components/ui/image-pin-empty'

const DEFAULT_LABEL = 'No regions yet'
const DEFAULT_HINT = 'Draw at least one region first.'

const BORDERS: ImagePinPlaceholderBorder[] = ['corners', 'full', 'none']

const DEFAULTS = {
  border: 'corners' as ImagePinPlaceholderBorder,
  showInnerRect: true,
  label: '',
  hint: '',
}

const PROPS: DemoPropDoc[] = [
  { name: 'label', type: 'string', default: "'Nothing here yet'", description: 'First line under the icon.' },
  { name: 'hint', type: 'string', description: 'Second, quieter line; hidden when omitted.' },
  { name: 'showInnerRect', type: 'boolean', default: 'true', description: 'The filled block in the top-left of the picture icon.' },
  { name: 'border', type: "'corners' | 'full' | 'none'", default: "'corners'", description: 'Outline: four rounded corner arcs with round ends, a full 1px border, or none.' },
  { name: 'className', type: 'string', default: "'h-[min(70dvh,52rem)]'", description: 'Size the box.' },
]

export function ImagePinEmptyPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { border, showInnerRect, label, hint } = settings.values
  const text = { label: label || DEFAULT_LABEL, hint: hint || DEFAULT_HINT }

  const usage = toUsageSnippet({
    component: 'ImagePinPlaceholder',
    from: '@/components/ui/image-pin-empty',
    props: { label: text.label, hint: text.hint, border, showInnerRect },
    defaults: { border: 'corners', showInnerRect: true },
  })

  return (
    <DemoPage
      eyebrow="ui / image-pin-empty"
      title="Image Pin Empty"
      description="A static empty state with corner arcs, a full border or none, an empty-picture icon with rounded strokes over faint guide lines, and a line of text."
      align="stretch"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Border"
            options={BORDERS}
            value={border}
            onChange={(next) => settings.set('border', next)}
          />
          <DemoSwitch
            label="Inner rectangle"
            checked={showInnerRect}
            onCheckedChange={(next) => settings.set('showInnerRect', next)}
          />
          <DemoTextField
            label="Label"
            value={label}
            placeholder={DEFAULT_LABEL}
            onValueChange={(next) => settings.set('label', next)}
          />
          <DemoTextField
            label="Hint"
            value={hint}
            placeholder={DEFAULT_HINT}
            onValueChange={(next) => settings.set('hint', next)}
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/image-pin-empty/'], usage, props: PROPS }}
    >
      <ImagePinPlaceholder
        label={text.label}
        hint={text.hint}
        border={border}
        showInnerRect={showInnerRect}
      />
    </DemoPage>
  )
}
