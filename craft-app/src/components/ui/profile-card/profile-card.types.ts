import type { ComponentProps, ReactNode } from 'react'

/**
 * A dark social profile card: painted blue cover art with an X link and a follow button on top,
 * and an avatar, verified name, handle, bio, follower stats and a website link below.
 */
export type ProfileCardProps = Omit<ComponentProps<'article'>, 'children'> & {
  /** Display name, the card's heading. @default 'Suraj' */
  name?: string
  /** Handle shown under the name. @default '@surajmaurya_m' */
  username?: string
  /** Bio under the handle. @default 'Building EasyUI. Engineer.' */
  description?: string
  /** Pre-formatted follower count, such as "24.3K". @default '200K' */
  followers?: string
  /** Pre-formatted post count. @default '72' */
  posts?: string
  /** Domain or URL; `https://` is added when missing. Empty hides it. @default 'easyui.site' */
  website?: string
  /** What fills the avatar tile, such as an `<img>`. Without it the tile shows a geometric mark. */
  avatar?: ReactNode
  /** Where the X button goes. Empty hides it. @default the username's profile on x.com */
  xHref?: string
  /** Show the verified badge after the name. @default true */
  verified?: boolean
  /** Text of the main button. @default 'Follow' */
  actionLabel?: string
  /** Called when the main button is pressed. */
  onAction?: () => void
}
