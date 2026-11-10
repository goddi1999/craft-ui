import {
  AccordionPage,
  AgentComputerIconPage,
  AnimatedBeamPage,
  AnimatedCounterPage,
  AnimatedHoverDisclosuresPage,
  BarrelTimeInputPage,
  BounceSidebarPage,
  BrushChartPage,
  CalendarWidgetPage,
  CanvasPointerLinesPage,
  CanvasSnowBannerPage,
  CardSwipePage,
  Carousel3DPage,
  CarouselSliderPage,
  CodeBlockPage,
  CometDialPage,
  CookingLettersPage,
  CountdownPage,
  CssCarouselsPage,
  CssSpriteScrubbingPage,
  CuisineSelectorPage,
  CurvedScrollbarPage,
  DestinationSliderPage,
  DonutChartPage,
  EmojiSpreeChipsPage,
  ExpandableCardPage,
  ExpandableTextPage,
  FauxPipVideoPage,
  FlickeringGridPage,
  FloatingSquares3DPage,
  FolderFloatPage,
  FundWidgetPage,
  FuseButtonPage,
  GaugePage,
  GithubCalendarPage,
  GooeyPopoverPage,
  GradualBlurPage,
  GsapInfiniteLoopPage,
  HeartPage,
  HyperspeedPage,
  InfiniteCoverFlowPage,
  InputDissolutionPage,
  IntelligentTextRevealsPage,
  LaserFlowPage,
  LilLoaderPage,
  LineChartPage,
  LinePathAnimationPage,
  LineSidebarPage,
  LiquidSliderPage,
  MacOSSidebarPage,
  MetricCardPage,
  MorphingDisclosurePage,
  MultiplayerMaskPage,
  NumberAnimationPage,
  OptionWheelPage,
  PinItemPage,
  PixelTransitionPage,
  ProductSpotlightPage,
  ProgressiveBlurPage,
  ProgressPage,
  ProximitySidebarPage,
  PulseHeartPage,
  QuantityPickerPage,
  RefineFramePage,
  RidgelinePage,
  ScrollDrivenGooeyIslandPage,
  ScrollDrivenIndexPage,
  ScrollDrivenLensPage,
  ScrollDrivenVideoMaskingPage,
  ScrollImageComparisonPage,
  ScrollProgressPage,
  ScrollToTypePage,
  ShimmerAccordionPage,
  SignaturePadPage,
  SlopeChartPage,
  SparkleButtonPage,
  SparklinePage,
  StickyProgressiveBlurPage,
  StrandsPage,
  StreamgraphPage,
  StyleableSelectPage,
  SvgFilterScrollerPage,
  SwitchModePage,
  TaskActivityTimelinePage,
  TaskEditingHeatmapPage,
  TaskSubmissionScatterPage,
  TextRevealPage,
  TheCraftOfUiPlaybookCssScrollAnimationWSubgridPage,
  ThemeSwitch3DPage,
  TreemapPage,
  TreeMenuPage,
  VoiceNotePage,
  VoicePillPage,
  WaffleChartPage,
  WqDashboardPage,
  YearInDotsPage,
  YouCanScrollPage,
  YoutubeEmbedPage,
} from '@/components/shared'
import { TreeSearchPage } from '@/pages/TreeSearchPage'

import type { GalleryExample } from './gallery.types'

