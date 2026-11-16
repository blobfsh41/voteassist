import { candidates } from '../data/candidates'
import type { Candidate } from '../data/candidateTypes'
import { getValidatedCandidatePolicyPositions } from '../data/candidatePolicyAssessmentRegistry'
import {
  rankCandidates,
  type RankingMode,
  type RankedCandidate,
  type UserPolicyPreference,
} from './policyMatching'

export function getCandidatesForElectorate(
  candidateCollection: readonly Candidate[],
  electorateId: string | null,
): Candidate[] {
  if (!electorateId) return []

  return candidateCollection.filter(
    (candidate) =>
      candidate.electorateId === electorateId &&
      candidate.status === 'active',
  )
}

export function rankAllCandidates(
  preferences: UserPolicyPreference[],
  electorateId: string | null,
  mode: RankingMode = 'stance',
  minimumCoverage = 0.6,
): RankedCandidate[] {
  const electorateCandidates = getCandidatesForElectorate(
    candidates,
    electorateId,
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