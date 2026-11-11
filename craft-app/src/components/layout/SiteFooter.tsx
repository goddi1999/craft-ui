import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { CHANGELOG_LATEST, CHANGELOG_TOTAL, REPO_URL } from '@/features/changelog'
import { cn } from '@/lib/utils'

const LINK =
  'rounded-sm outline-none transition-colors duration-150 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring'

const latest = CHANGELOG_LATEST
  ? new Intl.DateTimeFormat('en', {
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(`${CHANGELOG_LATEST.date}T00:00:00Z`))
  : null

/** One quiet row at the end of every page: copyright, and links to the gallery and the changelog. */
export function SiteFooter({ className }: { className?: string }) {
  return (
    <footer
      data-slot="site-footer"
      className={cn(
        'mx-auto mt-24 flex max-w-6xl flex-col gap-4 border-t pt-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <p>
        © {new Date().getFullYear()} Craft UI · {CHANGELOG_TOTAL} components
      </p>
      <nav aria-label="Footer">
        <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <li>
            <Link to="/" className={LINK}>
              Gallery
            </Link>
          </li>
          <li>
            <Link to="/changelog" className={cn(LINK, 'inline-flex items-center gap-2')}>
              Changelog
              {latest && (
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs tabular-nums">
                  {latest}
                </span>
              )}
            </Link>
          </li>
          <li>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(LINK, 'inline-flex items-center gap-1')}
            >
              GitHub
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
          </li>
        </ul>
      </nav>
    </footer>
  )
}