/** Every live example: one entry here adds its route and its gallery card. */
export const GALLERY_EXAMPLES: GalleryExample[] = [
  {
    slug: 'scroll-driven-index',
    title: 'Scroll-Driven Index',
    description:
      'Fixed bottom index popover with scroll-driven progress and in-page section anchors.',
    tech: 'CSS · Popover',
    categories: ['scroll', 'navigation'],
    page: ScrollDrivenIndexPage,
  },
  {
    slug: 'faux-pip-video',
    title: 'Faux PiP Video',
    description:
      'Sticky video morphs into a picture-in-picture control using CSS container scroll-state.',
    tech: 'CSS · Scroll-state',
    categories: ['scroll', 'media'],
    page: FauxPipVideoPage,
  },
  {
    slug: 'the-craft-of-ui-playbook-css-scroll-animation-w-subgrid',
    title: 'Playbook Scroll Animation',
    description:
      'A layered scroll demo that uses subgrid and scroll-linked animation to build a cinematic composition.',
    tech: 'CSS · Subgrid',
    categories: ['scroll', 'layout'],
    page: TheCraftOfUiPlaybookCssScrollAnimationWSubgridPage,
  },
  {
    slug: 'you-can-select-things-styleable-select',
    title: 'Styleable Select',
    description:
      'A stylable select demo inspired by the base-select interaction pattern.',
    tech: 'CSS · Select',
    categories: ['inputs'],
    page: StyleableSelectPage,
  },
  {
    slug: 'you-can-scroll',
    title: 'You Can Scroll',
    description:
      'A sticky phrase and chroma-scroll list driven by CSS view timelines and scroll-linked animation.',
    tech: 'CSS · View Timeline',
    categories: ['scroll'],
    page: YouCanScrollPage,
  },
  {
    slug: 'line-path-animation',
    title: 'Line Path Animation',
    description:
      'A scroll-driven SVG path fill animation with sticky headline and progressive section reveals.',
    tech: 'CSS · SVG',
    categories: ['animation'],
    page: LinePathAnimationPage,
  },
  {
    slug: 'curved-scrollbar',
    title: 'Curved Scrollbar',
    description:
      'A reusable scroll panel with an SVG thumb that bends around rounded content corners.',
    tech: 'CSS · Scrollbar',
    categories: ['scroll'],
    page: CurvedScrollbarPage,
  },
  {
    slug: 'agent-computer-icon',
    title: 'Agent Computer Icon',
    description:
      'A 24px monitor face with GSAP-driven states — loading, success, failure, waiting — animated through eyes, screen, and base.',
    tech: 'GSAP · SVG',
    categories: ['animation'],
    page: AgentComputerIconPage,
  },
  {
    slug: 'heart',
    title: 'Heart',
    description:
      'Like hearts with typed color variants: a CSS beat primitive, plus a GSAP center-fill with particle burst and swatches.',
    tech: 'GSAP · Like',
    categories: ['animation', 'inputs'],
    page: HeartPage,
  },
  {
    slug: 'pulse-heart',
    title: 'Pulse Heart',
    description:
      'A like pill that swells through a bezier overshoot on toggle, its count rolling like an odometer digit.',
    tech: 'React · Like',
    categories: ['animation', 'inputs'],
    page: PulseHeartPage,
  },
  {
    slug: 'sparkle-button',
    title: 'Sparkle Button',
    description:
      'A hover-activated pill button with conic spark, orbiting particles, and gradient label text.',
    tech: 'CSS · Button',
    categories: ['inputs', 'animation'],
    page: SparkleButtonPage,
  },
  {
    slug: 'fuse-button',
    title: 'Fuse Button',
    description:
      'A commit button that arms a burning fuse instead of a confirm dialog — tap again, or wait it out, before it locks in.',
    tech: 'React · Button',
    categories: ['inputs', 'animation'],
    page: FuseButtonPage,
  },
  {
    slug: 'multiplayer-masking-with-grid-mask',
    title: 'Multiplayer Masking',
    description:
      'An overlapping presence stack where narrow grid columns and radial-gradient masks let each avatar lift cleanly out of its neighbour.',
    tech: 'CSS · Mask',
    categories: ['effects'],
    page: MultiplayerMaskPage,
  },
  {
    slug: 'product-spotlight-cards',
    title: 'Product Spotlight Cards',
    description:
      'A depth map relights a flat product photo in real time — normals, contact shadows and a tracked spotlight, all sharing one WebGL context.',
    tech: 'WebGL · Depth',
    categories: ['layout', 'effects'],
    page: ProductSpotlightPage,
  },
  {
    slug: 'pure-css-3d-animated-carousel',
    title: 'Pure CSS 3D Carousel',
    description:
      'Cards stacked in one grid cell, rotated around the Y axis and pushed back along Z to form a ring that spins with no JavaScript.',
    tech: 'CSS · 3D',
    categories: ['layout', 'animation'],
    page: Carousel3DPage,
  },
  {
    slug: 'scroll-driven-progressive-blur-w-contrast',
    title: 'Progressive Blur',
    description:
      'Stacked backdrop-filter layers with staggered masks composited using intersect, sliding in on the scroller’s own timeline.',
    tech: 'CSS · Backdrop',
    categories: ['scroll', 'effects'],
    page: ProgressiveBlurPage,
  },
  {
    slug: 'css-number-animation',
    title: 'CSS Number Animation',
    description:
      'A registered integer custom property feeds a CSS counter, making the number itself interpolable without a JavaScript tick.',
    tech: 'CSS · Counter',
    categories: ['data', 'animation'],
    page: NumberAnimationPage,
  },
  {
    slug: 'css-responsive-scroll-driven-text-reveals',
    title: 'Scroll-Driven Text Reveals',
    description:
      'Three text-clipped gradients swept by a view timeline, so the fill re-flows at any size without measuring anything.',
    tech: 'CSS · View Timeline',
    categories: ['scroll', 'animation'],
    page: TextRevealPage,
  },
  {
    slug: 'css-scroll-to-type',
    title: 'Scroll to Type',
    description:
      'A stepped view-timeline animation turns scroll distance into a character index, typing a line out with a blinking caret.',
    tech: 'CSS · Typing',
    categories: ['scroll', 'animation'],
    page: ScrollToTypePage,
  },
  {
    slug: 'carousel-slider',
    title: 'Carousel Slider',
    description:
      'A draggable card stack with spring transitions and directional enter/exit variants.',
    tech: 'Motion · Drag',
    categories: ['layout'],
    page: CarouselSliderPage,
  },
  {
    slug: 'option-wheel',
    title: 'Option Wheel',
    description:
      'A curved, draggable picker that bends its options along an arc and blurs them as they fall from the centre.',
    tech: 'React · Picker',
    categories: ['inputs'],
    page: OptionWheelPage,
  },
  {
    slug: 'year-in-dots',
    title: 'Year in Dots',
    description:
      'One dot per day of the year, filled in proportion to that year’s share of activity.',
    tech: 'React · Dataviz',
    categories: ['data'],
    page: YearInDotsPage,
  },
  {
    slug: 'youtube-embed',
    title: 'YouTube Embed',
    description:
      'A YouTube iframe wrapper that builds its own player URL and can mask the chrome so the video reads as background art.',
    tech: 'React · Media',
    categories: ['media'],
    page: YoutubeEmbedPage,
  },
  {
    slug: 'animated-beam',
    title: 'Animated Beam',
    description:
      'An SVG path measured between two element refs with a gradient travelling along it, re-measuring on resize.',
    tech: 'SVG · Motion',
    categories: ['animation'],
    page: AnimatedBeamPage,
  },
  {
    slug: 'bounce-sidebar',
    title: 'Bounce Sidebar',
    description:
      'A nav marker that squashes and stretches as it travels between items, easing along an arc rather than a straight line.',
    tech: 'Motion · Nav',
    categories: ['navigation'],
    page: BounceSidebarPage,
  },
  {
    slug: 'code-block',
    title: 'Code Block',
    description:
      'Prism highlighting with an entire theme derived from a single accent colour, plus an animated copy button.',
    tech: 'React · Syntax',
    categories: ['data'],
    page: CodeBlockPage,
  },
  {
    slug: 'flickering-grid',
    title: 'Flickering Grid',
    description:
      'A canvas grid of squares randomly changing opacity, throttled to a target frame rate and paused when hidden.',
    tech: 'Canvas · Ambient',
    categories: ['effects'],
    page: FlickeringGridPage,
  },
  {
    slug: 'hyperspeed',
    title: 'Hyperspeed',
    description:
      'A Three.js road tunnel with distortable geometry, streaking traffic lights, and bloom, steered by a plain options object.',
    tech: 'WebGL · Three.js',
    categories: ['effects'],
    page: HyperspeedPage,
  },
  {
    slug: 'github-calendar',
    title: 'GitHub Activity Card',
    description:
      'A contribution heatmap from the public contributions API, with month labels and recently pushed repos.',
    tech: 'React · Dataviz',
    categories: ['data', 'charts'],
    page: GithubCalendarPage,
  },
  {
    slug: 'proximity-sidebar',
    title: 'Proximity Sidebar',
    description:
      'A table-of-contents rail whose dashes lengthen based on their distance from the cursor.',
    tech: 'Motion · Nav',
    categories: ['navigation'],
    page: ProximitySidebarPage,
  },
  {
    slug: 'scroll-progress',
    title: 'Scroll Progress',
    description:
      'A floating progress pill reporting the active section, spring animating between label widths.',
    tech: 'Motion · Scroll',
    categories: ['scroll', 'navigation'],
    page: ScrollProgressPage,
  },
  {
    slug: 'calendar-widget',
    title: 'Calendar Widget',
    description:
      'A draggable date strip over an agenda pane, with the selection pill travelling between days as a shared layout element.',
    tech: 'Motion · Calendar',
    categories: ['data', 'inputs'],
    page: CalendarWidgetPage,
  },
  {
    slug: 'card-swipe',
    title: 'Card Swipe',
    description:
      'A draggable deck whose cards derive their Y rotation from the track position, swinging away in perspective as the active card squares up.',
    tech: 'Motion · Drag',
    categories: ['layout', 'inputs'],
    page: CardSwipePage,
  },
  {
    slug: 'emoji-spree-chips',
    title: 'Emoji Spree Chips',
    description:
      'Draggable choice chips that throw the picked emoji up over the deck and drop it back down behind them.',
    tech: 'Motion · Chips',
    categories: ['inputs', 'animation'],
    page: EmojiSpreeChipsPage,
  },
  {
    slug: 'fund-widget',
    title: 'Fund Widget',
    description:
      'A vertical balance deck where each card\\u2019s rotation and blur come from the track position, tipping pages as they roll past.',
    tech: 'Motion · 3D',
    categories: ['data', 'layout'],
    page: FundWidgetPage,
  },
  {
    slug: 'macos-sidebar',
    title: 'macOS Sidebar',
    description:
      'A collapsible rail that springs between widths, with the hover highlight sliding between rows as a shared layout element.',
    tech: 'Motion · Nav',
    categories: ['navigation'],
    page: MacOSSidebarPage,
  },
  {
    slug: 'pin-item',
    title: 'Pin Item',
    description:
      'Pinning a place moves its card between two lists, travelling to its new section on a shared layout id instead of cutting.',
    tech: 'Motion · List',
    categories: ['layout', 'inputs'],
    page: PinItemPage,
  },
  {
    slug: 'switch-mode',
    title: 'Switch Mode',
    description:
      'A day/night toggle whose knob moves as a layout animation, so every size variant lands correctly.',
    tech: 'Motion · Theme',
    categories: ['inputs'],
    page: SwitchModePage,
  },
  {
    slug: 'tree-menu',
    title: 'Tree Menu',
    description:
      'A drill-down menu where the picked row becomes the breadcrumb, and the remaining rows part around your choice.',
    tech: 'Motion · Nav',
    categories: ['navigation'],
    page: TreeMenuPage,
  },
  {
    slug: 'tree-search',
    title: 'Tree Search',
    description:
      'A search field that opens into drill-down results with staggered list motion, back crumbs, and arbitrary leaf content.',
    tech: 'Motion · Search',
    categories: ['inputs', 'navigation'],
    page: TreeSearchPage,
  },
  {
    slug: 'voice-note',
    title: 'Voice Note',
    description:
      'A recorder pill that grows out of a mic button, counting the take down on an SVG stroke with a digit-rolling timer.',
    tech: 'Motion · Audio',
    categories: ['media', 'inputs'],
    page: VoiceNotePage,
  },
  {
    slug: 'signature-pad',
    title: 'Signature Pad',
    description:
      'Smooth ink that thins with speed, with undo, replay, and PNG or SVG export.',
    tech: 'Motion · Input',
    categories: ['inputs'],
    page: SignaturePadPage,
  },
  {
    slug: 'accordion',
    title: 'Accordion',
    description:
      'Stacked disclosure rows with a smooth height spring and a rotating chevron.',
    tech: 'Radix · Disclosure',
    categories: ['layout'],
    page: AccordionPage,
  },
  {
    slug: 'expandable-card',
    title: 'Expandable Card',
    description: 'A card that grows in width and height to reveal its details.',
    tech: 'Motion · Layout',
    categories: ['layout'],
    page: ExpandableCardPage,
  },
  {
    slug: 'expandable-text',
    title: 'Expandable Text',
    description:
      'Clamps long copy to a few lines, then reveals the rest in place.',
    tech: 'Motion · Text',
    categories: ['layout'],
    page: ExpandableTextPage,
  },
  {
    slug: 'progress',
    title: 'Progress',
    description:
      'A determinate bar with a label, live value readout, and a finish check.',
    tech: 'Motion · Feedback',
    categories: ['data'],
    page: ProgressPage,
  },
  {
    slug: 'countdown',
    title: 'Countdown',
    description:
      'Rolling digits that count down to a moment in a given time zone.',
    tech: 'Motion · Time',
    categories: ['data'],
    page: CountdownPage,
  },
  {
    slug: 'metric-card',
    title: 'Metric Card',
    description:
      'A KPI tile with an animated figure, context, and period change.',
    tech: 'Motion · Data',
    categories: ['data', 'layout'],
    page: MetricCardPage,
  },
  {
    slug: 'line-chart',
    title: 'Line Chart',
    description:
      'Trends over time with a scrubbing crosshair and a dashed comparison series.',
    tech: 'SVG · Chart',
    categories: ['charts'],
    page: LineChartPage,
  },
  {
    slug: 'treemap',
    title: 'Treemap',
    description:
      'Nested rectangles sized by value and shaded by growth, with click to zoom.',
    tech: 'SVG · Chart',
    categories: ['charts'],
    page: TreemapPage,
  },
  {
    slug: 'donut-chart',
    title: 'Donut Chart',
    description:
      'Ring segments with a live total and a legend that toggles slices.',
    tech: 'SVG · Chart',
    categories: ['charts'],
    page: DonutChartPage,
  },
  {
    slug: 'streamgraph',
    title: 'Streamgraph',
    description:
      'Stacked series flowing around a center line to show volume and share.',
    tech: 'SVG · Chart',
    categories: ['charts'],
    page: StreamgraphPage,
  },
  {
    slug: 'brush-chart',
    title: 'Brush Chart',
    description:
      'A detail chart driven by a draggable range window on an overview strip.',
    tech: 'SVG · Chart',
    categories: ['charts', 'inputs'],
    page: BrushChartPage,
  },
  {
    slug: 'waffle-chart',
    title: 'Waffle Chart',
    description:
      'A 10 by 10 grid where every cell is one percent of the whole.',
    tech: 'SVG · Chart',
    categories: ['charts'],
    page: WaffleChartPage,
  },
  {
    slug: 'slope-chart',
    title: 'Slope Chart',
    description:
      'Before and after values joined by lines to show rises, falls, and rank.',
    tech: 'SVG · Chart',
    categories: ['charts'],
    page: SlopeChartPage,
  },
  {
    slug: 'sparkline',
    title: 'Sparkline',
    description:
      'A compact trend line with a headline value, change, and scrubbing.',
    tech: 'SVG · Chart',
    categories: ['charts', 'data'],
    page: SparklinePage,
  },
  {
    slug: 'gauge',
    title: 'Gauge',
    description: 'A radial meter with named threshold bands that set its tone.',
    tech: 'SVG · Data',
    categories: ['charts', 'data'],
    page: GaugePage,
  },
  {
    slug: 'animated-counter',
    title: 'Animated Counter',
    description:
      'A number that springs to each new value and counts up on view.',
    tech: 'Motion · Data',
    categories: ['data', 'animation'],
    page: AnimatedCounterPage,
  },
  {
    slug: 'ridgeline',
    title: 'Ridgeline',
    description:
      'Overlapping density curves that compare distributions on one axis.',
    tech: 'SVG · Chart',
    categories: ['charts'],
    page: RidgelinePage,
  },
  {
    slug: 'gradual-blur',
    title: 'Gradual Blur',
    description:
      'Stacked backdrop-filter layers that ramp along an edge so content fades into soft focus.',
    tech: 'CSS · Backdrop',
    categories: ['effects'],
    page: GradualBlurPage,
  },
  {
    slug: 'laser-flow',
    title: 'Laser Flow',
    description:
      'A volumetric beam that pours onto a surface, spilling light, fog, and dust.',
    tech: 'WebGL · Shader',
    categories: ['effects'],
    page: LaserFlowPage,
  },
  {
    slug: 'strands',
    title: 'Strands',
    description:
      'Glowing ribbons weaving through a glass lens, with a click pulse.',
    tech: 'WebGL · Shader',
    categories: ['effects'],
    page: StrandsPage,
  },
  {
    slug: 'line-sidebar',
    title: 'Line Sidebar',
    description:
      'Nav items lean toward the pointer with proximity falloff and stretching ticks.',
    tech: 'React · Nav',
    categories: ['navigation'],
    page: LineSidebarPage,
  },
  {
    slug: 'voice-pill',
    title: 'Voice Pill',
    description:
      'Tap or hold to record; the mic grows into a live waveform pill with slide to cancel.',
    tech: 'React · Audio',
    categories: ['media', 'inputs'],
    page: VoicePillPage,
  },
  {
    slug: 'refine-frame',
    title: 'Refine Frame',
    description:
      'Generated media resolves from a coarse mosaic to the final image, with stage chips.',
    tech: 'Canvas · Status',
    categories: ['media', 'data'],
    page: RefineFramePage,
  },
  {
    slug: 'folder-float',
    title: 'Folder Float',
    description:
      'Notes float out of a folder on a soft physics sim; drag them, then pick one.',
    tech: 'Matter.js · Physics',
    categories: ['inputs', 'animation'],
    page: FolderFloatPage,
  },
  {
    slug: 'comet-dial',
    title: 'Comet Dial',
    description:
      'A rotary dial with a comet tail that coasts on momentum and springs into place.',
    tech: 'Motion · Control',
    categories: ['inputs'],
    page: CometDialPage,
  },
  {
    slug: 'scroll-driven-gooey-island',
    title: 'Scroll-Driven Gooey Island',
    description:
      'A sticky Dynamic Island avatar that goo-morphs into the status bar as you scroll.',
    tech: 'CSS · Scroll · SVG filter',
    categories: ['scroll', 'effects'],
    page: ScrollDrivenGooeyIslandPage,
  },
  {
    slug: 'svg-filter-scroller',
    title: 'SVG Filter Scroller',
    description:
      'Scroll velocity feeds an SVG displacement filter for chromatic, wavy type.',
    tech: 'CSS · SVG filter',
    categories: ['scroll', 'effects'],
    page: SvgFilterScrollerPage,
  },
  {
    slug: 'css-sprite-scrubbing',
    title: 'CSS Sprite Scrubbing',
    description:
      'A product frame sequence scrubbed by scroll timeline, with optional autoplay.',
    tech: 'CSS · View timeline',
    categories: ['scroll', 'media'],
    page: CssSpriteScrubbingPage,
  },
  {
    slug: 'gsap-infinite-loop',
    title: 'GSAP Infinite Loops Without DOM Shuffle',
    description:
      'Vertical word carousel that loops forever without cloning or shuffling the DOM.',
    tech: 'GSAP · Timeline',
    categories: ['animation'],
    page: GsapInfiniteLoopPage,
  },
  {
    slug: 'pixel-transition',
    title: 'Pixel Transitions with Generated SVG Masks',
    description:
      'Image crossfade driven by generated SVG pixel-mask sprites.',
    tech: 'SVG · Mask',
    categories: ['effects', 'media'],
    page: PixelTransitionPage,
  },
  {
    slug: 'canvas-snow-banner',
    title: 'Canvas Snow Banner',
    description:
      'A canvas snow fall banner with wind sway, amount, and framerate controls.',
    tech: 'Canvas · GSAP',
    categories: ['effects', 'animation'],
    page: CanvasSnowBannerPage,
  },
  {
    slug: 'canvas-pointer-lines',
    title: 'Configurable Canvas Pointer Lines',
    description:
      'A grid of strokes that lean toward the pointer, with optional spotlight masking.',
    tech: 'Canvas · Pointer',
    categories: ['effects', 'inputs'],
    page: CanvasPointerLinesPage,
  },
  {
    slug: 'cuisine-selector',
    title: 'Cuisine Selector with :has()',
    description:
      'Multi-select cuisine chips styled with CSS :has() for checked and focus states.',
    tech: 'CSS · :has()',
    categories: ['inputs'],
    page: CuisineSelectorPage,
  },
  {
    slug: 'cooking-letters',
    title: 'Cooking Letters',
    description:
      'Every letter is a tiny CSS cube that rolls over in a sine-staggered wave.',
    tech: 'CSS · 3D · Trig',
    categories: ['animation', 'effects'],
    page: CookingLettersPage,
  },
  {
    slug: 'input-dissolution',
    title: 'Input Dissolution',
    description:
      'Submitted text dissolves into grain via a clip-path sweep and an SVG turbulence filter.',
    tech: 'CSS · SVG filter',
    categories: ['inputs', 'effects'],
    page: InputDissolutionPage,
  },
  {
    slug: 'intelligent-text-reveals',
    title: 'Intelligent Text Reveals',
    description:
      'Copy washes in behind a sweeping radial mask, then a signature draws itself in.',
    tech: 'CSS · Mask · @property',
    categories: ['animation', 'effects'],
    page: IntelligentTextRevealsPage,
  },
  {
    slug: 'lil-loader',
    title: 'Lil Loader',
    description:
      'A tiny framed loader of glowing rings that rise, swell, and drift from pink to amber.',
    tech: 'CSS · @property',
    categories: ['animation'],
    page: LilLoaderPage,
  },
  {
    slug: 'task-editing-heatmap',
    title: 'Task Editing Heatmap',
    description:
      'A day-by-hour grid of edits on one assignment, so late-night cramming stands out.',
    tech: 'CSS grid · Heatmap',
    categories: ['charts', 'data'],
    page: TaskEditingHeatmapPage,
  },
  {
    slug: 'task-activity-timeline',
    title: 'Task Activity Timeline',
    description:
      'Group work on one task as a day-by-hour heatmap or per-group 24-hour tracks.',
    tech: 'Radix · Tabs · Timeline',
    categories: ['charts', 'data'],
    page: TaskActivityTimelinePage,
  },
  {
    slug: 'task-submission-scatter',
    title: 'Task Submission Scatter',
    description:
      'When each group handed in against a due-date line: early, on time, late, or missing.',
    tech: 'CSS · Scatter',
    categories: ['charts', 'data'],
    page: TaskSubmissionScatterPage,
  },
  {
    slug: 'wq-dashboard',
    title: 'Role Dashboards',
    description:
      'Admin, teacher, and student LMS dashboards behind a segmented role tab list.',
    tech: 'Radix · Tabs · Dashboard',
    categories: ['data', 'layout'],
    page: WqDashboardPage,
  },
  {
    slug: 'animated-hover-disclosures',
    title: 'Animated Hover Disclosures',
    description:
      'Cards where the hovered or focused column grows via grid-template-columns to reveal copy.',
    tech: 'CSS · Grid',
    categories: ['layout', 'animation'],
    page: AnimatedHoverDisclosuresPage,
  },
  {
    slug: 'morphing-disclosure',
    title: 'Exclusive Morphing Disclosure',
    description:
      'An exclusive <details> group whose open row detaches into a card as it springs open.',
    tech: 'CSS · Details',
    categories: ['navigation', 'animation'],
    page: MorphingDisclosurePage,
  },
  {
    slug: 'shimmer-accordion',
    title: 'Shimmer Accordion',
    description:
      'FAQ accordion that reveals each answer with a coloured gradient band sweeping the text.',
    tech: 'CSS · Gradients',
    categories: ['navigation', 'effects'],
    page: ShimmerAccordionPage,
  },
  {
    slug: 'quantity-picker',
    title: 'Quantity Picker',
    description:
      'Number stepper with rolling digits, an input on focus, and a shake when out of range.',
    tech: 'CSS · Input',
    categories: ['inputs'],
    page: QuantityPickerPage,
  },
  {
    slug: '3d-theme-switch',
    title: 'Switchin\' Themes in 3D',
    description:
      'A theme switch whose surface turns like a cube face via a chained View Transition.',
    tech: 'CSS · View Transitions',
    categories: ['inputs', 'effects'],
    page: ThemeSwitch3DPage,
  },
  {
    slug: 'floating-squares-3d',
    title: 'Floating Squares 3D',
    description:
      'Colourful squares drift across a tilted 3D plane with feathered edges.',
    tech: 'CSS · 3D',
    categories: ['effects', 'animation'],
    page: FloatingSquares3DPage,
  },
  {
    slug: 'gooey-popover',
    title: 'Gooey Popover',
    description:
      'A native [popover] that oozes out of its round trigger through an SVG goo filter.',
    tech: 'CSS · Popover · SVG filter',
    categories: ['effects', 'navigation'],
    page: GooeyPopoverPage,
  },
  {
    slug: 'barrel-time-input',
    title: 'iOS Alarm Barrel Time Input',
    description:
      'iOS-style 3D barrel time picker you can drag, scroll, tap, or drive from the keyboard.',
    tech: 'GSAP · CSS 3D',
    categories: ['inputs'],
    page: BarrelTimeInputPage,
  },
  {
    slug: 'css-carousels',
    title: 'c(ss)arousel',
    description:
      'Radio-driven carousels where CSS handles fade, slide, thumbnail, and scale transitions.',
    tech: 'CSS · Radio inputs',
    categories: ['media', 'navigation'],
    page: CssCarouselsPage,
  },
  {
    slug: 'liquid-slider',
    title: 'Liquid Glass Slider',
    description:
      'A native range input whose thumb swells into a gooey glass lens on press.',
    tech: 'CSS · SVG filter',
    categories: ['inputs', 'effects'],
    page: LiquidSliderPage,
  },
  {
    slug: 'destination-slider',
    title: 'Destination Slider',
    description:
      'An SVG-skinned range input: the track bumps under the marker and a balloon pops up.',
    tech: 'GSAP · SVG',
    categories: ['inputs', 'animation'],
    page: DestinationSliderPage,
  },
  {
    slug: 'infinite-cover-flow',
    title: 'Infinite Cover Flow',
    description:
      'An endless 3D cover carousel you can scroll, drag, click, or drive with arrow keys — with a crisp or blurred floor mirror.',
    tech: 'GSAP · 3D',
    categories: ['media', 'navigation'],
    page: InfiniteCoverFlowPage,
  },
  {
    slug: 'scroll-driven-lens',
    title: 'Scroll-Driven Lens',
    description:
      'Swipeable lens gallery where the centred frame scales up, brightens, and flashes its caption.',
    tech: 'CSS · View timeline',
    categories: ['scroll', 'media'],
    page: ScrollDrivenLensPage,
  },
  {
    slug: 'scroll-driven-video-masking',
    title: 'Scroll-Driven Video Masking',
    description:
      'A sticky video shows through scribbles and text that scrolling draws over it.',
    tech: 'CSS · View timeline · Blend',
    categories: ['scroll', 'media'],
    page: ScrollDrivenVideoMaskingPage,
  },
  {
    slug: 'sticky-progressive-blur',
    title: 'Sticky Progressive Blur',
    description:
      'Stacked backdrop-filter layers pinned to the bottom blur images more as they scroll past.',
    tech: 'CSS · Backdrop · Sticky',
    categories: ['scroll', 'effects'],
    page: StickyProgressiveBlurPage,
  },
  {
    slug: 'scroll-image-comparison',
    title: 'Scroll Image Comparison',
    description:
      'Before/after slider driven by a view timeline on the range thumb, with a 3D layer view.',
    tech: 'CSS · View timeline',
    categories: ['inputs', 'media'],
    page: ScrollImageComparisonPage,
  },
]
