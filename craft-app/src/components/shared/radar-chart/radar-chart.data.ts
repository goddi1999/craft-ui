import type { RadarMember } from '@/components/ui/radar-chart'

export const SKILLS = [
  'Craft',
  'Systems thinking',
  'Product sense',
  'Collaboration',
  'Communication',
  'Leadership',
]

// Design team review, scored 0–4 against the senior rubric.
export const TEAM: RadarMember[] = [
  { id: 'jr', label: 'JR', name: 'Jae Rhee', values: [4, 4, 3, 3, 3, 4] },
  { id: 'mk', label: 'MK', name: 'Mira Kovac', values: [4, 4, 4, 2, 3, 3] },
  { id: 'lw', label: 'LW', name: 'Leo Wright', values: [4, 4, 3, 2, 3, 3] },
  { id: 'as', label: 'AS', name: 'Ana Soto', values: [3, 3, 3, 3, 2, 2] },
]

export const SENIOR_BAR = [3.5, 3, 3, 3, 3, 3]

export const EVALS = [
  'Reasoning',
  'Coding',
  'Tool use',
  'Long context',
  'Instruction following',
  'Safety',
  'Latency',
]

// Internal eval suite, 0–100. Latency is scored, so faster is higher.
export const MODELS: RadarMember[] = [
  { id: 'lg', label: 'LG', name: 'large-2', values: [91, 88, 84, 86, 90, 93, 52] },
  { id: 'md', label: 'MD', name: 'medium-2', values: [82, 80, 79, 78, 86, 90, 74] },
  { id: 'sm', label: 'SM', name: 'small-2', values: [66, 63, 71, 58, 78, 87, 95] },
  { id: 'ft', label: 'FT', name: 'support-ft', values: [74, 61, 92, 70, 93, 91, 88] },
]

export const SHIP_BAR = [75, 70, 80, 70, 85, 90, 70]

export const average = (members: RadarMember[], axes: number) =>
  Array.from(
    { length: axes },
    (_, i) =>
      Math.round(
        (members.reduce((sum, m) => sum + (m.values[i] ?? 0), 0) /
          Math.max(members.length, 1)) *
          10,
      ) / 10,
  )
