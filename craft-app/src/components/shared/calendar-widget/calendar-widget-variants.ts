import { cva } from 'class-variance-authority'

export const calendarWidgetVariants = cva(
  'flex flex-col rounded-[30px] border border-black/10 bg-[#F6F5FA] shadow-lg transition-colors duration-500 select-none dark:border-white/5 dark:bg-zinc-900',
  {
    variants: {
      size: {
        sm: 'w-[280px]',
        default: 'w-[340px]',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)

export const calendarWidgetAgendaVariants = cva(
  'relative flex flex-col overflow-hidden rounded-[28px] border border-black/10 bg-white px-4 pt-2 transition-colors duration-500 dark:border-white/10 dark:bg-zinc-950',
  {
    variants: {
      size: {
        sm: 'h-40',
        default: 'h-52',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)
