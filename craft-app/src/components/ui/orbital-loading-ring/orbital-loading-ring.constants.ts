// seconds per turn at speed 1
export const OUTER_TURN = 2.4
export const INNER_TURN = 1.6
export const CORE_PULSE = 1.2
export const INNER_EASE = 'cubic-bezier(0.4, 0, 0.2, 1)'

// prefixed so they cannot clash with the page's own keyframes
export const SPIN_CW = 'orbital-loading-ring-cw'
export const SPIN_CCW = 'orbital-loading-ring-ccw'
export const PULSE = 'orbital-loading-ring-pulse'

export const KEYFRAMES = `
@keyframes ${SPIN_CW} { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
@keyframes ${SPIN_CCW} { from { transform: rotate(360deg) } to { transform: rotate(0deg) } }
@keyframes ${PULSE} {
  0%, 100% { opacity: 0.6; transform: scale(0.96) }
  50% { opacity: 1; transform: scale(1.04) }
}
`

// the dashed outer track and the solid inner one, as a fraction of the text colour
export const OUTER_TRACK_OPACITY = 0.12
export const INNER_TRACK_OPACITY = 0.17

// glows are the text colour too, so they follow light and dark
export const OUTER_GLOW = 'shadow-[0_0_10px_2px_color-mix(in_oklab,currentColor_60%,transparent)]'
export const INNER_GLOW = 'shadow-[0_0_8px_color-mix(in_oklab,currentColor_40%,transparent)]'
export const CORE_GLOW = 'shadow-[0_0_12px_color-mix(in_oklab,currentColor_50%,transparent)]'
