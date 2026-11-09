
import type { PolicyCategoryId, PolicyPosition } from './policies'

export type CandidateStatus =
  | 'active'
  | 'withdrawn'
  | 'former'
  | 'unknown'

export interface Candidate {
  id: string
  name: string
  party: string
  electionId: string | null
  electorateId: string | null
  status: CandidateStatus
  image?: string
  policies: Partial<Record<PolicyCategoryId, PolicyPosition>>
}
