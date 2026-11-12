// the shine waits this far off the surface while the pointer is away
export const SHINE_PARKED = -1000
export const SHINE_RADIUS = 220
// cyan at 0.18 keeps it a hint rather than a wash
export const SHINE_COLOR = 'rgba(56, 224, 240, 0.18)'
export const TAP_SCALE = 0.97

// the card is a dark object in both themes; only its shadow and edge follow the page
export const CARD =
  'relative isolate aspect-[458/285] w-full max-w-[458px] overflow-hidden rounded-[26px] bg-[#020202] font-sans text-white shadow-[0_24px_42px_rgba(0,0,0,0.22),0_8px_20px_rgba(0,0,0,0.12)] select-none dark:shadow-[0_24px_42px_rgba(0,0,0,0.48),0_8px_20px_rgba(0,0,0,0.28)] dark:ring-1 dark:ring-white/10'

export const BUTTON =
  'min-h-[35px] shrink-0 cursor-pointer rounded-full border-0 bg-linear-to-br from-[#1675e8] to-[#4698ed] px-4 text-[12px] font-medium tracking-[-0.01em] text-white/95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.16),0_3px_9px_rgba(0,71,180,0.24)] transition-[translate,filter,box-shadow] duration-150 ease-out hover:-translate-y-px hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.18),0_5px_13px_rgba(0,71,180,0.32)] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white disabled:pointer-events-none disabled:opacity-50 motion-reduce:hover:translate-y-0'

export const SURFACE =
  'absolute inset-[84px_4px_4px_4px] overflow-hidden rounded-[22px] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-1px_1px_rgba(0,0,0,0.14)]'

// cyan hotspot on the right, deep blue pools, then the base sweep
export const SURFACE_PAINT = [
  'radial-gradient(ellipse 34% 68% at 88% 38%, rgba(8,207,230,0.98) 0%, rgba(6,169,220,0.92) 20%, rgba(9,100,211,0.45) 42%, transparent 68%)',
  'radial-gradient(ellipse 48% 75% at 63% 72%, rgba(10,48,206,0.95) 0%, rgba(18,53,207,0.68) 43%, transparent 72%)',
  'radial-gradient(ellipse 70% 85% at 25% 65%, rgba(11,70,225,0.94) 0%, rgba(19,43,199,0.78) 48%, transparent 78%)',
  'linear-gradient(145deg, #213bd6 0%, #1232d4 45%, #102ac5 100%)',
].join(', ')

// a diagonal specular band gives the surface its glassy depth
export const SPECULAR =
  'linear-gradient(124deg, transparent 0%, rgba(255,255,255,0.025) 36%, rgba(255,255,255,0.07) 47%, transparent 59%)'

export const TOGGLE_TRACK =
  'linear-gradient(90deg, rgba(255,255,255,0.92) 0 50%, rgba(255,255,255,0.13) 50% 100%)'
export const TOGGLE_KNOB =
  'radial-gradient(circle at 35% 30%, #fff, rgba(218,224,239,0.94) 70%, rgba(191,201,224,0.9) 100%)'
