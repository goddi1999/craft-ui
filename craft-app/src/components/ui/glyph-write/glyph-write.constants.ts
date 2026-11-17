import type { GlyphDefinition } from './glyph-write.types'

/** Strong ease-out for the tile entrance. */
export const EASE_OUT = [0.23, 1, 0.32, 1] as const

/** Handwriting curve: a pen accelerates off the page and slows into each turn. */
export const EASE_WRITE = [0.65, 0, 0.35, 1] as const

/** Tile settles in before the pen touches down. */
export const TILE_DURATION = 0.4
export const PEN_DOWN_DELAY = 0.25

/**
 * 力 for Findlight. Two strokes in standard stroke order:
 * 1. 横折钩: horizontal, turn, down, hook left
 * 2. 撇: left-falling sweep from the top
 */
export const FINDLIGHT_GLYPH: GlyphDefinition = {
  title: 'Findlight',
  viewBox: '0 0 512 512',
  tile: { width: 512, height: 512, radius: 113 },
  fill: 'M85 175L220 165C225 140 226 112 225 91C224 78 220 72 217 68C226 61 239 55 249 55C260 55 274 61 289 70L302 78C304 87 302 99 299 111L292 153L399 132C410 130 416 132 423 138L458 163C465 168 467 176 462 183L445 199C442 203 441 211 440 225C438 258 436 294 431 325C427 353 423 371 414 386C406 400 394 411 380 418C368 424 355 427 346 427C340 427 336 423 332 417L304 379C298 370 293 363 287 355C300 360 316 366 329 368C341 370 350 366 355 358C363 347 366 331 368 307C371 276 372 238 373 190L292 192C287 226 282 257 274 281C264 313 249 338 228 360C207 382 181 402 151 420C139 427 126 433 113 438C129 423 145 408 158 393C183 365 199 340 208 313C218 284 224 249 229 192L140 192C126 192 113 189 105 184C98 181 91 177 85 175Z',
  strokes: [
    {
      d: 'M84 180C150 178 220 176 300 170C350 166 392 154 422 150C436 158 446 168 448 176C418 196 406 212 405 240C403 300 400 340 391 366C383 390 368 406 346 408C328 398 310 378 292 360',
      width: 82,
      duration: 1.1,
      // The bar plus everything right of 撇, so the crossing doesn't notch the bar.
      clip: 'M70 170L220 163L292 151L400 128L480 128L480 460L280 460L280 300L300 196L70 196Z',
    },
    {
      d: 'M226 68C248 58 272 64 270 100C268 150 262 200 256 240C248 300 228 345 190 382C165 405 140 422 112 438',
      width: 90,
      duration: 0.75,
      gap: 1.05,
    },
  ],
}
