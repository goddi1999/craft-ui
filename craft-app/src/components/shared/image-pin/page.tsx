import { useEffect, useRef, useState } from 'react'
import { Circle, MapPin, PenTool, Square } from 'lucide-react'

import { DemoSettings, DemoSwitch } from '@/components/shared/demo-controls'
import { type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { Button } from '@/components/ui/button'
import {
  ImagePinBoard,
  ImagePinLibrary,
  ImagePinRegionStage,
  findHitRegion,
  readImageFile,
  type ImagePinLibraryImage,
  type ImagePinPoint,
  type ImagePinRegion,
  type ImagePinShape,
  type ImagePinSize,
} from '@/components/ui/image-pin'
import { FileDrop } from '@/components/ui/file-drop'
import { ImagePinPlaceholder } from '@/components/ui/image-pin-empty'
import { RubberDock, type RubberDockItem } from '@/components/ui/rubber-dock'

type Tab = 'draw' | 'pin'

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

const vietnam = (id: number, caption: string): ImagePinLibraryImage => ({
  id: `vietnam-${id}`,
  src: `/lightbox/${id}-2048w.webp`,
  thumbnail: `/lightbox/${id}-640w.webp`,
  alt: caption,
  caption,
  width: 2048,
  height: 1152,
})

const LIBRARY: ImagePinLibraryImage[] = [
  {
    id: 'macbook',
    src: 'https://www.apple.com/v/macbook-neo/a/images/overview/highlights/highlights_ai__cfrukhyww2nm_large_2x.jpg',
    alt: 'A MacBook on a desk, its screen showing an AI writing tool.',
    caption: 'MacBook',
    width: 2520,
    height: 1360,
  },
  {
    id: 'cabinet',
    src: '/lightbox/cabinet-1000w.webp',
    alt: 'A museum cabinet of iPhones and an iPad with their boxes on three shelves.',
    caption: 'Apple Museum cabinet',
    width: 1000,
    height: 1488,
  },
  vietnam(1, 'Ha Long Bay, Quang Ninh'),
  vietnam(2, 'Tra Su Forest, An Giang'),
  vietnam(3, 'Trang An, Ninh Binh'),
  vietnam(4, 'Imperial City, Hue'),
  vietnam(5, 'Bai Dinh Pagoda, Ninh Binh'),
  vietnam(6, 'Saigon River, Ho Chi Minh City'),
  vietnam(7, 'Dragon Bridge, Da Nang'),
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
  { name: 'ImagePinLibrary onInsert', type: '(image) => void', description: 'Library: the Insert button in the full preview a thumbnail opens.' },
  { name: 'showRegions', type: 'boolean', default: 'false', description: 'Board: draw the targets over the image (debug only).' },
  { name: 'showResult', type: 'boolean', default: 'true', description: 'Board: blue pin on a hit, red on a miss.' },
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
      ? 'Drag the pin from the dock onto the image.'
      : hit
        ? `Hit region ${hit.label || hitNumber}`
        : 'Miss: the pin is outside every region.'

  return (
    <DemoPage
      eyebrow="ui / image-pin"
      title="Image Pin"
      description="Pick an image from the library (or drop your own), draw rectangle and circle targets on it, then switch to the pin tab and drag the pin from its dock onto the image to test the hit. The image always fits a screen-height frame, with a blurred fill behind it. Only the image part of the game: no questions, points or chat."
      align="stretch"
      settings={
        tab === 'pin' ? (
          <DemoSettings>
            <DemoSwitch
              label="Show regions"
              checked={showRegions}
              onCheckedChange={setShowRegions}
            />
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
                variant="outline"
                size="sm"
                disabled={!pin}
                onClick={() => setPin(null)}
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
              <ImagePinPlaceholder
                label="No image yet"
                hint="Drop one in the Pin tab, or insert one from the library below."
              />
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
          // The only place to drop a new image: the Pin tab with no image.
          <div className="flex h-[min(70dvh,52rem)] min-h-72 w-full items-center justify-center">
            <FileDrop
              accept="image/*"
              label="Drop an image"
              hint="or click to choose one"
              onFilesChange={importImages}
            />
          </div>
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
            onPinChange={setPin}
            showRegions={showRegions}
          />
        )}
      </div>
    </DemoPage>
  )
}
