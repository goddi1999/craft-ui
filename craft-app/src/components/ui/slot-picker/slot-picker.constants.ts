// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
/** Strong ease-out for things that enter or leave. */
export const EASE_OUT = [0.23, 1, 0.32, 1] as const

export const ENTER = { duration: 0.2, ease: EASE_OUT } as const

/** Exits run faster than entrances. */
export const EXIT = { duration: 0.14, ease: EASE_OUT } as const

/** Diagonal hatching for busy slots. */
export const STRIPED =
  'bg-[image:repeating-linear-gradient(-45deg,rgb(128_128_128/0.14)_0_3px,transparent_3px_7px)]'
