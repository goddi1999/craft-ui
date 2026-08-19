import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { PanelLeft, Plus } from 'lucide-react'

import { useDisclosure } from '@/hooks'
import { cn } from '@/lib/utils'

import type { MacOSSidebarItem, MacOSSidebarProps } from './macos-sidebar.types'

const OPEN_WIDTH = 240
const COLLAPSED_WIDTH = 64

export function MacOSSidebar({
  items,
  defaultOpen = true,
  defaultSelectedId,
  onSelect,
  onAdd,
  children,
  className,
}: MacOSSidebarProps) {
  const { isOpen, onToggle } = useDisclosure(defaultOpen)
  const [selectedId, setSelectedId] = useState(
    defaultSelectedId ?? items[0]?.id,
  )
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const handleSelect = (item: MacOSSidebarItem) => {
    setSelectedId(item.id)
    onSelect?.(item)
  }

  return (
    <div
      className={cn(
        'relative flex w-full overflow-hidden rounded-3xl bg-neutral-200 p-3 sm:min-w-[480px] dark:bg-neutral-900',
        className,
      )}
    >
      <motion.div
        animate={{ width: isOpen ? OPEN_WIDTH : COLLAPSED_WIDTH }}
        transition={{ type: 'spring', bounce: 0.4, duration: 0.8 }}
        className={cn(
          'flex shrink-0 flex-col items-start rounded-2xl p-2 transition-colors duration-700 ease-out',
          isOpen ? 'bg-neutral-100 dark:bg-neutral-800' : 'bg-transparent',
        )}
      >
        <div
          className={cn(
            'flex w-full shrink-0 items-center p-2 text-neutral-700 dark:text-neutral-300',
            isOpen ? 'justify-end gap-4' : 'justify-center',
          )}
        >
          <AnimatePresence>
            {isOpen && (
              <motion.button
                type="button"
                aria-label="New item"
                onClick={onAdd}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Plus className="size-5 cursor-pointer" />
              </motion.button>
            )}
          </AnimatePresence>

          <motion.button
            layout
            type="button"
            aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            aria-expanded={isOpen}
            onClick={onToggle}
            className="flex shrink-0 items-center justify-center"
          >
            <PanelLeft className="size-5 cursor-pointer" />
          </motion.button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.nav
              initial={{ opacity: 0, filter: 'blur(4px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(4px)' }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="relative z-10 mt-4 flex w-full flex-col gap-2 whitespace-nowrap"
              onMouseLeave={() => setHoveredId(null)}
            >
              {items.map((item) => {
                const isSelected = selectedId === item.id
                const isHovered = hoveredId === item.id

                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-current={isSelected}
                    className="relative cursor-pointer text-left"
                    onMouseEnter={() => setHoveredId(item.id)}
                    onClick={() => handleSelect(item)}
                  >
                    <AnimatePresence>
                      {isSelected && (
                        <motion.span
                          className="absolute inset-0 z-0 rounded-md bg-neutral-200 dark:bg-neutral-700"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                        />
                      )}
                    </AnimatePresence>

                    <span
                      className={cn(
                        'relative z-10 block px-5 py-3 tracking-tight',
                        isSelected
                          ? 'font-medium text-neutral-900 dark:text-neutral-100'
                          : 'text-neutral-700 dark:text-neutral-200/50',
                      )}
                    >
                      {item.label}
                    </span>

                    <AnimatePresence>
                      {isHovered && !isSelected && (
                        <motion.span
                          layoutId="macos-sidebar-hover"
                          className="absolute inset-0 z-0 rounded-md bg-neutral-200/50 dark:bg-neutral-900/50"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{
                            type: 'spring',
                            stiffness: 350,
                            damping: 30,
                          }}
                        />
                      )}
                    </AnimatePresence>
                  </button>
                )
              })}
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="z-0 h-full min-h-full w-full flex-1 overflow-y-auto pl-4 lg:pl-8">
        {children}
      </div>
    </div>
  )
}
