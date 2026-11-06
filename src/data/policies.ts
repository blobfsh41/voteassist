
export type PolicyCategoryId = 'housing' | 'transport'

export interface PolicyCategory {
  id: PolicyCategoryId
  title: string
  description: string
  icon: 'home' | 'tram'
}

export interface PolicyPosition {
  title: string
  text: string
}

export const policyCategories: PolicyCategory[] = [
  {
    id: 'housing',
    title: 'Housing',
    description: 'Housing affordability, supply and planning.',
    icon: 'home',
  },
  {
    id: 'transport',
    title: 'Public transport',
    description: 'Public transport accessibility, reliability and infrastructure.',
    icon: 'tram',
  },
]
