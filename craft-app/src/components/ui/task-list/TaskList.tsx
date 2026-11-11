import { motion } from 'motion/react'
import { useState } from 'react'

import { cn } from '@/lib/utils'

import { REORDER, SIZES } from './task-list.constants'
import { TaskItem } from './TaskItem'
import { useTiming } from './task-list-hooks'
import type { Task, TaskListProps } from './task-list.types'

/**
 * A checklist that strikes out completed tasks and, once a row has finished
 * its tick animation, springs it down to the bottom of the list.
 */
export function TaskList({
  tasks,
  defaultTasks = [],
  size = 'md',
  accent,
  onTasksChange,
  className,
  ...props
}: TaskListProps) {
  const timing = useTiming()
  const [own, setOwn] = useState(defaultTasks)
  const current = tasks ?? own

  const [parked, setParked] = useState<string[]>(() =>
    (tasks ?? defaultTasks).filter((task) => task.done).map((task) => task.id),
  )
  const [announcement, setAnnouncement] = useState('')

  const handleToggle = (task: Task, done: boolean) => {
    const next = current.map((item) => (item.id === task.id ? { ...item, done } : item))
    if (tasks === undefined) setOwn(next)
    onTasksChange?.(next)
    setAnnouncement(`${task.label} ${done ? 'completed' : 'reopened'}`)
  }

  // a parked row that is no longer done, or gone, was changed from outside
  const finished = parked
    .map((id) => current.find((task) => task.id === id))
    .filter((task): task is Task => task?.done === true)
  const open = current.filter((task) => !finished.includes(task))

  return (
    <ul
      data-slot="task-list"
      className={cn('flex w-fit max-w-full flex-col items-start', SIZES[size].list, className)}
      {...props}
    >
      {[...open, ...finished].map((task) => (
        <motion.li key={task.id} layout transition={timing(REORDER)} className="max-w-full">
          <TaskItem
            label={task.label}
            checked={!!task.done}
            size={size}
            accent={accent}
            onCheckedChange={(done) => handleToggle(task, done)}
            onSettled={() =>
              setParked((ids) => (ids.includes(task.id) ? ids : [...ids, task.id]))
            }
            onReverted={() => setParked((ids) => ids.filter((id) => id !== task.id))}
          />
        </motion.li>
      ))}
      <li role="status" aria-live="polite" className="sr-only">
        {announcement}
      </li>
    </ul>
  )
}
