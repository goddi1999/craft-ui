const LENS_IMAGE =
  'https://fastly.picsum.photos/id/1020/2500/1960.jpg?hmac=POmCOVODVD9BG_uttCQgjtbs-r0F_TGW5r54IuLU7oM'

export type ScrollDrivenLensItem = {
  /** Image shown through this lens. */
  src: string
  /** Zoom badge, e.g. `2x`. */
  zoom: string
  /** Lens name and focal length, e.g. `Telephoto | 48mm`. */
  lens: string
  /** How far `object-view-box` crops in, e.g. `30%`. Higher reads as more zoom. */
  crop: string
  /** Alt text for the image. @default '' */
  alt?: string
}

export const SCROLL_DRIVEN_LENS_ITEMS: readonly ScrollDrivenLensItem[] = [
  { src: LENS_IMAGE, zoom: '0.5x', lens: 'Ultra Wide | Macro', crop: '40%' },
  { src: LENS_IMAGE, zoom: '0.5x', lens: 'Ultra Wide | 13mm', crop: '0%' },
  { src: LENS_IMAGE, zoom: '1x', lens: 'Main | 24mm', crop: '10%' },
  { src: LENS_IMAGE, zoom: '1x', lens: 'Main | 28mm', crop: '16%' },
  { src: LENS_IMAGE, zoom: '1x', lens: 'Main | 35mm', crop: '20%' },
  { src: LENS_IMAGE, zoom: '2x', lens: 'Telephoto | 48mm', crop: '24%' },
  { src: LENS_IMAGE, zoom: 'New 5x', lens: 'Telephoto | 120mm', crop: '30%' },
]
