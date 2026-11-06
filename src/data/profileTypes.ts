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
}