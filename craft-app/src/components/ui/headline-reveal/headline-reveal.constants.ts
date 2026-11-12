// uiarc motion tokens, inlined so the folder copies on its own
export const STAGGER_WORD = 0.04
// the whole stagger stays under this many seconds, however long the text is
export const MAX_STAGGER = 0.48
// headings blur harder than a paragraph
export const BLUR_TEXT = 8
export const BLUR_SOFT = 4

// react hoists this once into the head and dedupes it by href, so no global stylesheet is needed
export const KEYFRAMES_HREF = 'headline-reveal-keyframes'
export const KEYFRAMES = [
  '@keyframes headline-reveal-rise { from { transform: translateY(.62em) } }',
  '@keyframes headline-reveal-fade { from { opacity: 0 } }',
  '@keyframes headline-reveal-focus { from { filter: blur(var(--reveal-blur, 4px)) } }',
].join('\n')

// the clip hides the rise behind a feathered bottom edge, so a blurred word surfaces softly;
// padding with matching negative margins leaves room for descenders and the blur
export const CLIP =
  'inline-block -mx-[.16em] -mt-[.1em] -mb-[.24em] px-[.16em] pt-[.1em] pb-[.24em] align-top [mask-image:linear-gradient(#000_calc(100%_-_.18em),transparent)] motion-reduce:[mask-image:none]'

// three tracks: the rise settles longest, the fade finishes first and the blur clears between them;
// backwards fill lets go at the end, so resting words keep no transform or filter layer
export const WORD =
  'inline-block animate-[headline-reveal-rise_.76s_cubic-bezier(.16,1,.3,1)_var(--reveal-delay,0s)_backwards,headline-reveal-fade_.44s_cubic-bezier(.22,1,.36,1)_var(--reveal-delay,0s)_backwards,headline-reveal-focus_.58s_cubic-bezier(.16,1,.3,1)_var(--reveal-delay,0s)_backwards] motion-reduce:animate-[headline-reveal-fade_160ms_cubic-bezier(.22,1,.36,1)_backwards]'
