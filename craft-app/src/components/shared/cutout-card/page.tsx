import { ArrowUpRight } from 'lucide-react'
import { motion } from 'motion/react'

import { DemoSettings, DemoSwitch, useDemoSettings } from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { Button } from '@/components/ui/button'
import {
  CutoutCard,
  CutoutCardAction,
  CutoutCardContent,
  CutoutCardFooter,
  CutoutCardImage,
  CutoutCardInsetLabel,
  CutoutCardMedia,
  CutoutCardOverlay,
  CutoutCardPin,
  CutoutCorner,
  cutoutCardSurfaceClassName,
  useCutoutContentStaggerVariants,
} from '@/components/ui/cutout-card'

const DEFAULTS = { revealOnHover: true, showPin: true, showLabel: true }

const PROPS: DemoPropDoc[] = [
  {
    name: 'hovered',
    type: 'boolean',
    description: 'Controls the hover state from the parent.',
  },
  {
    name: 'defaultHovered',
    type: 'boolean',
    default: 'false',
    description: 'Starting hover state when uncontrolled.',
  },
  {
    name: 'onHoveredChange',
    type: '(hovered: boolean) => void',
    description: 'Called when hover or focus changes.',
  },
  {
    name: 'trackPointerHover',
    type: 'boolean',
    default: 'true',
    description: 'Pointer enter/leave and keyboard focus inside the card set hover.',
  },
  {
    name: 'revealOnHover',
    type: 'boolean',
    default: 'true',
    description: 'CutoutCardAction: fade in only while the card is hovered or focused.',
  },
  {
    name: 'size',
    type: 'number',
    default: '32',
    description: 'CutoutCorner: width and height in px.',
  },
  { name: 'className', type: 'string', description: 'Merged onto every part.' },
]

function DemoCard({ revealOnHover, showPin, showLabel }: typeof DEFAULTS) {
  const stagger = useCutoutContentStaggerVariants()

  return (
    <CutoutCard className={`${cutoutCardSurfaceClassName} w-full max-w-sm`}>
      <CutoutCardMedia className="h-64">
        <CutoutCardImage
          src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=720&q=80"
          alt="Mountain lake at dawn"
        />
        <CutoutCardOverlay />
        {showPin ? (
          <CutoutCardPin className="top-0 right-0 rounded-bl-2xl bg-card px-3 py-1.5 text-xs font-medium">
            New
            <CutoutCorner size={16} className="absolute top-0 right-full -scale-y-100 text-card" />
            <CutoutCorner size={16} className="absolute top-full right-0 -scale-y-100 text-card" />
          </CutoutCardPin>
        ) : null}
        {showLabel ? (
          <CutoutCardInsetLabel className="bottom-0 left-0 rounded-tr-2xl bg-card px-4 pt-2 text-sm font-medium">
            Featured
            <CutoutCorner
              size={16}
              className="absolute bottom-full left-0 -scale-x-100 text-card"
            />
            <CutoutCorner
              size={16}
              className="absolute bottom-0 left-full -scale-x-100 text-card"
            />
          </CutoutCardInsetLabel>
        ) : null}
        <CutoutCardAction revealOnHover={revealOnHover} className="top-4 left-4">
          <Button size="sm" variant="secondary">
            Open <ArrowUpRight className="size-4" aria-hidden />
          </Button>
        </CutoutCardAction>
      </CutoutCardMedia>
      <CutoutCardContent>
        <motion.div
          variants={stagger.container}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-2"
        >
          <motion.h3 variants={stagger.item} className="text-lg font-semibold tracking-tight">
            Lakeside retreat
          </motion.h3>
          <motion.p variants={stagger.item} className="text-sm text-muted-foreground">
            Concave corners cut into the photo so labels sit flush with the card surface.
          </motion.p>
          <motion.div variants={stagger.item}>
            <CutoutCardFooter className="pt-2 text-sm">
              <span className="text-muted-foreground">3 nights</span>
              <span className="font-medium">€420</span>
            </CutoutCardFooter>
          </motion.div>
        </motion.div>
      </CutoutCardContent>
    </CutoutCard>
  )
}

export function CutoutCardPage() {
  const settings = useDemoSettings(DEFAULTS)
  const values = settings.values

  const usage = toUsageSnippet({
    component: 'CutoutCard',
    from: '@/components/ui/cutout-card',
    props: { className: { expression: 'cutoutCardSurfaceClassName' } },
    defaults: {},
  })

  return (
    <DemoPage
      eyebrow="ui / cutout-card"
      title="Cutout Card"
      description="A media card whose badges sit in concave cutouts of the photo. Hover or tab into it and the image zooms while an action fades up. Adapted from cult-ui."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSwitch
            label="Reveal action on hover"
            checked={values.revealOnHover}
            onCheckedChange={(next) => settings.set('revealOnHover', next)}
          />
          <DemoSwitch
            label="Pin"
            checked={values.showPin}
            onCheckedChange={(next) => settings.set('showPin', next)}
          />
          <DemoSwitch
            label="Inset label"
            checked={values.showLabel}
            onCheckedChange={(next) => settings.set('showLabel', next)}
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/cutout-card/'], usage, props: PROPS }}
    >
      <DemoCard {...values} />
    </DemoPage>
  )
}
