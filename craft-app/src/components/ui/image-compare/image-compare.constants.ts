import type { Transition } from 'motion/react'

// uiarc motion tokens, inlined so the folder copies on its own
export const SPRING_SNAPPY = { type: 'spring', visualDuration: 0.26, bounce: 0 } as const
export const SPRING_MORPH = { type: 'spring', visualDuration: 0.42, bounce: 0 } as const

// motion drops velocity on time-defined springs, so hand-offs run the same springs written as
// stiffness and damping, settling far below a pixel
function physicalSpring({ visualDuration, bounce }: { visualDuration: number; bounce: number }) {
  const root = (2 * Math.PI) / (visualDuration * 1.2)
  return {
    type: 'spring',
    stiffness: root * root,
    damping: 2 * (1 - bounce) * root,
    restDelta: 0.002,
    restSpeed: 0.02,
  } satisfies Transition
}

export const MOVE_SPRING = physicalSpring(SPRING_SNAPPY)
export const TURN_SPRING = physicalSpring(SPRING_MORPH)
export const KICK_SPRING = physicalSpring(SPRING_MORPH)
export const INSTANT = { duration: 0 } as const

// rubber-band travel past an edge, in px
export const STRETCH = 9
// the handle's inset from the frame, and how far it gives inside that inset
export const MARGIN = 42
export const GIVE = 12
// how hard a key press at a limit kicks the divider, in px per second
export const BUMP_PX = 150
// the captions' inset from the frame, in px
export const INSET = 12
// a touch press waits for this much travel before it decides between a drag and a scroll
export const SLOP = 6

// the handle is a circle at rest and stretches into a capsule along the drag
export const HANDLE_REST = { width: 40, height: 40 }
export const HANDLE_ACROSS = { width: 56, height: 36 }
export const HANDLE_DOWN = { width: 36, height: 56 }

// the frame is a size container, so the divider's line can span any angle with container units
export const ROOT =
  'group/compare relative isolate block w-full cursor-ew-resize touch-pan-y overflow-clip rounded-[1.625rem] bg-muted select-none [container-type:size] [-webkit-tap-highlight-color:transparent] after:pointer-events-none after:absolute after:inset-0 after:z-[3] after:rounded-[inherit] after:inset-ring after:inset-ring-foreground/8 data-[orientation=vertical]:cursor-ns-resize data-[orientation=vertical]:touch-pan-x'

export const LAYER =
  'absolute inset-0 [&_:is(img,picture,video)]:pointer-events-none [&_:is(img,picture,video)]:block [&_:is(img,picture,video)]:size-full [&_:is(img,picture,video)]:object-cover [&_:is(img,picture,video)]:[-webkit-user-drag:none]'

// captions sit on a frosted chip so they read over any photo
export const CHIP =
  'pointer-events-none absolute z-[1] rounded-full bg-background/75 px-2.5 py-[3px] text-xs leading-[1.4] font-medium tracking-[-0.01em] text-foreground backdrop-blur-md backdrop-saturate-[1.4]'

// the line sits on photography, not on the theme, so it stays light in dark mode too
export const LINE =
  'absolute -left-px h-[calc((100cqw+100cqh)*2)] w-0.5 top-[calc((100cqw+100cqh)*-1)] bg-popover shadow-[0_0_0_0.5px_oklch(0%_0_0/0.14)] dark:bg-foreground'

// centered with the translate property; motion only animates its width and height, so the shape
// morphs without scaling the icons
export const HANDLE =
  'pointer-events-auto absolute top-0 left-0 box-border grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-border bg-popover text-foreground shadow-[0_6px_18px_oklch(0%_0_0/0.065),0_1px_3px_oklch(0%_0_0/0.035)] outline-none transition-[border-color] duration-160 ease-[cubic-bezier(.22,1,.36,1)] after:absolute after:-inset-2 after:rounded-[inherit] group-hover/compare:border-foreground/25 focus-visible:ring-2 focus-visible:ring-ring data-quiet:focus-visible:ring-0 motion-reduce:transition-none dark:shadow-[0_8px_22px_oklch(0%_0_0/0.22)]'
