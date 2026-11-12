import { X_PROFILE } from './profile-card.constants'

const PROTOCOL = /^https?:\/\//i

/** A link for a bare domain or a full URL, and the domain to show for it. */
export function websiteLink(website: string) {
  const trimmed = website.trim()
  return {
    href: PROTOCOL.test(trimmed) ? trimmed : `https://${trimmed}`,
    label: trimmed.replace(PROTOCOL, '').replace(/\/$/, ''),
  }
}

/** The x.com profile for a handle such as `@name`, or nothing for an empty one. */
export function xProfileHref(username: string) {
  const handle = username.trim().replace(/^@/, '')
  return handle ? `${X_PROFILE}${encodeURIComponent(handle)}` : undefined
}
