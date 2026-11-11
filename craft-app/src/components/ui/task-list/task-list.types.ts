import type { ComponentProps } from 'react'

import type { SIZES } from './task-list.constants'

export type TaskSize = keyof typeof SIZES

export type Task = {
  id: string
  label: string
  done?: boolean
}

export type TaskItemProps = Omit<
  ComponentProps<'button'>,
  'onAnimationStart' | 'onDrag' | 'onDragStart' | 'onDragEnd'
> & {
  label: string
  checked?: boolean
  /** @default false */
  defaultChecked?: boolean
  /** @default 'md' */
  size?: TaskSize
  /** Any CSS colour for the filled circle and the focus ring. @default '#FF5F2E' */
  accent?: string
  onCheckedChange?: (checked: boolean) => void
  /** Fires once a row has finished ticking: tick, strike, nudge. */
  onSettled?: () => void
  /** Fires once a row has finished unticking. */
  onReverted?: () => void
}

export type TaskListProps = ComponentProps<'ul'> & {
  /** Controlled rows. */
  tasks?: Task[]
  /** @default [] */
  defaultTasks?: Task[]
  /** @default 'md' */
  size?: TaskSize
  /** Any CSS colour for the filled circle and the focus ring. @default '#FF5F2E' */
  accent?: string
  onTasksChange?: (tasks: Task[]) => void
}
