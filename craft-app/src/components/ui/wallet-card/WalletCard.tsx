import { motion, useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'

import {
  BUTTON,
  CARD,
  SPECULAR,
  SURFACE,
  SURFACE_PAINT,
  TAP_SCALE,
  TOGGLE_KNOB,
  TOGGLE_TRACK,
} from './wallet-card.constants'
import type { WalletCardProps } from './wallet-card.types'
import { usePointerShine } from './use-pointer-shine'

/**
 * A dark wallet card with a painted blue surface, a balance, a small iOS-style toggle and an
 * action button. A soft cyan shine follows the pointer across the surface. Adapted from EasyUI.
 */
export function WalletCard({
  balance = '$4,566.00',
  balanceLabel = 'Total Balance',
  cardType = 'Mastercard',
  cardLastFour = '3040',
  buttonLabel = 'Use Wallet',
  onUseWallet,
  disabled = false,
  className,
  onPointerMove,
  onPointerLeave,
  ...props
}: WalletCardProps) {
  const reduced = useReducedMotion() ?? false
  const { surfaceRef, background, track, park } = usePointerShine(reduced)

  return (
    <article
      data-slot="wallet-card"
      className={cn(CARD, className)}
      onPointerMove={(event) => {
        track(event)
        onPointerMove?.(event)
      }}
      onPointerLeave={(event) => {
        park()
        onPointerLeave?.(event)
      }}
      {...props}
    >
      <div className="relative z-10 flex min-h-[84px] items-start justify-between px-[22px] pt-[23px]">
        <div className="min-w-0">
          <h2 className="m-0 text-[22px] leading-[1.05] font-normal tracking-[-0.025em] text-white/90">
            Wallet
          </h2>
          <p className="m-0 mt-[7px] text-[12px] leading-[1.2] font-normal tracking-[-0.01em] text-white/40">
            {cardType} Ending with {cardLastFour}
          </p>
        </div>

        <motion.button
          type="button"
          onClick={onUseWallet}
          disabled={disabled}
          whileTap={reduced ? undefined : { scale: TAP_SCALE }}
          className={BUTTON}
        >
          {buttonLabel}
        </motion.button>
      </div>

      <div ref={surfaceRef} className={SURFACE} style={{ backgroundImage: SURFACE_PAINT }}>
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: SPECULAR }}
        />

        <div
          aria-hidden
          className="absolute top-[25px] left-[21px] h-[27px] w-[47px] rounded-full shadow-[inset_0_1px_2px_rgba(255,255,255,0.18),0_2px_6px_rgba(0,0,0,0.16)]"
          style={{ backgroundImage: TOGGLE_TRACK }}
        >
          <span
            className="absolute top-[2px] left-[2px] size-[23px] rounded-full shadow-[0_2px_5px_rgba(0,0,0,0.22),inset_0_1px_1px_rgba(255,255,255,0.9)]"
            style={{ backgroundImage: TOGGLE_KNOB }}
          />
        </div>

        <div className="absolute bottom-[23px] left-[22px] flex flex-col items-start">
          <span className="text-[clamp(29px,4.1vw,38px)] leading-[0.95] font-light tracking-[-0.045em] whitespace-nowrap text-white/85">
            {balance}
          </span>
          <span className="mt-2 text-[12px] leading-none font-normal tracking-[-0.01em] text-white/40">
            {balanceLabel}
          </span>
        </div>
      </div>
    </article>
  )
}
