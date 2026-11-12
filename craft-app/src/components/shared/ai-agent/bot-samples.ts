import type { BotColor, BotFace, BotShape } from '@/components/ui/agent-computer-icon'

export type BotSample = {
  name: string
  shape: BotShape
  face: BotFace
  color: BotColor
  description: string
  creator: string
}

export const TEAM: BotSample[] = [
  {
    name: 'Experiments',
    shape: 'capsule',
    face: 'neutral',
    color: 'red',
    description: 'Tries three versions of every idea before lunch',
    creator: 'Godfred',
  },
  {
    name: 'Motion God',
    shape: 'pebble',
    face: 'curious',
    color: 'blue',
    description: 'Picks the spring, the curve and the duration',
    creator: 'Emil',
  },
  {
    name: 'Design Bro',
    shape: 'hexagon',
    face: 'happy',
    color: 'purple',
    description: 'Turns a sketch into a component spec',
    creator: 'Mara',
  },
  {
    name: 'DevBot',
    shape: 'squircle',
    face: 'attentive',
    color: 'ink',
    description: 'Reviews pull requests and runs the tests',
    creator: 'Ilya',
  },
]

export const WORKERS: BotSample[] = [
  {
    name: 'Chief of Staff',
    shape: 'droplet',
    face: 'proud',
    color: 'orange',
    description: "Reads tomorrow's calendar and preps a morning digest",
    creator: 'Godfred',
  },
  {
    name: 'Inbox Triage',
    shape: 'circle',
    face: 'attentive',
    color: 'green',
    description: "Sorts email, drafts replies and surfaces what's urgent",
    creator: 'Lena',
  },
  {
    name: 'Commitment Tracker',
    shape: 'cloud',
    face: 'suspicious',
    color: 'purple',
    description: 'Tracks what you promised and what others owe you',
    creator: 'Sami',
  },
  {
    name: 'Standup Scribe',
    shape: 'triangle',
    face: 'excited',
    color: 'turquoise',
    description: "Posts a daily digest of what shipped and what's blocked",
    creator: 'Noor',
  },
]
