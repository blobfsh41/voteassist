import { candidates } from '../data/candidates'
import { getValidatedCandidatePolicyPositions } from '../data/candidatePolicyAssessmentRegistry'
import {
  rankCandidates,
  type RankingMode,
  type RankedCandidate,
  type UserPolicyPreference,
} from './policyMatching'

export function rankAllCandidates(
  preferences: UserPolicyPreference[],
  electorateId: string | null,
  mode: RankingMode = 'stance',
  minimumCoverage = 0.6,
): RankedCandidate[] {
  if (!electorateId) return []

  const electorateCandidates = candidates.filter(
    (candidate) =>
      candidate.electorateId === electorateId &&
      candidate.status === 'active',
  )

  const candidatePositions = electorateCandidates.map(
    (candidate) =>
      getValidatedCandidatePolicyPositions(candidate.id),
  )

  return rankCandidates(
    preferences,
    candidatePositions,
    mode,
    minimumCoverage,
  )
}