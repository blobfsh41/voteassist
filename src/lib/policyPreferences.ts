import type {
  PolicyQuestionId,
  PolicyScore,
} from '../data/policies'

import type {
  PolicyPreference,
  UserProfile,
} from '../data/profileTypes'
import type { UserPolicyPreference } from './policyMatching'

export function toUserPolicyPreferences(
  profile: UserProfile,
): UserPolicyPreference[] {
  return Object.entries(profile.preferences.policyPreferences).flatMap(
    ([policyId, preference]) => {
      if (preference.score === null) return []

      return [{
        policyId: policyId as UserPolicyPreference['policyId'],
        score: preference.score,
        importance: preference.importance,
      }]
    },
  )
}

export function updatePolicyPreference(
  profile: UserProfile,
  policyId: PolicyQuestionId,
  update: Partial<PolicyPreference>,
): UserProfile {
  const current = profile.preferences.policyPreferences[policyId]

  const next: PolicyPreference = {
    score: current?.score ?? null,
    importance: current?.importance ?? 3,
    ...update,
  }

  if (
    next.score !== null &&
    (!Number.isInteger(next.score) ||
      next.score < -2 ||
      next.score > 2)
  ) {
    throw new Error('Invalid policy score')
  }

  if (
    !Number.isInteger(next.importance) ||
    next.importance < 1 ||
    next.importance > 5
  ) {
    throw new Error('Invalid policy importance')
  }

  return {
    ...profile,
    preferences: {
      ...profile.preferences,
      policyPreferences: {
        ...profile.preferences.policyPreferences,
        [policyId]: next,
      },
    },
  }
}

export function setPolicyStance(
  profile: UserProfile,
  policyId: PolicyQuestionId,
  score: PolicyScore,
): UserProfile {
  return updatePolicyPreference(profile, policyId, { score })
}

export function setPolicyImportance(
  profile: UserProfile,
  policyId: PolicyQuestionId,
  importance: number,
): UserProfile {
  return updatePolicyPreference(profile, policyId, { importance })
}