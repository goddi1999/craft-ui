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

const BORDERS: ImagePinPlaceholderBorder[] = ['none', 'full']
const ICON_FRAMES = ['corners', 'full'] as const

const DEFAULTS = {
  border: 'none' as ImagePinPlaceholderBorder,
  iconFrame: 'corners' as (typeof ICON_FRAMES)[number],
  showInnerRect: true,
  showArt: true,
  label: '',
  hint: '',
}

const PROPS: DemoPropDoc[] = [
  { name: 'label', type: 'string', default: "'Nothing here yet'", description: 'First line under the centre art.' },
  { name: 'hint', type: 'string', description: 'Second, quieter line; hidden when omitted.' },
  { name: 'showInnerRect', type: 'boolean', default: 'true', description: 'Filled block in the top-left of the centre picture mark.' },
  { name: 'showArt', type: 'boolean', default: 'true', description: 'Centre SVG (guides + picture mark + text).' },
  { name: 'border', type: "'full' | 'none'", default: "'none'", description: 'Box outline only. Outer L-brackets are `CornerFrame`, not this component.' },
  { name: 'iconFrame', type: "'corners' | 'full'", default: "'corners'", description: 'Centre picture mark: open L-brackets or a closed rounded rect.' },
  { name: 'className', type: 'string', default: "'h-[min(70dvh,52rem)]'", description: 'Size the box.' },
]

export function ImagePinEmptyPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { border, iconFrame, showInnerRect, showArt, label, hint } =
    settings.values
  const text = { label: label || DEFAULT_LABEL, hint: hint || DEFAULT_HINT }

  const usage = toUsageSnippet({
    component: 'ImagePinPlaceholder',
    from: '@/components/ui/image-pin-empty',
    props: {
      label: text.label,
      hint: text.hint,
      border,
      iconFrame,
      showInnerRect,
      showArt,
    },
    defaults: {
      border: 'none',
      iconFrame: 'corners',
      showInnerRect: true,
      showArt: true,
    },
  })

  return (
    <DemoPage
      eyebrow="ui / image-pin-empty"
      title="Image Pin Empty"
      description="Centre empty-picture SVG only (guides, L-bracket mark, label). Outer corner brackets belong to CornerFrame."
      align="stretch"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Border"
            options={BORDERS}
            value={border}
            onChange={(next) => settings.set('border', next)}
          />
          <DemoControlGroup
            title="Icon frame"
            options={[...ICON_FRAMES]}
            value={iconFrame}
            onChange={(next) => settings.set('iconFrame', next)}
          />
          <DemoSwitch
            label="Centre art"
            checked={showArt}
            onCheckedChange={(next) => settings.set('showArt', next)}
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
        iconFrame={iconFrame}
        showInnerRect={showInnerRect}
        showArt={showArt}
      />
    </DemoPage>
  )
}
