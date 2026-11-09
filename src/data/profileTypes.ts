
import type { PolicyQuestionId, PolicyScore } from './policies'

export interface PolicyPreference {
  score: PolicyScore | null
  importance: number
}

export interface UserProfile {
  id: string
  createdAt: string
  electorateId: string | null
  preferences: UserPreferences
}

export interface UserPreferences {
  followedCandidates: string[]
  followedPolicies: string[]
  bookmarkedStories: string[]
  policyPreferences: Partial<Record<PolicyQuestionId, PolicyPreference>>
}
