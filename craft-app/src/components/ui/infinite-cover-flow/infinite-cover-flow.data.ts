export type CoverFlowItem = {
  /** Cover image URL. */
  src: string
  /** Accessible description of the cover. */
  alt: string
}

const COVER_URLS = [
  'https://i.scdn.co/image/ab67616d00001e020ecc8c4fd215d9eb83cbfdb3',
  'https://i.scdn.co/image/ab67616d00001e02d9194aa18fa4c9362b47464f',
  'https://i.scdn.co/image/ab67616d00001e02a7ea08ab3914c5fb2084a8ac',
  'https://i.scdn.co/image/ab67616d00001e0213ca80c3035333e5a6fcea59',
  'https://i.scdn.co/image/ab67616d00001e02df04e6071763615d44643725',
  'https://i.scdn.co/image/ab67616d00001e0239c7302c04f8d06f60e14403',
  'https://i.scdn.co/image/ab67616d00001e021c0bcf8b536295438d26c70d',
  'https://i.scdn.co/image/ab67616d00001e029bbd79106e510d13a9a5ec33',
  'https://i.scdn.co/image/ab67616d00001e021d97ca7376f835055f828139',
  'https://www.udiscovermusic.com/wp-content/uploads/2015/10/Kanye-West-Yeezus.jpg',
]

export const DEFAULT_COVERS: CoverFlowItem[] = COVER_URLS.map((src, i) => ({
  src,
  alt: `Album cover ${i + 1}`,
}))
