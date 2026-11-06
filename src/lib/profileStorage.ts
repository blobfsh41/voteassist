import type { UserProfile } from '../data/profileTypes'

const PROFILE_KEY = 'voteassist-profile'

function createDefaultProfile(): UserProfile {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    electorateId: null,
    preferences: {
      followedCandidates: [],
      followedPolicies: [],
      bookmarkedStories: [],
    },
  }
}

export function loadProfile(): UserProfile {
  const stored = localStorage.getItem(PROFILE_KEY)

  if (stored) {
    try {
      const parsed = JSON.parse(stored) as UserProfile

      if (
        parsed.id &&
        parsed.createdAt &&
        parsed.preferences &&
        Array.isArray(parsed.preferences.followedCandidates) &&
        Array.isArray(parsed.preferences.followedPolicies) &&
        Array.isArray(parsed.preferences.bookmarkedStories)
      ) {
        return parsed
      }
    } catch {
      // Invalid stored profile: create a new one.
    }
  }

  const profile = createDefaultProfile()
  saveProfile(profile)

  return profile
}

export function saveProfile(profile: UserProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
}