import type { BlurLoadImage } from './blur-load.types'

const MZ = 'https://is1-ssl.mzstatic.com/image/thumb'
const APPLE = 'https://www.apple.com/v/macbook-neo/a/images/overview'
const APPLE_EU = 'https://www.apple.com/euro/macbook-neo/a/screens_alt/images/overview'

/**
 * MacBook Neo set. Placeholders are the real tiny renditions each CDN serves
 * (mzstatic 40×23, apple.com `_small`), so the blur sits on genuinely low-res pixels.
 */
export const BLUR_LOAD_DEMO_IMAGES: readonly BlurLoadImage[] = [
  {
    src: `${MZ}/D7jPY10jdztPWqX8fx4CaQ/2400x1350sr.webp`,
    placeholderSrc: `${MZ}/D7jPY10jdztPWqX8fx4CaQ/40x23sr.webp`,
    alt: 'MacBook Neo hero',
  },
  {
    src: `${MZ}/za7Mqkp-OSK_2BHWq8AtSQ/1960x1102.jpg`,
    placeholderSrc: `${MZ}/za7Mqkp-OSK_2BHWq8AtSQ/40x23.jpg`,
    alt: 'MacBook Neo on a desk',
  },
  {
    src: `${MZ}/ne2gntUFMP7VISdwM9cLzQ/1960x1102.jpg`,
    placeholderSrc: `${MZ}/ne2gntUFMP7VISdwM9cLzQ/40x23.jpg`,
    alt: 'MacBook Neo in use',
  },
  {
    src: `${APPLE}/highlights/highlights_colors__b33i3trd6mxe_large_2x.jpg`,
    placeholderSrc: `${APPLE}/highlights/highlights_colors__b33i3trd6mxe_small.jpg`,
    alt: 'MacBook Neo colours',
  },
  {
    src: `${APPLE}/highlights/highlights_ai__cfrukhyww2nm_large_2x.jpg`,
    placeholderSrc: `${APPLE}/highlights/highlights_ai__cfrukhyww2nm_small.jpg`,
    alt: 'Apple Intelligence on MacBook Neo',
  },
  {
    src: `${APPLE_EU}/product-stories/performance/performance_hero_1_static__c782t9ycacya_large_2x.jpg`,
    placeholderSrc: `${APPLE_EU}/product-stories/performance/performance_hero_1_static__c782t9ycacya_small.jpg`,
    alt: 'MacBook Neo performance',
  },
  {
    src: `${APPLE_EU}/product-stories/performance/performance_hero_2_static__eyt6d992mbau_large_2x.jpg`,
    placeholderSrc: `${APPLE_EU}/product-stories/performance/performance_hero_2_static__eyt6d992mbau_small.jpg`,
    alt: 'MacBook Neo performance, second view',
  },
  {
    src: `${APPLE}/highlights/highlights_mac_iphone__b5emh4vjjnyq_medium_2x.jpg`,
    placeholderSrc: `${APPLE}/highlights/highlights_mac_iphone__b5emh4vjjnyq_small.jpg`,
    alt: 'MacBook Neo with iPhone',
  },
  {
    src: `${APPLE_EU}/highlights/highlights_macos__d1kyp7el68uq_medium_2x.jpg`,
    placeholderSrc: `${APPLE_EU}/highlights/highlights_macos__d1kyp7el68uq_small.jpg`,
    alt: 'macOS on MacBook Neo',
  },
  {
    src: `${APPLE}/highlights/highlights_battery__fu65vu9o4te2_medium_2x.jpg`,
    placeholderSrc: `${APPLE}/highlights/highlights_battery__fu65vu9o4te2_small.jpg`,
    alt: 'MacBook Neo battery life',
  },
  {
    src: `${APPLE_EU}/product-stories/display-camera-audio/dca_camera__bmfj0hk3imnm_large_2x.png`,
    placeholderSrc: `${APPLE_EU}/product-stories/display-camera-audio/dca_camera__bmfj0hk3imnm_small.png`,
    alt: 'MacBook Neo camera',
  },
  {
    src: `${APPLE}/product-stories/performance/performance_lifestyle__erk9efbsqgqe_large_2x.jpg`,
    placeholderSrc: `${APPLE}/product-stories/performance/performance_lifestyle__erk9efbsqgqe_small.jpg`,
    alt: 'MacBook Neo lifestyle',
  },
]

export const BLUR_LOAD_DEFAULT_DURATION_MS = 2800

/** Heavy by default (Tailwind `blur-3xl` = 64px) so the preview reads as colour, not detail. */
export const BLUR_LOAD_DEFAULT_BLUR = 64
