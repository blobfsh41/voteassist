
export interface PolicyCategory {
  id: string
  title: string
  description: string
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
  },
  {
    id: 'transport',
    title: 'Public transport',
    description: 'Public transport accessibility, reliability and infrastructure.',
  },
]
