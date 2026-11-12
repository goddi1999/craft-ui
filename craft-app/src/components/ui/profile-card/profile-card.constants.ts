// a light press on the main button, on motion's default spring
export const TAP_SCALE = 0.97

export const X_PROFILE = 'https://x.com/'

// the card stays dark in both themes; a faint ring lifts it off a dark page
export const SURFACE =
  'bg-black text-white shadow-[0_18px_45px_rgba(0,0,0,0.14)] dark:ring-1 dark:ring-white/10'

export const FOCUS_RING =
  'outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black'

// stacked gradients that paint the blue moon cover, top to bottom
export const COVER_LAYERS = [
  // upper blue glow
  '-top-[150px] -left-[170px] h-[340px] w-[760px] rounded-full bg-[radial-gradient(ellipse_at_55%_60%,#6e87ed_0%,#354e9a_28%,#101a36_57%,#020307_78%)]',
  // upper black curve
  '-top-[155px] -left-[220px] h-[300px] w-[880px] -rotate-16 rounded-[50%] bg-black',
  // main blue curve
  'top-[120px] -left-[55px] h-[220px] w-[720px] rounded-[50%] bg-[radial-gradient(ellipse_at_45%_35%,#5b72cf_0%,#273967_34%,#0a1225_62%,#000_82%)]',
  // black separator
  'top-[100px] -left-[110px] h-[140px] w-[820px] -rotate-4 rounded-[50%] bg-black',
  // lower blue region
  'top-[160px] -left-[65px] h-[170px] w-[760px] rounded-[50%] bg-[radial-gradient(ellipse_at_48%_0%,#7188e7_0%,#394e92_35%,#101a35_66%,#020307_88%)]',
  // lower darkness
  '-right-[180px] -bottom-[90px] h-[240px] w-[520px] rounded-full bg-[radial-gradient(circle,#0d152c_0%,#03050b_55%,#000_78%)] opacity-90',
] as const
