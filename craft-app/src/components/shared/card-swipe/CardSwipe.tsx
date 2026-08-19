import { useState } from 'react'
import {
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
  type PanInfo,
} from 'motion/react'

import { cn } from '@/lib/utils'

import {
  CARD_GAP,
  CARD_HEIGHT,
  CARD_STRIDE,
  CARD_SWIPE_SPRING,
  CARD_WIDTH,
  DEFAULT_CARD_SWIPE_ITEMS,
  DRAG_BUFFER,
  VELOCITY_THRESHOLD,
} from './card-swipe.constants'
import type { CardSwipeItem, CardSwipeProps } from './card-swipe.types'

type CardSwipeCardProps = {
  item: CardSwipeItem
  index: number
  x: MotionValue<number>
  onAction?: (item: CardSwipeItem) => void
}

function CardSwipeCard({ item, index, x, onAction }: CardSwipeCardProps) {
  // The card faces the viewer only while it is the one centred in the track;
  // its neighbours swing away on the Y axis as the track slides past them.
  const rotateY = useTransform(
    x,
    [-CARD_STRIDE * (index + 1), -CARD_STRIDE * index, -CARD_STRIDE * (index - 1)],
    [90, 0, -90],
    { clamp: false },
  )

  const Icon = item.icon

  return (
    <motion.div
      style={{ width: CARD_WIDTH, height: CARD_HEIGHT, rotateY, flexShrink: 0 }}
      transition={CARD_SWIPE_SPRING}
      className="flex cursor-grab flex-col items-start rounded-[40px] border-[1.6px] border-[#ECECEC] bg-[#FEFEFE] p-8 text-[#010101] transition-colors active:cursor-grabbing sm:p-10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
    >
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[20px] border-[1.6px] border-[#ECECEC] bg-[#FEFEFE] shadow-[0_6px_20px_rgba(0,0,0,0.08)] transition-colors sm:mb-10 sm:h-24 sm:w-24 sm:rounded-[24px] dark:border-zinc-800 dark:bg-zinc-900">
        <Icon className="size-13" strokeWidth={1.5} />
      </div>

      <h2 className="mb-2 text-2xl font-bold sm:text-[32px]">{item.title}</h2>

      <p className="mb-5 text-lg text-[#77767B] sm:text-[22px] dark:text-zinc-400">
        {item.description}
      </p>

      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onAction?.(item)}
        className="rounded-full bg-[#262626] px-6 py-2.5 text-sm text-[#F2F2F2] shadow-sm sm:px-7 sm:py-3 sm:text-base dark:bg-zinc-100 dark:text-zinc-900"
      >
        {item.actionLabel ?? 'Get Started'}
      </motion.button>
    </motion.div>
  )
}

export function CardSwipe({
  items = DEFAULT_CARD_SWIPE_ITEMS,
  defaultIndex = 0,
  onIndexChange,
  onAction,
  className,
}: CardSwipeProps) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex)
  const x = useMotionValue(-(defaultIndex * CARD_STRIDE))

  const lastIndex = items.length - 1

  const goToIndex = (index: number) => {
    const clamped = Math.min(Math.max(index, 0), lastIndex)
    setActiveIndex(clamped)
    onIndexChange?.(clamped)
  }

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const draggedFarEnough = info.offset.x < -DRAG_BUFFER
    const flickedForward = info.velocity.x < -VELOCITY_THRESHOLD

    if (draggedFarEnough || flickedForward) {
      goToIndex(activeIndex + 1)
    } else if (info.offset.x > DRAG_BUFFER || info.velocity.x > VELOCITY_THRESHOLD) {
      goToIndex(activeIndex - 1)
    }
  }

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div
        className="relative overflow-hidden"
        style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
      >
        <motion.div
          className="flex"
          drag="x"
          dragConstraints={{ left: -(CARD_STRIDE * lastIndex), right: 0 }}
          style={{
            gap: CARD_GAP,
            perspective: 1000,
            perspectiveOrigin: activeIndex * CARD_WIDTH + CARD_WIDTH / 2,
            x,
          }}
          onDragEnd={handleDragEnd}
          animate={{ x: -(activeIndex * CARD_STRIDE) }}
          transition={CARD_SWIPE_SPRING}
        >
          {items.map((item, index) => (
            <CardSwipeCard
              key={item.id}
              item={item}
              index={index}
              x={x}
              onAction={onAction}
            />
          ))}
        </motion.div>
      </div>

      <div className="mt-4 flex gap-3 sm:mt-6">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            aria-label={`Show ${item.title}`}
            aria-current={activeIndex === index}
            onClick={() => goToIndex(index)}
            className={cn(
              'h-2 w-2 cursor-pointer rounded-full bg-zinc-200 transition-colors duration-200 dark:bg-zinc-700',
              activeIndex === index && 'bg-zinc-400 dark:bg-zinc-400',
            )}
          />
        ))}
      </div>
    </div>
  )
}
