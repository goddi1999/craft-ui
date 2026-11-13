import { cubicBezier } from 'motion/react'

import type { ResolvedSlip } from './package-box.types'

/** Box edge length in design px. */
export const S = 200
export const H2 = S / 2
export const PAPER_W = 240
export const PAPER_H = 340
/** Paper scale while it is still inside the box. */
export const PAPER_S0 = 0.54
export const TAPE_W = 46

export const STAGE_W = 440
export const H_CLOSED = 392
export const H_OPEN = 650
export const BOX_CENTER_FROM_BOTTOM = 197

export const TILT = -30
export const TURN = -45
export const MAJOR_OPEN = -238
export const MINOR_OPEN = -212
export const FORWARD_DIST = 56

export const OPEN_SECONDS = 2.4
export const CLOSE_SECONDS = 1.5

export const EASE_FLAP = cubicBezier(0.34, 1.1, 0.5, 1)
export const EASE_RISE = cubicBezier(0.22, 0.8, 0.2, 1)
export const EASE_SHOW = cubicBezier(0.3, 0.9, 0.3, 1)

export const DEFAULT_COLORS = {
  box: '#b07b4a',
  tape: '#d3c3aa',
  paper: '#fbfaf6',
  ink: '#1c1a17',
  accent: '#c2552b',
} as const

export const DEFAULT_SLIP: ResolvedSlip = {
  eyebrow: 'Packing slip',
  title: 'Thank you, Ana.',
  subtitle: 'Your order is packed and on its way.',
  reference: '№ 4821',
  date: 'Oct 15, 2026',
  recipient: 'Ana Rivera',
  address: '24 Linden Street, Lisbon',
  items: [
    { name: 'Oak desk lamp', qty: 1, price: '$89.00' },
    { name: 'Linen pouch', qty: 2, price: '$36.00' },
    { name: 'Dotted notebook', qty: 1, price: '$14.00' },
  ],
  total: '$139.00',
  stamp: 'Packed',
}

export const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .3 0 0 0 0 .17 0 0 0 0 .06 0 0 0 .5 -.1'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")"

export const BOX_VAR = 'var(--box)'
