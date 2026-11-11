
import { candidates } from '../data/candidates'
import {
  getValidatedCandidatePolicyPositions,
} from '../data/candidatePolicyAssessmentRegistry'
import {
  calculatePolicyMatch,
  rankCandidates,
} from './policyMatching'
import type {
  UserPolicyPreference,
  MatchResult,
  RankedCandidate,
} from './policyMatching'

export function matchCandidate(
  preferences: UserPolicyPreference[],
  candidateId: string,
): MatchResult | null {
  const candidate = getValidatedCandidatePolicyPositions(candidateId)

  return calculatePolicyMatch(preferences, candidate)
}

export function rankAllCandidates(
  preferences: UserPolicyPreference[],
  electorateId?: string | null,
): RankedCandidate[] {
  const electorateCandidates = electorateId === undefined
    ? candidates
    : electorateId === null
      ? []
      : candidates.filter(
          candidate => candidate.electorateId === electorateId,
        )

  const positions = electorateCandidates.map(candidate =>
    getValidatedCandidatePolicyPositions(candidate.id),
  )

  return rankCandidates(preferences, positions)
}
