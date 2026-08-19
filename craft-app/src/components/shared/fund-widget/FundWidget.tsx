import { useState } from 'react'
import {
  motion,
  MotionConfig,
  useMotionTemplate,
  useMotionValue,
  useTransform,
  type MotionValue,
  type PanInfo,
} from 'motion/react'
import { ArrowDown, ArrowUp } from 'lucide-react'

import { cn } from '@/lib/utils'

import {
  DEFAULT_FUND_DATA,
  DRAG_BUFFER,
  FUND_CARD_HEIGHT,
  FUND_WIDGET_SPRING,
} from './fund-widget.constants'
import type { FundItem, FundWidgetProps } from './fund-widget.types'

type FundCardProps = {
  item: FundItem
  index: number
  y: MotionValue<number>
}

function FundCard({ item, index, y }: FundCardProps) {
  const cardOffset = index * FUND_CARD_HEIGHT
  // Cards stay flat while they own the window and tip away past its edges.
  const deadZone = FUND_CARD_HEIGHT * 0.25

  const rotateX = useTransform(
    y,
    [
      -(cardOffset + FUND_CARD_HEIGHT),
      -cardOffset,
      -(cardOffset - FUND_CARD_HEIGHT),
    ],
    [-25, 0, 25],
    { clamp: true },
  )

  const blur = useTransform(
    y,
    [
      -(cardOffset + FUND_CARD_HEIGHT),
      -(cardOffset + deadZone),
      -cardOffset,
      -(cardOffset - deadZone),
      -(cardOffset - FUND_CARD_HEIGHT),
    ],
    [8, 0, 0, 0, 8],
    { clamp: true },
  )

  const filter = useMotionTemplate`blur(${blur}px)`
  const TrendIcon = item.trend === 'down' ? ArrowDown : ArrowUp

  return (
    <motion.div
      className="flex min-h-[320px] min-w-[320px] flex-col p-10 transform-3d"
      style={{ rotateX, filter, transformPerspective: 1000 }}
    >
      <h2 className="text-[60px] leading-none font-bold text-zinc-900 dark:text-zinc-100">
        {item.value}
      </h2>

      <p className="mt-4 flex items-center gap-2 text-[32px] font-bold text-stone-400">
        {item.change}
        <TrendIcon className="size-6" strokeWidth={3} />
      </p>

      <h3 className="mt-12 text-[40px] font-bold text-stone-600 dark:text-stone-200">
        {item.label}
      </h3>
    </motion.div>
  )
}

export function FundWidget({
  data = DEFAULT_FUND_DATA,
  defaultIndex = 0,
  onIndexChange,
  className,
}: FundWidgetProps) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex)
  const y = useMotionValue(-(defaultIndex * FUND_CARD_HEIGHT))

  const lastIndex = data.length - 1

  const goToIndex = (index: number) => {
    const clamped = Math.min(Math.max(index, 0), lastIndex)
    setActiveIndex(clamped)
    onIndexChange?.(clamped)
  }

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y < -DRAG_BUFFER) {
      goToIndex(activeIndex + 1)
    } else if (info.offset.y > DRAG_BUFFER) {
      goToIndex(activeIndex - 1)
    }
  }

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      <MotionConfig transition={FUND_WIDGET_SPRING}>
        <div className="relative">
          {/* The stacked sheet peeking out beneath the card. */}
          <div className="absolute right-[18px] -bottom-[332px] left-[18px] z-[-1] h-20 w-[90%] rounded-[44px] border-2 border-[#E0DEDA] bg-[#F2F1EC] shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:border-white/10 dark:bg-zinc-800" />

          <div className="relative h-[320px] w-[320px] overflow-hidden rounded-[48px] border-2 border-[#E0DEDA] bg-[#FBFCF9] shadow-md transform-3d select-none perspective-[1000px] dark:border-white/10 dark:bg-zinc-900">
            <motion.div
              drag="y"
              dragConstraints={{ top: -(lastIndex * FUND_CARD_HEIGHT), bottom: 0 }}
              dragElastic={0.12}
              style={{ y }}
              onDragEnd={handleDragEnd}
              animate={{ y: -(activeIndex * FUND_CARD_HEIGHT) }}
              className="flex cursor-grab flex-col transform-3d active:cursor-grabbing"
            >
              {data.map((item, index) => (
                <FundCard key={item.id} item={item} index={index} y={y} />
              ))}
            </motion.div>

            <div className="absolute top-1/2 right-7 z-20 flex -translate-y-1/2 flex-col">
              {data.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`Show ${item.label}`}
                  aria-current={activeIndex === index}
                  onClick={() => goToIndex(index)}
                  className="py-1 focus:outline-none"
                >
                  <motion.div
                    animate={{
                      height: activeIndex === index ? 42 : 10,
                      backgroundColor:
                        activeIndex === index ? '#585652' : '#D3D3D3',
                    }}
                    transition={{ duration: 0.3 }}
                    className="w-[8px] rounded-full"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </MotionConfig>
    </div>
  )
}
