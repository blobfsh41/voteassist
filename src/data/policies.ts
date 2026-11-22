
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
      'Planning rules should be changed to allow more housing to be built in areas with high housing demand.',
  },
  {
    id: 'social-housing',
    categoryId: 'housing',
    title: 'Social and affordable housing',
    proposition:
      'Government should increase funding for the construction of social and affordable housing.',
  },
  {
    id: 'rental-protections',
    categoryId: 'housing',
    title: 'Rental protections',
    proposition:
      'Victoria should introduce stronger restrictions on rent increases and eviction, increasing protections for renters.',
  },
  {
    id: 'transport-frequency',
    categoryId: 'transport',
    title: 'Service frequency',
    proposition:
      'Public transport services should run more frequently, including during off-peak periods.',
  },
  {
    id: 'transport-investment',
    categoryId: 'transport',
    title: 'Public transport investment',
    proposition:
      'Government should increase investment in public transport infrastructure, such as rail lines, stations and tram networks.',
  },
] as const satisfies readonly PolicyQuestion[]

export type PolicyQuestionId = (typeof policyQuestions)[number]['id']
