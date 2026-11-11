import type { ComponentProps } from 'react'

export type PullQuoteProps = Omit<ComponentProps<'figure'>, 'children'> & {
  /** Full display name of the person giving the testimonial. */
  authorName: string
  /** Short tagline, title, or description of the person. */
  authorTagline: string
  /** Link to the person's profile, website, or social media page. */
  url: string
  /** The testimonial text. */
  quote: string
}
