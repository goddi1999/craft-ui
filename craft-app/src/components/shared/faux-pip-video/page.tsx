import { FauxPipVideo } from './FauxPipVideo'

const DEMO_VIDEO_SRC = 'https://www.youtube.com/embed/Kpw8ZUpFtjA'

export function FauxPipVideoPage() {
  return (
    <FauxPipVideo
      src={DEMO_VIDEO_SRC}
      title="YouTube video player"
      size="default"
      navHeight={0}
    >
      <header className="pt-12">
        <h1 className="text-2xl font-medium tracking-tight text-foreground">
          Container scroll-state faux PiP
        </h1>
        <p className="mt-4 text-balance text-lg text-muted-foreground">
          Master the tools, mindset, and techniques behind crafting exceptional
          user interfaces with HTML, CSS, and JavaScript.
        </p>
      </header>

      <hr className="my-8 border-border" />

      <ArticleBody />
    </FauxPipVideo>
  )
}

function ArticleBody() {
  return (
    <>
      <p className="mb-8 text-muted-foreground">
        What if you could build anything you see? Not just copy a design, but
        really understand it — break it down, know which tools to reach for, and
        ship with precision, performance, and accessibility in mind.
      </p>
      <p className="mb-8 text-muted-foreground">
        Building user interfaces is complex. Even a simple sign-up form means
        decisions about motion, accessibility, and performance — plus the UX
        details most people never notice.
      </p>
      <p className="mb-8 text-muted-foreground">
        <strong className="text-foreground">The Craft of UI</strong> is about
        learning how to build things well: see like a developer who understands
        design, and code like a developer who cares about users.
      </p>
      <p className="mb-4 text-foreground">You&apos;ll learn to:</p>
      <ul className="mb-8 list-inside list-disc space-y-2 text-muted-foreground">
        <li>Think through UI problems, not just code them</li>
        <li>Use the web platform fully before adding dependencies</li>
        <li>Know when (and why) to reach for libraries or frameworks</li>
        <li>Build fast, accessible, resilient UIs that feel effortless</li>
      </ul>
      <p className="mb-8 text-muted-foreground">
        Scroll past the video — when the sticky holder leaves its anchor, the
        player morphs into a picture-in-picture style control using CSS container
        scroll-state (with an IntersectionObserver fallback).
      </p>
      <p className="mb-8 text-muted-foreground">
        Keep scrolling — the sticky holder should release and the iframe animates
        into the bottom-right corner, similar to picture-in-picture.
      </p>
      <p className="mb-8 text-muted-foreground">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris.
      </p>
      <p className="mb-8 text-muted-foreground">
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
      <p className="text-muted-foreground">
        Live example — css-container-scroll-state-faux-pip-video
      </p>
      <p className="mb-8 text-muted-foreground">
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
      <p className="text-muted-foreground">
        Live example — css-container-scroll-state-faux-pip-video
      </p>
      <p className="mb-8 text-muted-foreground">
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
      <p className="text-muted-foreground">
        Live example — css-container-scroll-state-faux-pip-video
      </p>
      <p className="mb-8 text-muted-foreground">
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
      <p className="text-muted-foreground">
        Live example — css-container-scroll-state-faux-pip-video
      </p>
      <p className="mb-8 text-muted-foreground">
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
      <p className="text-muted-foreground">
        Live example — css-container-scroll-state-faux-pip-video
      </p>
      <p className="mb-8 text-muted-foreground">
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
      <p className="text-muted-foreground">
        Live example — css-container-scroll-state-faux-pip-video
      </p>
      <p className="mb-8 text-muted-foreground">
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
      <p className="text-muted-foreground">
        Live example — css-container-scroll-state-faux-pip-video
      </p>
      <p className="mb-8 text-muted-foreground">
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
      <p className="text-muted-foreground">
        Live example — css-container-scroll-state-faux-pip-video
      </p>
      <p className="mb-8 text-muted-foreground">
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
      <p className="text-muted-foreground">
        Live example — css-container-scroll-state-faux-pip-video
      </p>
    </>
  )
}
