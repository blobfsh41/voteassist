export type ResourceLink = {
  label: string
  href: string
  icon?: string
  image?: string
}

export type ResourceSection = {
  id: 'docs' | 'social'
  icon: string
  title: string
  description: string
  links: ResourceLink[]
}