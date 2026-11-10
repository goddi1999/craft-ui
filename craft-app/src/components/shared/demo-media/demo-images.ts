export type DemoImage = {
  src: string
  /** Describes what the photo shows. */
  alt: string
}

const DEMO_IMAGE_SOURCES: [src: string, alt: string][] = [
  [
    'https://is1-ssl.mzstatic.com/image/thumb/D7jPY10jdztPWqX8fx4CaQ/2400x1350sr.webp',
    'Two women on a riverside quay in Paris at dusk',
  ],
  [
    'https://is1-ssl.mzstatic.com/image/thumb/za7Mqkp-OSK_2BHWq8AtSQ/1960x1102.jpg',
    'Imperfect Women key art',
  ],
  [
    'https://is1-ssl.mzstatic.com/image/thumb/ne2gntUFMP7VISdwM9cLzQ/1960x1102.jpg',
    'Beschütze Sie key art',
  ],
  [
    'https://www.apple.com/v/macbook-neo/a/images/overview/highlights/highlights_colors__b33i3trd6mxe_large_2x.jpg',
    'MacBook Neo in four colours, fanned open',
  ],
  [
    'https://www.apple.com/v/macbook-neo/a/images/overview/highlights/highlights_ai__cfrukhyww2nm_large_2x.jpg',
    'Four friends posing with a football against a white wall',
  ],
  [
    'https://www.apple.com/euro/macbook-neo/a/screens_alt/images/overview/product-stories/performance/performance_hero_1_static__c782t9ycacya_large_2x.jpg',
    'MacBook Neo showing a school sports day website',
  ],
  [
    'https://www.apple.com/euro/macbook-neo/a/screens_alt/images/overview/product-stories/performance/performance_hero_2_static__eyt6d992mbau_large_2x.jpg',
    'MacBook Neo showing a Sticky Science article',
  ],
  [
    'https://www.apple.com/v/macbook-neo/a/images/overview/highlights/highlights_mac_iphone__b5emh4vjjnyq_medium_2x.jpg',
    'The macOS Dock with Office, Slack and Canva apps',
  ],
  [
    'https://www.apple.com/euro/macbook-neo/a/screens_alt/images/overview/highlights/highlights_macos__d1kyp7el68uq_medium_2x.jpg',
    'Messages open on a Mac and an iPhone side by side',
  ],
  [
    'https://www.apple.com/v/macbook-neo/a/images/overview/highlights/highlights_battery__fu65vu9o4te2_medium_2x.jpg',
    'A student working on a yellow MacBook Neo in class',
  ],
  [
    'https://www.apple.com/euro/macbook-neo/a/screens_alt/images/overview/product-stories/display-camera-audio/dca_camera__bmfj0hk3imnm_large_2x.png',
    'A FaceTime call on a MacBook Neo display',
  ],
  [
    'https://www.apple.com/v/macbook-neo/a/images/overview/product-stories/performance/performance_lifestyle__erk9efbsqgqe_large_2x.jpg',
    'A teenager on a bed using a MacBook Neo with headphones',
  ],
  [
    'https://www.apple.com/v/macbook-neo/a/images/overview/product-viewer/pv_touchid__e7m0tw3z13sm_large_2x.jpg',
    'Close-up of the Touch ID key on a silver MacBook Neo',
  ],
  [
    'https://is1-ssl.mzstatic.com/image/thumb/8rF8s5lmPuF1fmRHAMrzKQ/2500x1406.jpg',
    'The Family Plan 2 key art',
  ],
  [
    'https://is1-ssl.mzstatic.com/image/thumb/1A5UrdlUF6-zEu5cfQvZag/1960x1102.jpg',
    'Down Cemetery Road key art',
  ],
  [
    'https://is1-ssl.mzstatic.com/image/thumb/x8-VGWym1ynhFRfVPINL9w/2500x1406.jpg',
    'Teheran key art',
  ],
]

/**
 * The shared photo set for every image-based demo: Apple TV stills and
 * MacBook Neo product shots, all landscape (~16:9). Hotlinked, so a demo
 * breaks gracefully to its placeholder if a URL ever moves.
 */
export const DEMO_IMAGES: DemoImage[] = DEMO_IMAGE_SOURCES.map(([src, alt]) => ({
  src,
  alt,
}))
