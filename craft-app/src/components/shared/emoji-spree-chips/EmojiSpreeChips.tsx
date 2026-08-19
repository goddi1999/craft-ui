import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

import { cn } from '@/lib/utils'

import { FloatingEmoji } from './FloatingEmoji'
import type { EmojiSpreeChipsProps, InterestItem } from './emoji-spree-chips.types'

const ROW_COUNT = 3
const PARTICLES_PER_BURST = 3
const PARTICLE_LIFETIME_MS = 1600

type Particle = {
  id: string
  emoji: string
  xOffset: number
  rotate: number
}

function buildRows(interests: InterestItem[]): InterestItem[][] {
  const rows: InterestItem[][] = Array.from({ length: ROW_COUNT }, () => [])
  interests.forEach((item, index) => rows[index % ROW_COUNT].push(item))
  return rows
}

export function EmojiSpreeChips({
  interests,
  title = 'Interests',
  countLabel = 'Interests',
  onChange,
  className,
}: EmojiSpreeChipsProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [particles, setParticles] = useState<Particle[]>([])
  const [isPanning, setIsPanning] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const clearParticlesRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (clearParticlesRef.current) clearTimeout(clearParticlesRef.current)
    }
  }, [])

  const rows = buildRows(interests)

  const spawnParticles = (emoji: string) => {
    setParticles(
      Array.from({ length: PARTICLES_PER_BURST }, () => ({
        id: crypto.randomUUID(),
        emoji,
        xOffset: (Math.random() - 0.5) * 180,
        rotate: (Math.random() - 0.5) * 40,
      })),
    )

    if (clearParticlesRef.current) clearTimeout(clearParticlesRef.current)
    clearParticlesRef.current = setTimeout(
      () => setParticles([]),
      PARTICLE_LIFETIME_MS,
    )
  }

  const handleToggleInterest = (item: InterestItem) => {
    const isSelected = selectedIds.includes(item.id)
    const updated = isSelected
      ? selectedIds.filter((id) => id !== item.id)
      : [...selectedIds, item.id]

    setSelectedIds(updated)
    onChange?.(updated)

    if (!isSelected) spawnParticles(item.emoji)
  }

  return (
    <div
      className={cn(
        'relative isolate flex min-h-[500px] w-full max-w-4xl flex-col items-center overflow-hidden py-10 sm:min-h-[600px]',
        className,
      )}
    >
      <h2 className="mb-6 w-full self-start px-6 text-2xl font-bold sm:mb-8 sm:text-3xl">
        {title}
      </h2>

      <motion.div
        ref={containerRef}
        className={cn(
          'relative z-20 w-full cursor-grab overflow-hidden px-6 mask-l-from-90% mask-r-from-90% active:cursor-grabbing',
          isPanning ? 'touch-none' : 'touch-pan-y',
        )}
      >
        <motion.div
          drag="x"
          dragConstraints={containerRef}
          onPanStart={() => setIsPanning(true)}
          onPanEnd={() => setIsPanning(false)}
          className="flex w-max flex-col gap-4 pr-12 sm:gap-5"
        >
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex w-max gap-4 sm:gap-5">
              {row.map((item) => {
                const isSelected = selectedIds.includes(item.id)

                return (
                  <motion.button
                    key={item.id}
                    type="button"
                    aria-pressed={isSelected}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                    onClick={() => handleToggleInterest(item)}
                    className={cn(
                      'flex w-max items-center gap-2 rounded-full border px-4 py-1.5 text-base font-semibold whitespace-nowrap sm:gap-3 sm:px-5 sm:py-2 sm:text-lg',
                      isSelected
                        ? 'border-neutral-300 bg-white dark:border-neutral-600 dark:bg-neutral-800'
                        : 'border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900',
                    )}
                  >
                    <span aria-hidden>{item.emoji}</span>
                    <span>{item.label}</span>
                  </motion.button>
                )
              })}
            </div>
          ))}
        </motion.div>
      </motion.div>

      <div className="pointer-events-none absolute inset-0">
        <AnimatePresence>
          {particles.map((particle, index) => (
            <FloatingEmoji
              key={particle.id}
              emoji={particle.emoji}
              delay={index * 0.08}
              xOffset={particle.xOffset}
              rotate={particle.rotate}
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 sm:bottom-12">
        <AnimatePresence>
          {selectedIds.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="relative rounded-full border bg-white px-6 py-2.5 text-lg font-bold shadow-lg sm:px-10 sm:py-4 sm:text-xl dark:bg-neutral-900"
            >
              {selectedIds.length} {countLabel}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
