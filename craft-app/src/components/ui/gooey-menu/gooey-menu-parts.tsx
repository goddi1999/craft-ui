import { motion, type Variants } from 'motion/react'

import { cn } from '@/lib/utils'

import { GOO_BLUR, GOO_MATRIX, ROW_HEIGHT, SELECTED_DOT } from './gooey-menu.constants'

/** Blur, then a hard alpha threshold: shapes that come close melt into one. */
export function GooFilter({ id }: { id: string }) {
  return (
    <svg aria-hidden width="0" height="0" className="absolute">
      <defs>
        <filter
          id={id}
          x="-30%"
          y="-30%"
          width="160%"
          height="160%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation={GOO_BLUR} result="blur" />
          <feColorMatrix in="blur" type="matrix" values={GOO_MATRIX} result="goo" />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  )
}

/** One row of the panel; the highlight follows the pointer and the arrow keys. */
export function GooeyOption({
  id,
  label,
  active,
  selected,
  variants,
  onHighlight,
  onChoose,
}: {
  id: string
  label: string
  active: boolean
  selected: boolean
  variants: Variants
  onHighlight: () => void
  onChoose: () => void
}) {
  return (
    <motion.li
      id={id}
      role="option"
      aria-selected={selected}
      onMouseEnter={onHighlight}
      onClick={onChoose}
      variants={variants}
      className={cn(
        'mx-[10px] flex cursor-pointer items-center justify-between gap-3 rounded-[14px] px-3 text-[15.5px] transition-colors duration-150 ease-out select-none',
        active ? 'bg-[#232323] text-white' : 'bg-transparent text-[#DCDCDC] hover:text-white',
      )}
      style={{ height: ROW_HEIGHT }}
    >
      <span className="truncate">{label}</span>
      {selected && (
        <span aria-hidden className={cn('size-1.5 shrink-0 rounded-full', SELECTED_DOT)} />
      )}
    </motion.li>
  )
}
