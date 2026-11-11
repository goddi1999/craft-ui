import type {
  ComposerCommand,
  ComposerFile,
  ComposerModel,
} from '@/components/ui/agent-composer'

export const MODELS: ComposerModel[] = [
  { id: 'opus-5.5', name: 'Claude Opus 5.5', description: 'Deepest reasoning, long tasks' },
  { id: 'sonnet-5.5', name: 'Claude Sonnet 5.5', description: 'Fast and capable' },
  { id: 'haiku-5.5', name: 'Claude Haiku 5.5', description: 'Quick edits and lookups' },
]

export const COMMANDS: ComposerCommand[] = [
  { name: 'review', description: 'Review the current diff' },
  { name: 'test', description: 'Run the tests for changed files' },
  { name: 'explain', description: 'Explain a file or symbol' },
]

export const FILES: ComposerFile[] = [
  { id: 'i18n', path: 'src/i18n.ts', tokens: 1_840 },
  { id: 'en', path: 'src/i18n/locales/en.json', tokens: 6_210 },
  { id: 'steps', path: 'src/onboarding/steps.tsx', tokens: 3_420 },
  { id: 'welcome', path: 'src/onboarding/welcome.tsx', tokens: 2_130 },
  { id: 'e2e', path: 'e2e/onboarding.spec.ts', tokens: 2_960 },
]
