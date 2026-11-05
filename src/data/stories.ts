import type { ResourceSection } from '../types'

export const resourceSections: ResourceSection[] = [
  {
    id: 'docs',
    icon: 'documentation-icon',
    title: 'Documentation',
    description: 'Your questions, answered',
    links: [
      { label: 'Explore Vite', href: 'https://vite.dev/', image: 'vite' },
      { label: 'Learn more', href: 'https://react.dev/', image: 'react' },
    ],
  },
  {
    id: 'social',
    icon: 'social-icon',
    title: 'Connect with us',
    description: 'Join the Vite community',
    links: [
      {
        label: 'GitHub',
        href: 'https://github.com/vitejs/vite',
        icon: 'github-icon',
      },
      { label: 'Discord', href: 'https://chat.vite.dev/', icon: 'discord-icon' },
      { label: 'X.com', href: 'https://x.com/vite_js', icon: 'x-icon' },
      {
        label: 'Bluesky',
        href: 'https://bsky.app/profile/vite.dev',
        icon: 'bluesky-icon',
      },
    ],
  },
]