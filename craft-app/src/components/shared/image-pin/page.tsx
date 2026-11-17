import { useEffect, useRef, useState } from 'react'

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
import { Segmented } from '@/components/ui/segmented-control'

type Tab = 'draw' | 'pin'

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
  { name: 'ImagePinLibrary images / value', type: 'ImagePinLibraryImage[] / string', description: 'Library: the strip of images; `value` (a src) is outlined.' },
  { name: 'ImagePinLibrary onInsert', type: '(image) => void', description: 'Library: the Insert button in the full preview a thumbnail opens.' },
  { name: 'ImagePinLibrary onImport', type: '(files: File[]) => void', description: 'Library: drop zone for your own images (readImageFile turns one into a library entry). Omit to hide it.' },
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

  const insertImage = (image: ImagePinLibraryImage) => {
    if (image.src === imageSrc) return
    setImageSrc(image.src)
    setRegions([])
    setSelectedId(null)
    setPin(null)
  }

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
  const pinStatus = !pin
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
          <Segmented<Tab>
            label="Mode"
            value={tab}
            onValueChange={(next) => {
              setTab(next)
              setSelectedId(null)
            }}
            options={[
              { value: 'draw', label: 'Draw' },
              { value: 'pin', label: 'Pin' },
            ]}
          />

          {tab === 'draw' ? (
            <div className="flex flex-wrap items-center gap-2">
              <Segmented<ImagePinShape>
                label="Shape"
                value={drawMode}
                onValueChange={setDrawMode}
                options={[
                  { value: 'rectangle', label: 'Rectangle' },
                  { value: 'circle', label: 'Circle' },
                ]}
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
            <ImagePinRegionStage
              imageSrc={imageSrc}
              regions={regions}
              onRegionsChange={setRegions}
              selectedRegionId={selectedId}
              onSelectedRegionIdChange={setSelectedId}
              drawMode={drawMode}
              onSceneMetrics={setScene}
            />
            <p className="text-sm text-muted-foreground">
              Click and drag on the image to draw. Click a region to select, move or resize it.
              Delete or Backspace removes it. {regions.length} region
              {regions.length === 1 ? '' : 's'}.
            </p>
            <ImagePinLibrary
              images={library}
              value={imageSrc}
              onInsert={insertImage}
              onImport={importImages}
            />
          </>
        ) : regions.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
            Draw at least one region in the Draw tab first.
          </p>
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
