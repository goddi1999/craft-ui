import { memo, type MouseEventHandler, type Ref } from 'react'
import { motion } from 'motion/react'

import { LINE_VARIANTS } from './line-nav.constants'

type LineNavLinkProps = {
  ref?: Ref<HTMLAnchorElement>
  title: string
  href: string
  active?: boolean
  isLast?: boolean
  onClick?: MouseEventHandler<HTMLAnchorElement>
}

export const LineNavLink = memo(function LineNavLink({
  ref,
  title,
  href,
  active = false,
  isLast = false,
  onClick,
}: LineNavLinkProps) {
  return (
    <>
      {/* a plain anchor keeps this framework-agnostic; for client-side routing wrap your Link with motion.create */}
      <motion.a
        ref={ref}
        data-slot="line-nav-link"
        aria-current={active ? 'page' : undefined}
        className="group relative flex h-px items-center gap-3 after:absolute after:top-1/2 after:left-0 after:size-full after:-translate-y-1/2 after:p-3.5"
        href={href}
        initial={false}
        animate={active ? 'active' : 'normal'}
        whileHover="hover"
        onClick={onClick}
      >
        <motion.span
          className="block h-px shrink-0 bg-foreground/20 transition-[background-color] ease-out group-hover:bg-foreground group-aria-[current=page]:bg-foreground"
          variants={LINE_VARIANTS}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        />
        <span className="text-sm whitespace-nowrap text-muted-foreground transition-[color] ease-out group-hover:text-foreground group-aria-[current=page]:text-foreground">
          {title}
        </span>
      </motion.a>

      {!isLast && (
        <>
          <span className="block h-px w-(--line-nav-width) bg-foreground/20" />
          <span className="block h-px w-(--line-nav-width) bg-foreground/20" />
        </>
      )}
    </>
  )
})
