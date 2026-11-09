
export type PolicyCategoryId = 'housing' | 'transport'

export type PolicyScore = -2 | -1 | 0 | 1 | 2

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

export interface PolicyQuestion {
  id: string
  categoryId: PolicyCategoryId
  title: string
  proposition: string
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
    description:
      'Public transport accessibility, reliability and infrastructure.',
    icon: 'tram',
  },
]

export const policyQuestions = [
  {
    id: 'housing-supply',
    categoryId: 'housing',
    title: 'Housing supply',
    proposition:
      'Planning rules should allow more homes to be built in areas with high housing demand.',
  },
  {
    id: 'social-housing',
    categoryId: 'housing',
    title: 'Social and affordable housing',
    proposition:
      'Government should increase investment in social and affordable housing.',
  },
  {
    id: 'rental-protections',
    categoryId: 'housing',
    title: 'Rental protections',
    proposition:
      'Rental laws should provide tenants with stronger protections against rent increases and eviction.',
  },
  {
    id: 'transport-frequency',
    categoryId: 'transport',
    title: 'Service frequency',
    proposition:
      'Government should increase public transport service frequency, including outside peak periods.',
  },
  {
    id: 'transport-investment',
    categoryId: 'transport',
    title: 'Public transport investment',
    proposition:
      'Government should increase investment in public transport infrastructure.',
  },
] as const satisfies readonly PolicyQuestion[]

export type PolicyQuestionId = (typeof policyQuestions)[number]['id']
