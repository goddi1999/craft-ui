import type { Ref } from 'react'

import { cn } from '@/lib/utils'

// Each layer paints only its border: a transparent padding-box over a gradient border-box.
const RING = 'absolute box-content size-full rounded-full border-transparent'

type EdgeGlowRingProps = {
  ref: Ref<HTMLSpanElement>
  /** Mirror the ring so its hot spot sits on the left edge. */
  mirrored?: boolean
}

/** Three blurred gradient rims stacked into one warm glow on the right edge. */
export function EdgeGlowRing({ ref, mirrored = false }: EdgeGlowRingProps) {
  return (
    <span
      ref={ref}
      aria-hidden
      className={cn(
        'pointer-events-none absolute top-1/2 left-1/2 size-[calc(100%+9px)] rounded-full border-[3px] border-transparent will-change-transform',
        mirrored
          ? 'opacity-0 [transform:translate(-50%,-50%)_scaleX(-1)]'
          : '[transform:translate(-50%,-50%)]',
      )}
    >
      <span
        className={cn(
          RING,
          'top-[-3px] left-[-3px] z-20 border-[3px] blur-[15px] [background:linear-gradient(transparent,transparent)_padding-box,linear-gradient(91.88deg,rgba(255,137,100,.2)_46.45%,#cd3100_98.59%)_border-box]',
        )}
      />
      <span
        className={cn(
          RING,
          'top-[-2px] left-[-2px] z-10 border-2 blur-[2px] [background:linear-gradient(transparent,transparent)_padding-box,linear-gradient(97.68deg,rgba(255,177,153,0)_38.1%,rgba(255,177,153,.2)_82.47%,#ff7950_93.3%)_border-box]',
        )}
      />
      <span className="relative block size-full rounded-full border border-transparent [background:linear-gradient(transparent,transparent)_padding-box,linear-gradient(103.7deg,rgba(188,155,143,.1)_38.66%,rgba(233,132,99,.1)_68.55%,#e98463_85.01%,#fff_92.12%)_border-box]">
        <span
          className={cn(
            RING,
            'top-[-2px] left-[-2px] z-30 border-2 blur-[7px] [background:linear-gradient(transparent,transparent)_padding-box,linear-gradient(91.96deg,rgba(255,177,153,0)_6.11%,rgba(255,177,153,.2)_53.57%,#ff7950_93.6%)_border-box]',
          )}
        />
      </span>
    </span>
  )
}

/** The soft light that follows the pointer behind the label. */
export function EdgeGlowLight({ ref }: { ref: Ref<HTMLSpanElement> }) {
  return (
    <span
      ref={ref}
      aria-hidden
      className="absolute top-0 left-1/2 -z-10 ml-[-102px] flex h-full w-[204px] items-center justify-center"
    >
      <span className="absolute top-1/2 size-[121px] -translate-y-1/2 [background:radial-gradient(50%_50%_at_50%_50%,#fffff5_3.5%,#ffaa81_26.5%,#ffda9f_37.5%,rgba(255,170,129,.5)_49%,rgba(210,106,58,0)_92.5%)]" />
      <span className="absolute top-1/2 h-[103px] w-[204px] -translate-y-1/2 blur-[5px] [background:radial-gradient(43.3%_44.23%_at_50%_49.51%,#fffff7_29%,#fffacd_48.5%,#f4d2bf_60.71%,rgba(214,211,210,0)_100%)]" />
    </span>
  )
}

export function EdgeGlowArrow() {
  return (
    <svg
      className="h-[9px] w-[17px] flex-none"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 17 9"
      aria-hidden
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="m12.495 0 4.495 4.495-4.495 4.495-.99-.99 2.805-2.805H0v-1.4h14.31L11.505.99z"
        clipRule="evenodd"
      />
    </svg>
  )
}
