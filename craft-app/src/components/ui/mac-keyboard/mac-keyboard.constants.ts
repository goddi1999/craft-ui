import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ChevronUp,
  Command,
  Globe,
  LayoutGrid,
  Mic,
  Moon,
  Option,
  Pause,
  Play,
  Search,
  SkipBack,
  SkipForward,
  Sun,
  SunDim,
  Volume1,
  Volume2,
  VolumeX,
} from 'lucide-react'

import type { CornerPosition, KeyboardKey, KeyDef, KeySize } from './mac-keyboard.types'

export const SIZE_CLASSES: Record<KeySize, string> = {
  '1u': 'w-10 sm:w-11 md:w-12',
  '1.25u': 'w-[52px] sm:w-14 md:w-[60px]',
  '1.5u': 'w-[60px] sm:w-[68px] md:w-[72px]',
  '1.75u': 'w-[70px] sm:w-[78px] md:w-[84px]',
  '2u': 'w-[82px] sm:w-[90px] md:w-[98px]',
  '2.25u': 'w-[92px] sm:w-[100px] md:w-[110px]',
  '2.75u': 'w-[112px] sm:w-[122px] md:w-[134px]',
  '6.25u': 'w-[200px] sm:w-[260px] md:w-[300px]',
}

export const CORNER_CLASSES: Record<CornerPosition, string> = {
  'top-left': 'rounded-tl-xl',
  'top-right': 'rounded-tr-xl',
  'bottom-left': 'rounded-bl-xl',
  'bottom-right': 'rounded-br-xl',
  none: '',
}

const fn = (n: number, icons: KeyDef['icons']): KeyDef => ({
  id: `f${n}`,
  icons,
  secondaryLabel: `F${n}`,
  iconSize: n === 8 ? 11 : 12,
})

const chars = (s: string): KeyDef[] => s.split('').map((c) => ({ id: c, label: c }))

const shifted = (pairs: [string, string][]): KeyDef[] =>
  pairs.map(([label, symbol]) => ({ id: label, label, symbol }))

const MODIFIER_ICON = '-translate-y-1 translate-x-3'

export const KEY_ROWS: KeyboardKey[][] = [
  [
    { id: 'esc', size: '1.5u', corner: 'top-left', label: 'esc' },
    fn(1, [SunDim]),
    fn(2, [Sun]),
    fn(3, [LayoutGrid]),
    fn(4, [Search]),
    fn(5, [Mic]),
    fn(6, [Moon]),
    fn(7, [SkipBack]),
    fn(8, [Play, Pause]),
    fn(9, [SkipForward]),
    fn(10, [VolumeX]),
    fn(11, [Volume1]),
    fn(12, [Volume2]),
    { id: 'touch-id', kind: 'touch-id' },
  ],
  [
    ...shifted([
      ['`', '~'], ['1', '!'], ['2', '@'], ['3', '#'], ['4', '$'], ['5', '%'], ['6', '^'],
      ['7', '&'], ['8', '*'], ['9', '('], ['0', ')'], ['-', '_'], ['=', '+'],
    ]),
    { id: 'delete', size: '1.5u', word: 'delete', wordAlign: 'bottom-right' },
  ],
  [
    { id: 'tab', size: '1.5u', word: 'tab', wordAlign: 'bottom-left' },
    ...chars('QWERTYUIOP'),
    ...shifted([['[', '{'], [']', '}'], ['\\', '|']]),
  ],
  [
    { id: 'caps', size: '1.75u', word: 'caps lock', wordAlign: 'bottom-left', indicator: true },
    ...chars('ASDFGHJKL'),
    ...shifted([[';', ':'], ["'", '"']]),
    { id: 'return', size: '1.75u', word: 'return', wordAlign: 'bottom-right' },
  ],
  [
    { id: 'shift-l', size: '2.25u', word: 'shift', wordAlign: 'bottom-left' },
    ...chars('ZXCVBNM'),
    ...shifted([[',', '<'], ['.', '>'], ['/', '?']]),
    { id: 'shift-r', size: '2.25u', word: 'shift', wordAlign: 'bottom-right' },
  ],
  [
    { id: 'fn', corner: 'bottom-left', icons: [Globe], iconSize: 14, iconClassName: '-translate-x-2.5 translate-y-2' },
    { id: 'control', icons: [ChevronUp], iconSize: 14, iconClassName: MODIFIER_ICON, secondaryLabel: 'control' },
    { id: 'option-l', icons: [Option], iconSize: 14, iconClassName: MODIFIER_ICON, secondaryLabel: 'option' },
    { id: 'command-l', size: '1.25u', icons: [Command], iconSize: 14, iconClassName: MODIFIER_ICON, secondaryLabel: 'command' },
    { id: 'space', kind: 'space' },
    { id: 'command-r', size: '1.25u', icons: [Command], iconSize: 14, iconClassName: MODIFIER_ICON, secondaryLabel: 'command' },
    { id: 'option-r', icons: [Option], iconSize: 14, iconClassName: MODIFIER_ICON, secondaryLabel: 'option' },
    { id: 'arrows', kind: 'arrows' },
  ],
]

export const ARROW_ICONS = { left: ArrowLeft, up: ArrowUp, down: ArrowDown, right: ArrowRight }
