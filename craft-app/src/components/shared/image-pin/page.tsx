import { useEffect, useRef, useState } from 'react'
import { Check, Circle, MapPin, PenTool, Square } from 'lucide-react'

import {
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
} from '@/components/shared/demo-controls'
import { type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { Button } from '@/components/ui/button'
import {
  IMAGE_PIN_SCAN_DEFAULTS,
  ImagePinBoard,
  ImagePinLibrary,
  ImagePinRegionStage,
  findHitRegion,
  readImageFile,
  type ImagePinLibraryImage,
  type ImagePinPoint,
  type ImagePinRegion,
  type ImagePinScanOptions,
  type ImagePinShape,
  type ImagePinSize,
} from '@/components/ui/image-pin'
import { FileDrop } from '@/components/ui/file-drop'
import { ImagePinPlaceholder } from '@/components/ui/image-pin-empty'
import { RubberDock, type RubberDockItem } from '@/components/ui/rubber-dock'

type Tab = 'draw' | 'pin'

const BEAM_COLORS = {
  gray: 'var(--color-neutral-400)',
  blue: 'var(--color-blue-400)',
  red: 'var(--color-red-400)',
  green: 'var(--color-green-400)',
} as const

type BeamColor = keyof typeof BEAM_COLORS

const TAB_ITEMS: RubberDockItem[] = [
  { value: 'draw', label: 'Draw regions', icon: <PenTool /> },
  { value: 'pin', label: 'Drop the pin', icon: <MapPin /> },
]

const SHAPE_ITEMS: RubberDockItem[] = [
  { value: 'rectangle', label: 'Rectangle', icon: <Square /> },
  { value: 'circle', label: 'Circle', icon: <Circle /> },
]

const isTab = (value: string): value is Tab => value === 'draw' || value === 'pin'
const isShape = (value: string): value is ImagePinShape =>
  value === 'rectangle' || value === 'circle'

const LIBRARY: ImagePinLibraryImage[] = [
  {
    id: 'app-store-1',
    src: 'https://is1-ssl.mzstatic.com/image/thumb/D7jPY10jdztPWqX8fx4CaQ/2400x1350sr.webp',
    alt: 'App Store screenshot one.',
    caption: 'App Store screenshot one',
    width: 2400,
    height: 1350,
  },
  {
    id: 'app-store-2',
    src: 'https://is1-ssl.mzstatic.com/image/thumb/za7Mqkp-OSK_2BHWq8AtSQ/1960x1102.jpg',
    alt: 'App Store screenshot two.',
    caption: 'App Store screenshot two',
    width: 1960,
    height: 1102,
  },
  {
    id: 'app-store-3',
    src: 'https://is1-ssl.mzstatic.com/image/thumb/ne2gntUFMP7VISdwM9cLzQ/1960x1102.jpg',
    alt: 'App Store screenshot three.',
    caption: 'App Store screenshot three',
    width: 1960,
    height: 1102,
  },
  {
    id: 'macbook-colors',
    src: 'https://www.apple.com/v/macbook-neo/a/images/overview/highlights/highlights_colors__b33i3trd6mxe_large_2x.jpg',
    alt: 'MacBook colors.',
    caption: 'MacBook colors',
    width: 2520,
    height: 1360,
  },
  {
    id: 'macbook-ai',
    src: 'https://www.apple.com/v/macbook-neo/a/images/overview/highlights/highlights_ai__cfrukhyww2nm_large_2x.jpg',
    alt: 'MacBook AI.',
    caption: 'MacBook AI',
    width: 2520,
    height: 1360,
  },
  {
    id: 'macbook-performance-1',
    src: 'https://www.apple.com/euro/macbook-neo/a/screens_alt/images/overview/product-stories/performance/performance_hero_1_static__c782t9ycacya_large_2x.jpg',
    alt: 'MacBook performance, one.',
    caption: 'MacBook performance, one',
    width: 1472,
    height: 900,
  },
  {
    id: 'macbook-performance-2',
    src: 'https://www.apple.com/euro/macbook-neo/a/screens_alt/images/overview/product-stories/performance/performance_hero_2_static__eyt6d992mbau_large_2x.jpg',
    alt: 'MacBook performance, two.',
    caption: 'MacBook performance, two',
    width: 1472,
    height: 900,
  },
  {
    id: 'macbook-iphone',
    src: 'https://www.apple.com/v/macbook-neo/a/images/overview/highlights/highlights_mac_iphone__b5emh4vjjnyq_medium_2x.jpg',
    alt: 'Mac and iPhone.',
    caption: 'Mac and iPhone',
    width: 1868,
    height: 1256,
  },
  {
    id: 'macbook-macos',
    src: 'https://www.apple.com/euro/macbook-neo/a/screens_alt/images/overview/highlights/highlights_macos__d1kyp7el68uq_medium_2x.jpg',
    alt: 'macOS.',
    caption: 'macOS',
    width: 1868,
    height: 1256,
  },
  {
    id: 'macbook-battery',
    src: 'https://www.apple.com/v/macbook-neo/a/images/overview/highlights/highlights_battery__fu65vu9o4te2_medium_2x.jpg',
    alt: 'MacBook battery.',
    caption: 'MacBook battery',
    width: 1868,
    height: 1256,
  },
  {
    id: 'macbook-camera',
    src: 'https://www.apple.com/euro/macbook-neo/a/screens_alt/images/overview/product-stories/display-camera-audio/dca_camera__bmfj0hk3imnm_large_2x.png',
    alt: 'MacBook camera.',
    caption: 'MacBook camera',
    width: 1964,
    height: 1000,
  },
  {
    id: 'macbook-lifestyle',
    src: 'https://www.apple.com/v/macbook-neo/a/images/overview/product-stories/performance/performance_lifestyle__erk9efbsqgqe_large_2x.jpg',
    alt: 'MacBook lifestyle.',
    caption: 'MacBook lifestyle',
    width: 2072,
    height: 1168,
  },
  {
    id: 'macbook-touch-id',
    src: 'https://www.apple.com/v/macbook-neo/a/images/overview/product-viewer/pv_touchid__e7m0tw3z13sm_large_2x.jpg',
    alt: 'MacBook Touch ID.',
    caption: 'MacBook Touch ID',
    width: 3456,
    height: 1824,
  },
]

const PROPS: DemoPropDoc[] = [
  { name: 'imageSrc', type: 'string', description: 'Both: the image regions and pins sit on.' },
  { name: 'regions', type: 'ImagePinRegion[]', description: 'Both: target shapes in the image’s natural pixel space.' },
  { name: 'onRegionsChange', type: '(next) => void', description: 'Stage: fires after a draw, move or resize.' },
  { name: 'selectedRegionId / onSelectedRegionIdChange', type: 'string | null', description: 'Stage: the region the transformer is attached to.' },
  { name: 'drawMode', type: "'rectangle' | 'circle'", default: "'rectangle'", description: 'Stage: shape created by the next click-drag on the image.' },
  { name: 'pin / onPinChange', type: 'ImagePinPoint | null', description: 'Board: pin centre in 0..1 image space. Drag from the dock onto the image; drop outside to return it (null).' },
  { name: 'dockLabel', type: 'string', default: "'Drag the pin onto the image'", description: 'Board: hint beside the docked pin.' },
  { name: 'className (stage) / frameClassName (board)', type: 'string', default: "'h-[min(70dvh,52rem)]'", description: 'Sizes the image frame. The image always fits inside; empty bands show a blurred copy.' },
  { name: 'onImageRemove', type: '() => void', description: 'Both: round X at the top edge of the frame that removes the image.' },
  { name: 'ImagePinLibrary images / value', type: 'ImagePinLibraryImage[] / string', description: 'Library: the strip of images; `value` (a src) is outlined.' },
  { name: 'ImagePinLibrary onInsert', type: '(image) => void', description: 'Library: fires when a thumbnail is clicked, or from the Insert button in the preview that the round expand button opens.' },
  { name: 'missEffect', type: "'shatter' | 'stay'", default: "'shatter'", description: 'Board: what a miss does. `shatter` bursts the pin into balls (fading to red) as the beam crosses it and returns it to the dock; `stay` turns it red and leaves it. A hit always stays and turns blue.' },
  { name: 'onMissEnd', type: '() => void', description: 'Board: fires when a missed pin has burst, its balls have faded and it is back in the dock.' },
  { name: 'scan', type: 'ImagePinScanOptions', description: 'Board: beam look and timing, and the blur-zoom around the pin. Every field is optional; the ones below show their defaults.' },
  { name: 'scan.duration', type: 'number', default: '1400', description: 'Length of the beam pass in ms. Zoom time comes on top.' },
  { name: 'scan.thickness / glow', type: 'number', default: '4 / 8', description: 'Beam width and glow radius in px.' },
  { name: 'scan.color', type: 'string', default: "'var(--color-neutral-400)'", description: 'Beam colour: any CSS colour or var(). Neutral grey by default.' },
  { name: 'scan.slowMo / slowZone', type: 'number', default: '0.25 / 0.12', description: 'Beam speed next to the pin (1 = no slow motion) and the half-width of that stretch as a share of the image width.' },
  { name: 'scan.zoom', type: 'boolean', default: 'true', description: 'Blur-zoom into the pin just before the beam reaches it; zoom out as the beam leaves the image.' },
  { name: 'scan.zoomScale / zoomBlur', type: 'number', default: '1.5 / 4', description: 'How far the image scales around the pin and the peak blur in px while it moves.' },
  { name: 'scan.zoomInMs / zoomOutMs', type: 'number', default: '380 / 420', description: 'Zoom-in ends as the beam enters the slow stretch; zoom-out starts as it leaves the image.' },
  { name: 'showRegions', type: 'boolean', default: 'false', description: 'Board: draw the targets over the image (debug only).' },
  { name: 'showResult', type: 'boolean', default: 'true', description: 'Board: blue pin on a hit, red on a miss, after the beam crosses it.' },
  { name: 'checkSignal', type: 'number', description: 'Board: bump it to sweep a blue beam left to right. The pin stays neutral until the beam crosses it.' },
  { name: 'onChecked', type: '() => void', description: 'Board: fires when the beam reaches the pin.' },
  { name: 'onScanEnd', type: '() => void', description: 'Board: fires when the beam has left the image.' },
]

const USAGE = `const [regions, setRegions] = useState<ImagePinRegion[]>([])
const [selectedId, setSelectedId] = useState<string | null>(null)
const [pin, setPin] = useState<ImagePinPoint | null>(null)

// author
<ImagePinRegionStage
  imageSrc={src}
  regions={regions}
  onRegionsChange={setRegions}
  selectedRegionId={selectedId}
  onSelectedRegionIdChange={setSelectedId}
  drawMode="circle"
/>

// play
<ImagePinBoard imageSrc={src} regions={regions} pin={pin} onPinChange={setPin} />`

export function ImagePinPage() {
  const [tab, setTab] = useState<Tab>('draw')
  const [library, setLibrary] = useState(LIBRARY)
  const [imageSrc, setImageSrc] = useState(LIBRARY[0].src)
  const importedUrls = useRef<string[]>([])
  const [drawMode, setDrawMode] = useState<ImagePinShape>('rectangle')
  const [regions, setRegions] = useState<ImagePinRegion[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [scene, setScene] = useState<ImagePinSize | null>(null)
  const [pin, setPin] = useState<ImagePinPoint | null>(null)
  const [showRegions, setShowRegions] = useState(false)
  const [shatterMiss, setShatterMiss] = useState(true)
  const [missed, setMissed] = useState(false)
  const [scan, setScan] = useState<Required<ImagePinScanOptions>>(IMAGE_PIN_SCAN_DEFAULTS)
  const [beamColor, setBeamColor] = useState<BeamColor>('gray')
  const setScanField = <K extends keyof ImagePinScanOptions>(
    key: K,
    value: Required<ImagePinScanOptions>[K],
  ) => setScan((current) => ({ ...current, [key]: value }))
  const [checkSignal, setCheckSignal] = useState(0)
  const [pending, setPending] = useState(false)
  const [read, setRead] = useState(false)

  // Imported images stay in the library, so their object URLs live until the page goes.
  useEffect(() => {
    const urls = importedUrls.current
    return () => urls.forEach((url) => URL.revokeObjectURL(url))
  }, [])

  const showImage = (src: string) => {
    setImageSrc(src)
    setRegions([])
    setSelectedId(null)
    setPin(null)
  }

  const insertImage = (image: ImagePinLibraryImage) => {
    if (image.src !== imageSrc) showImage(image.src)
  }

  const removeImage = () => showImage('')

  const importImages = async (files: File[]) => {
    const images = files.filter((file) => file.type.startsWith('image/'))
    const results = await Promise.allSettled(images.map(readImageFile))
    const read = results.flatMap((result) => (result.status === 'fulfilled' ? [result.value] : []))
    if (read.length === 0) return
    importedUrls.current.push(...read.map((image) => image.src))
    setLibrary((current) => [...read, ...current])
    insertImage(read[0])
  }

  useEffect(() => {
    if (tab !== 'draw' || !selectedId) return
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target?.closest('input, textarea, [contenteditable="true"]')) return
      if (event.key !== 'Delete' && event.key !== 'Backspace') return
      event.preventDefault()
      setRegions((current) => current.filter((region) => region.id !== selectedId))
      setSelectedId(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [tab, selectedId])

  const hit = pin && scene ? findHitRegion(pin, regions, scene) : null
  const hitNumber = hit ? regions.findIndex((region) => region.id === hit.id) + 1 : 0
  const pinStatus = !imageSrc
    ? 'Drop an image to start.'
    : !pin
      ? missed
        ? 'Miss: the pin burst and is back in the dock.'
        : 'Drag the pin from the dock onto the image.'
      : !read
        ? pending
          ? 'Checking the pin.'
          : 'Pin is on the image. Check it.'
        : hit
          ? `Hit region ${hit.label || hitNumber}`
          : 'Miss: the pin is outside every region.'

  const placePin = (next: ImagePinPoint | null) => {
    if (next) setMissed(false)
    setPin(next)
    setRead(false)
    setPending(false)
  }

  // No image yet: both tabs offer the same drop zone.
  const imageDrop = (
    <div className="flex h-[min(70dvh,52rem)] min-h-72 w-full items-center justify-center">
      <FileDrop
        accept="image/*"
        label="Drop an image"
        hint="or click to choose one"
        onFilesChange={importImages}
      />
    </div>
  )

  return (
    <DemoPage
      eyebrow="ui / image-pin"
      title="Image Pin"
      description="Click an image in the library to put it on the canvas (the round button on its corner expands a full preview), or drop your own. Draw rectangle and circle targets on it, then switch to the pin tab and drag the pin from its dock onto the image to test the hit. The image always fits a screen-height frame, with a blurred fill behind it. Only the image part of the game: no questions, points or chat."
      align="stretch"
      settings={
        tab === 'pin' ? (
          <DemoSettings>
            <DemoSwitch
              label="Show regions"
              checked={showRegions}
              onCheckedChange={setShowRegions}
            />
            <DemoSwitch
              label="Burst the pin on a miss"
              checked={shatterMiss}
              onCheckedChange={setShatterMiss}
            />
            <DemoControlGroup
              title="Beam colour"
              options={['gray', 'blue', 'red', 'green'] as const}
              value={beamColor}
              onChange={(next) => {
                setBeamColor(next)
                setScanField('color', BEAM_COLORS[next])
              }}
            />
            <DemoSlider label="Duration" value={scan.duration} onValueChange={(v) => setScanField('duration', v)} min={600} max={3000} step={50} unit="ms" />
            <DemoSlider label="Beam thickness" value={scan.thickness} onValueChange={(v) => setScanField('thickness', v)} min={1} max={12} unit="px" />
            <DemoSlider label="Beam glow" value={scan.glow} onValueChange={(v) => setScanField('glow', v)} min={0} max={24} unit="px" />
            <DemoSlider label="Slow motion speed" value={Math.round(scan.slowMo * 100)} onValueChange={(v) => setScanField('slowMo', v / 100)} min={10} max={100} step={5} unit="%" />
            <DemoSlider label="Slow zone" value={Math.round(scan.slowZone * 100)} onValueChange={(v) => setScanField('slowZone', v / 100)} min={0} max={30} unit="%" />
            <DemoSwitch
              label="Zoom into the pin"
              checked={scan.zoom}
              onCheckedChange={(next) => setScanField('zoom', next)}
            />
            <DemoSlider label="Zoom scale" value={Math.round(scan.zoomScale * 100)} onValueChange={(v) => setScanField('zoomScale', v / 100)} min={100} max={250} step={5} unit="%" />
            <DemoSlider label="Zoom blur" value={scan.zoomBlur} onValueChange={(v) => setScanField('zoomBlur', v)} min={0} max={12} unit="px" />
            <DemoSlider label="Zoom in" value={scan.zoomInMs} onValueChange={(v) => setScanField('zoomInMs', v)} min={100} max={800} step={20} unit="ms" />
            <DemoSlider label="Zoom out" value={scan.zoomOutMs} onValueChange={(v) => setScanField('zoomOutMs', v)} min={100} max={800} step={20} unit="ms" />
          </DemoSettings>
        ) : undefined
      }
      docs={{ paths: ['src/components/ui/image-pin/'], usage: USAGE, props: PROPS }}
    >
      <div className="flex w-full flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <RubberDock
            aria-label="Mode"
            items={TAB_ITEMS}
            value={tab}
            onValueChange={(next) => {
              if (!isTab(next)) return
              setTab(next)
              setSelectedId(null)
            }}
          />

          {tab === 'draw' ? (
            <div className="flex flex-wrap items-center gap-2">
              <RubberDock
                aria-label="Shape"
                items={SHAPE_ITEMS}
                value={drawMode}
                onValueChange={(next) => {
                  if (isShape(next)) setDrawMode(next)
                }}
              />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <p aria-live="polite" className="text-sm text-muted-foreground">
                {pinStatus}
              </p>
              <Button
                type="button"
                variant="check"
                size="sm"
                disabled={!pin || pending}
                onClick={() => {
                  setRead(false)
                  setPending(true)
                  setCheckSignal((n) => n + 1)
                }}
              >
                <Check />
                Check
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!pin}
                onClick={() => placePin(null)}
              >
                Reset pin
              </Button>
            </div>
          )}
        </div>

        {tab === 'draw' ? (
          <>
            {imageSrc ? (
              <ImagePinRegionStage
                imageSrc={imageSrc}
                regions={regions}
                onRegionsChange={setRegions}
                selectedRegionId={selectedId}
                onSelectedRegionIdChange={setSelectedId}
                drawMode={drawMode}
                onSceneMetrics={setScene}
                onImageRemove={removeImage}
              />
            ) : (
              imageDrop
            )}
            <p className="text-sm text-muted-foreground">
              Click and drag on the image to draw. Click a region to select, move or resize it.
              Delete or Backspace removes it. {regions.length} region
              {regions.length === 1 ? '' : 's'}.
            </p>
            <ImagePinLibrary
              images={library}
              value={imageSrc}
              onInsert={insertImage}
            />
          </>
        ) : !imageSrc ? (
          imageDrop
        ) : regions.length === 0 ? (
          <ImagePinPlaceholder
            label="No regions yet"
            hint="Draw at least one region in the Draw tab first."
          />
        ) : (
          <ImagePinBoard
            imageSrc={imageSrc}
            regions={regions}
            pin={pin}
            onPinChange={placePin}
            showRegions={showRegions}
            scan={scan}
            missEffect={shatterMiss ? 'shatter' : 'stay'}
            onMissEnd={() => setMissed(true)}
            checkSignal={checkSignal}
            onChecked={() => setRead(true)}
            onScanEnd={() => setPending(false)}
          />
        )}
      </div>
    </DemoPage>
  )
}
