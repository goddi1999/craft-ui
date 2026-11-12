import type { SIZES, STATUS } from './rolling-avatar-group.constants'

export type RollingAvatarGroupSize = keyof typeof SIZES

export type RollingAvatarGroupStatus = keyof typeof STATUS

export type RollingAvatarGroupMember = {
  /** Shown in the name tip and read out. Names double as keys, so keep them unique. */
  name: string
  /** Square image URL. Initials show without one, or when it fails to load. */
  src?: string
  /** Adds a presence dot. */
  status?: RollingAvatarGroupStatus
}

/**
 * An overlapping stack of avatars with a +N overflow chip. A person joining or leaving opens or
 * closes their slot so the stack slides, and the count rolls the way it moved. Hovering a person
 * rings them and shows their name without moving anything.
 */
export type RollingAvatarGroupProps = {
  /** Everyone, in display order. Pass the full list and let `max` truncate it. */
  members: RollingAvatarGroupMember[]
  /** Avatars shown before the rest collapse into the overflow count. @default 4 */
  max?: number
  /** Size of each avatar and the overflow chip. @default 'md' */
  size?: RollingAvatarGroupSize
  /** Accessible name of the group, also used in the overflow label. @default 'Team members' */
  label?: string
  className?: string
}
