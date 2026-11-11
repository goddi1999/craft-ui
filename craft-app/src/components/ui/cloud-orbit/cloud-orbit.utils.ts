import { AVATAR_SIZE, CHIP_SIZE, RADIUS_X, RADIUS_Y } from './cloud-orbit.constants'

const TAU = Math.PI * 2

/** Where chip `index` of `count` sits for a given orbit angle, as a transform and stacking. */
export function placeChip(angle: number, index: number, count: number, spread: number) {
  const theta = angle + (TAU * index) / count
  // sin runs -1 (far side) to 1 (near side): near chips are bigger and pass in front of the avatar
  const depth = (1 + Math.sin(theta)) / 2
  const scale = (0.5 + 0.62 * depth) * (0.6 + 0.4 * spread)
  const x = Math.cos(theta) * RADIUS_X * spread
  const y = Math.sin(theta) * RADIUS_Y * spread * 0.92

  return {
    transform: `translate3d(${x.toFixed(2)}cqw, ${y.toFixed(2)}cqw, 0) scale(${scale.toFixed(3)})`,
    // the avatar sits at 2, so chips on the near half go over it and the rest slip behind
    zIndex: depth > 0.5 ? 3 : 1,
    opacity: Math.min(1, Math.max(0, spread * 1.6)),
  }
}

export const chipStyle = {
  width: `${CHIP_SIZE}cqw`,
  height: `${CHIP_SIZE}cqw`,
  marginLeft: `${-CHIP_SIZE / 2}cqw`,
  marginTop: `${-CHIP_SIZE / 2}cqw`,
}

export const avatarStyle = {
  width: `${AVATAR_SIZE}cqw`,
  height: `${AVATAR_SIZE}cqw`,
  marginLeft: `${-AVATAR_SIZE / 2}cqw`,
  marginTop: `${-AVATAR_SIZE / 2}cqw`,
}

/** Angle to add per person change: a quarter turn, so chips visibly trade places. */
export const SWAP_ANGLE = TAU / 4
