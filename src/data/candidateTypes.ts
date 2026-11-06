
import type { PolicyCategoryId, PolicyPosition } from './policies'

export interface Candidate {
  id: string
  name: string
  party: string
  image?: string
  policies: Partial<Record<PolicyCategoryId, PolicyPosition>>
}
