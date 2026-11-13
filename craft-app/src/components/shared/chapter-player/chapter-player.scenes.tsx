import { Code2, Compass, Layers, MessageCircle, Rocket, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'


// a made-up brand film for the demo; every scene mounts fresh, so each entrance replays
const RISE = { duration: 0.7, ease: [0.23, 1, 0.32, 1] } as const

function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={className}>
      <circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M10 22 22 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

function Wordmark() {
  return (
    <span className="flex items-center gap-2 text-4xl font-semibold tracking-tight text-white sm:text-6xl">
      <Mark className="size-9 sm:size-14" />
      lumen
    </span>
  )
}

export function Reveal() {
  return (
    <div className="relative grid size-full place-items-center overflow-hidden bg-[#1a1033]">
      <motion.div
        aria-hidden
        className="absolute -inset-1/4"
        style={{
          background:
            'radial-gradient(40% 50% at 25% 30%, #ff7ab6 0%, transparent 70%), radial-gradient(45% 55% at 75% 60%, #5b7cff 0%, transparent 70%), radial-gradient(35% 40% at 55% 20%, #ffb36b 0%, transparent 70%)',
        }}
        initial={{ transform: 'rotate(0deg) scale(1.1)' }}
        animate={{ transform: 'rotate(25deg) scale(1)' }}
        transition={{ duration: 6, ease: 'linear' }}
      />
      <motion.div
        className="relative"
        initial={{ opacity: 0, transform: 'translateY(12px) scale(0.96)', filter: 'blur(8px)' }}
        animate={{ opacity: 1, transform: 'translateY(0px) scale(1)', filter: 'blur(0px)' }}
        transition={{ ...RISE, delay: 0.3 }}
      >
        <Wordmark />
      </motion.div>
    </div>
  )
}

export function Concept() {
  return (
    <div className="grid size-full place-items-center bg-black">
      <motion.p
        className="text-3xl font-light text-white sm:text-5xl"
        initial={{ opacity: 0, letterSpacing: '0.3em', filter: 'blur(6px)' }}
        animate={{ opacity: 1, letterSpacing: '0em', filter: 'blur(0px)' }}
        transition={{ duration: 1.4, ease: [0.23, 1, 0.32, 1] }}
      >
        Clarity
      </motion.p>
    </div>
  )
}

export function Mockups() {
  return (
    <div className="grid size-full place-items-center bg-[#0c0c0e] p-6 sm:p-10">
      <motion.div
        className="w-full max-w-md overflow-hidden rounded-xl border border-white/10 bg-[#18181b] shadow-2xl"
        initial={{ opacity: 0, transform: 'translateY(24px)' }}
        animate={{ opacity: 1, transform: 'translateY(0px)' }}
        transition={RISE}
      >
        <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
          {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
            <span key={c} className="size-2 rounded-full" style={{ background: c }} />
          ))}
          <span className="ml-3 rounded-md bg-white/10 px-3 py-0.5 text-[10px] text-white/60 sm:text-xs">
            lumen.app
          </span>
        </div>
        <div className="flex gap-3 p-4">
          <Mark className="size-8 shrink-0 text-white" />
          <div className="flex-1 space-y-2">
            <div className="h-2.5 w-2/3 rounded-full bg-white/80" />
            <div className="h-2 w-full rounded-full bg-white/15" />
            <div className="h-2 w-5/6 rounded-full bg-white/15" />
            <div className="mt-3 flex gap-2">
              <span className="h-5 w-14 rounded-md bg-[#5b7cff]" />
              <span className="h-5 w-14 rounded-md bg-white/10" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

const WEIGHTS = [
  ['Thin', 100],
  ['Light', 300],
  ['Regular', 400],
  ['Medium', 500],
  ['Semibold', 600],
  ['Bold', 700],
  ['Black', 900],
] as const

export function Typography() {
  return (
    <div className="grid size-full place-items-center bg-black">
      <ul className="space-y-0.5 text-[11px] text-white sm:space-y-1 sm:text-base">
        {WEIGHTS.map(([name, weight], i) => (
          <motion.li
            key={name}
            className="flex gap-6"
            style={{ fontWeight: weight }}
            initial={{ opacity: 0, transform: 'translateX(-8px)' }}
            animate={{ opacity: 1, transform: 'translateX(0px)' }}
            transition={{ ...RISE, delay: 0.1 + i * 0.07 }}
          >
            <span className="text-white/50">Aa</span>
            <span>Sans {name}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}

const SWATCHES = [
  { name: 'Signal Blue', hex: '#3E63F5', ink: 'text-white' },
  { name: 'Ember', hex: '#FF7A59', ink: 'text-white' },
  { name: 'Paper', hex: '#F6F4EF', ink: 'text-black' },
]

export function Colours() {
  return (
    <div className="flex size-full gap-1.5 bg-black p-1.5">
      {SWATCHES.map((swatch, i) => (
        <motion.div
          key={swatch.name}
          className={`flex flex-1 flex-col justify-between rounded-lg p-3 text-[10px] sm:p-4 sm:text-xs ${swatch.ink}`}
          style={{ background: swatch.hex, transformOrigin: 'bottom' }}
          initial={{ opacity: 0, transform: 'scaleY(0.9)' }}
          animate={{ opacity: 1, transform: 'scaleY(1)' }}
          transition={{ ...RISE, delay: i * 0.08 }}
        >
          <span className="font-semibold">{swatch.name}</span>
          <span className="font-mono opacity-70">{swatch.hex}</span>
        </motion.div>
      ))}
    </div>
  )
}

const ICONS = [Sparkles, Code2, Compass, Layers, MessageCircle, Rocket]

export function Iconography() {
  return (
    <div className="grid size-full place-items-center bg-black">
      <div className="flex gap-5 text-white sm:gap-9">
        {ICONS.map((Icon, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, transform: 'translateY(10px) scale(0.9)' }}
            animate={{ opacity: 1, transform: 'translateY(0px) scale(1)' }}
            transition={{ ...RISE, delay: i * 0.08 }}
          >
            <Icon className="size-5 sm:size-7" strokeWidth={1.6} aria-hidden />
          </motion.span>
        ))}
      </div>
    </div>
  )
}

export function Outro() {
  return (
    <div className="grid size-full place-items-center bg-black">
      <motion.div
        initial={{ opacity: 0, filter: 'blur(10px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
      >
        <Wordmark />
      </motion.div>
    </div>
  )
}
