import { motion, useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'

import { FOCUS_RING, SURFACE, TAP_SCALE } from './profile-card.constants'
import type { ProfileCardProps } from './profile-card.types'
import { websiteLink, xProfileHref } from './profile-card.utils'
import { CoverArtwork, LinkIcon, ProfileMark, VerifiedIcon, XLogo } from './profile-card-parts'

/**
 * A dark social profile card. Painted cover art holds the X link and the follow button; the
 * panel below holds the avatar, name, bio, stats and website. The only motion is a spring tap on
 * the button and a small lift on the avatar.
 */
export function ProfileCard({
  name = 'Suraj',
  username = '@surajmaurya_m',
  description = 'Building EasyUI. Engineer.',
  followers = '200K',
  posts = '72',
  website = 'easyui.site',
  avatar,
  xHref,
  verified = true,
  actionLabel = 'Follow',
  onAction,
  className,
  ...props
}: ProfileCardProps) {
  const reduced = useReducedMotion() ?? false
  const xLink = xHref ?? xProfileHref(username)
  const site = website.trim() ? websiteLink(website) : null

  return (
    <article
      data-slot="profile-card"
      className={cn(
        'relative mx-auto w-full max-w-[586px] overflow-hidden rounded-[40px] max-sm:rounded-[30px]',
        SURFACE,
        className,
      )}
      {...props}
    >
      <div className="relative h-[260px] w-full max-sm:h-[180px]">
        <CoverArtwork />

        <div className="absolute right-6 bottom-5 flex items-center gap-2.5 max-sm:right-4 max-sm:bottom-3.5 max-sm:gap-[5px]">
          {xLink && (
            <a
              href={xLink}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Open X (Twitter) profile in a new tab"
              className={cn(
                'flex size-9 items-center justify-center rounded-full text-[#A5ACBD] transition-colors duration-150 ease-out hover:text-white focus-visible:ring-white/40 max-sm:size-8',
                FOCUS_RING,
              )}
            >
              <XLogo />
            </a>
          )}

          <motion.button
            type="button"
            onClick={onAction}
            // the press is skipped entirely for reduced motion
            whileTap={reduced ? undefined : { scale: TAP_SCALE }}
            className="h-9 min-w-28 rounded-full bg-[#E4E9F9] px-5 text-[15px] font-semibold tracking-[-0.02em] text-[#141414] outline-none transition-[scale,filter] duration-150 ease-out hover:scale-[1.025] hover:brightness-[1.02] focus-visible:ring-4 focus-visible:ring-white/30 motion-reduce:hover:scale-100 max-sm:h-8 max-sm:min-w-22 max-sm:px-4 max-sm:text-[13px]"
          >
            {actionLabel}
          </motion.button>
        </div>
      </div>

      <div className="relative min-h-70 bg-[#030303] px-[41px] pt-[78px] pb-7 max-sm:min-h-65 max-sm:px-[27px] max-sm:pt-16 max-sm:pb-6">
        {/* pinned to the cover seam, whatever the panel padding */}
        <div className="absolute -top-[58px] left-[38px] flex size-[110px] items-center justify-center overflow-hidden rounded-[28px] border-[5px] border-black bg-[#DCE5FF] text-[#141414] transition-transform duration-200 ease-out hover:-translate-y-[3px] motion-reduce:hover:translate-y-0 max-sm:-top-[46px] max-sm:left-[25px] max-sm:size-[92px] max-sm:rounded-[23px] [&>img]:size-full [&>img]:object-cover">
          {avatar ?? <ProfileMark />}
        </div>

        {/* inline so the tick never drops to its own line */}
        <div className="flex items-center gap-[9px]">
          <h2 className="m-0 min-w-0 text-[30px] leading-none font-normal tracking-[-0.045em] break-words text-white max-sm:text-[24px]">
            {name}
          </h2>
          {verified && <VerifiedIcon />}
        </div>

        <p className="mt-[7px] text-base leading-none tracking-[-0.02em] text-[#747474] max-sm:text-[13px]">
          {username}
        </p>

        <p className="mt-[18px] max-w-[500px] text-[15px] leading-[1.25] tracking-[-0.025em] text-[#8B8B8B] max-sm:text-[13px]">
          {description}
        </p>

        <div className="mt-[18px] flex flex-wrap items-center gap-x-[22px] gap-y-2 text-[15px] leading-none tracking-[-0.025em] max-sm:text-[13px]">
          <span>
            <strong className="font-medium text-white">{followers}</strong>{' '}
            <span className="text-[#6F6F6F]">Followers</span>
          </span>
          <span>
            <strong className="font-medium text-white">{posts}</strong>{' '}
            <span className="text-[#6F6F6F]">Posts</span>
          </span>
        </div>

        {site && (
          <a
            href={site.href}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`Visit ${site.label} (opens in a new tab)`}
            className={cn(
              'mt-[18px] flex w-fit items-center gap-[7px] rounded-sm text-[15px] font-medium tracking-[-0.02em] text-[#6285D5] transition-opacity duration-150 ease-out hover:opacity-75 focus-visible:ring-[#6285D5] max-sm:text-[13px]',
              FOCUS_RING,
            )}
          >
            <LinkIcon />
            {site.label}
          </a>
        )}
      </div>
    </article>
  )
}
