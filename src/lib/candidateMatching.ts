import { getValidatedCandidatePolicyPositions } from '../data/candidatePolicyAssessmentRegistry'
import {
  rankCandidates,
  type RankingMode,
  type RankedCandidate,
  type UserPolicyPreference,
} from './policyMatching'
import { candidates } from '../data/candidates'

export function rankAssemblyCandidates(
  preferences: UserPolicyPreference[],
  mode: RankingMode = 'stance',
  minimumCoverage = 0.6,
): RankedCandidate[] {
  const candidatePositions = candidates.map(
    (candidate) => getValidatedCandidatePolicyPositions(candidate.id),
  )

  return rankCandidates(
    preferences,
    candidatePositions,
    mode,
    minimumCoverage,
  )
}
