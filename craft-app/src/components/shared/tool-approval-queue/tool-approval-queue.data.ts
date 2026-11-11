import type { ToolApprovalRequest } from '@/components/ui/tool-approval-queue'

/** Release-day requests from one agent, across all risk levels and payload kinds. */
export const REQUESTS: ToolApprovalRequest[] = [
  {
    id: 'changelog',
    tool: 'fs.write',
    title: 'Add the 2.4.0 section to the changelog',
    risk: 'low',
    agent: 'release-agent',
    payload: {
      kind: 'diff',
      path: 'docs/changelog.md',
      lines: [
        { type: 'context', text: '# Changelog' },
        { type: 'add', text: '## 2.4.0 — 3 Nov 2026' },
        { type: 'add', text: '- Offline mode for the desktop app' },
        { type: 'add', text: '- Faster cold start on Windows (−38%)' },
        { type: 'context', text: '## 2.3.2 — 14 Oct 2026' },
      ],
    },
  },
  {
    id: 'release',
    tool: 'bash',
    title: 'Create the GitHub release',
    risk: 'medium',
    agent: 'release-agent',
    payload: {
      kind: 'shell',
      cwd: '~/src/desktop',
      command: 'gh release create v2.4.0 --notes-file docs/changelog.md --verify-tag',
    },
  },
  {
    id: 'slack',
    tool: 'slack.post',
    title: 'Announce the release in #releases',
    risk: 'medium',
    agent: 'release-agent',
    payload: {
      kind: 'json',
      args: {
        channel: '#releases',
        text: 'Desktop 2.4.0 is out — offline mode and a faster Windows start.',
      },
    },
  },
  {
    id: 'email',
    tool: 'mail.send',
    title: 'Email the release notes to beta testers',
    risk: 'low',
    agent: 'release-agent',
    payload: {
      kind: 'email',
      to: 'beta@example.com',
      subject: 'Desktop 2.4.0 is out',
      body: 'Thanks for testing the offline mode. Version 2.4.0 ships today with the fixes you reported and a much faster start on Windows.',
    },
  },
  {
    id: 'publish',
    tool: 'bash',
    title: 'Publish the SDK to npm',
    risk: 'high',
    agent: 'release-agent',
    payload: {
      kind: 'shell',
      cwd: '~/src/desktop/packages/sdk',
      command: 'npm publish --access public --tag latest',
    },
  },
  {
    id: 'purge',
    tool: 'bash',
    title: 'Purge the CDN cache for the download page',
    risk: 'high',
    agent: 'release-agent',
    payload: {
      kind: 'shell',
      cwd: '~/src/desktop',
      command: 'cdn purge --zone downloads --path "/desktop/*"',
    },
  },
]
