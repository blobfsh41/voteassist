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


export const stories = [
  {
    source: 'AusPol - Transport',
    date: 'Today',
    title: 'Tram upgrades could reshape Sydney Road travel times',
    text: 'A proposed upgrade would improve tram frequency and step-free access, with candidates debating how the changes should be funded and phased.',
  },
  {
    source: 'News2U - Housing',
    date: 'Yesterday',
    title: 'Renters call for stronger protections in new housing plan',
    text: 'Community groups are asking for clearer renter safeguards and more local consultation before the proposal moves forward.',
  },
  {
    source: 'KnewsFeed - Local Spaces',
    date: '2 days ago',
    title: 'Community garden upgrade wins local support',
    text: 'A proposed upgrade to the local garden would add more seating and better lighting, with candidates promising to protect community-led spaces.',
  },
]