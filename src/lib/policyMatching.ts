
import {
  policyQuestions,
  type PolicyQuestionId,
  type PolicyScore,
} from '../data/policies'

export type { PolicyScore } from '../data/policies'

export interface UserPolicyPreference {
  policyId: PolicyQuestionId
  score: PolicyScore
  importance: number
}

export interface CandidatePolicyPositions {
  candidateId: string
  positions: Partial<Record<PolicyQuestionId, PolicyScore>>
}

export interface MatchResult {
  distance: number
  minimumPossibleDistance: number
  maximumPossibleDistance: number
  minimumPossibleMatch: number
  maximumPossibleMatch: number
  coverage: number
  weightedCoverage: number
  matchedPolicies: number
}


const MIN_COVERAGE = 0.6

function isPolicyScore(value: unknown): value is PolicyScore {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= -2 &&
    value <= 2
  )
}

const validPolicyIds = new Set<string>(
  policyQuestions.map((question) => question.id),
)

function validateCandidatePositions(
  candidate: CandidatePolicyPositions,
): void {
  if (
    !candidate.positions ||
    typeof candidate.positions !== 'object' ||
    Array.isArray(candidate.positions)
  ) {
    throw new Error('Invalid candidate policy positions')
  }

  for (const [policyId, score] of Object.entries(candidate.positions)) {
    if (!validPolicyIds.has(policyId) || !isPolicyScore(score)) {
      throw new Error('Invalid candidate policy position')
    }
  }
}

export function calculatePolicyMatch(
  preferences: UserPolicyPreference[],
  candidate: CandidatePolicyPositions,
  minimumCoverage = MIN_COVERAGE,
): MatchResult | null {
  if (preferences.length === 0) return null

  if (
    !Number.isFinite(minimumCoverage) ||
    minimumCoverage < 0 ||
    minimumCoverage > 1
  ) {
    throw new Error('Invalid minimum coverage')
  }

  const seen = new Set<string>()

  for (const preference of preferences) {
    if (
      !preference.policyId ||
      !validPolicyIds.has(preference.policyId) ||
      seen.has(preference.policyId) ||
      !isPolicyScore(preference.score) ||
      !Number.isInteger(preference.importance) ||
      preference.importance < 1 ||
      preference.importance > 5
    ) {
      throw new Error('Invalid policy preference')
    }

    seen.add(preference.policyId)
  }

  validateCandidatePositions(candidate)

  let totalWeight = 0
  let matchedWeight = 0
  let weightedSquaredDifference = 0
  let matchedPolicies = 0

  for (const preference of preferences) {
    totalWeight += preference.importance

    const candidateScore = candidate.positions[preference.policyId]

    if (candidateScore === undefined) continue

    if (!isPolicyScore(candidateScore)) {
      throw new Error('Invalid candidate policy score')
    }

    const difference = preference.score - candidateScore

    weightedSquaredDifference +=
      preference.importance * difference ** 2

    matchedWeight += preference.importance
    matchedPolicies++
  }

  const coverage = matchedPolicies / preferences.length
  const weightedCoverage = matchedWeight / totalWeight

  if (matchedWeight === 0 || weightedCoverage < minimumCoverage) {
    return null
  }

  const distance = Math.sqrt(
      weightedSquaredDifference / matchedWeight,
    ) 
  const minimumPossibleDistance = Math.sqrt(
    weightedSquaredDifference / totalWeight,
  )

  const maximumPossibleDistance = Math.sqrt(
    (weightedSquaredDifference + 16 * (totalWeight - matchedWeight)) /
      totalWeight,
  )

  const minimumPossibleMatch =
    100 * (1 - maximumPossibleDistance / 4)

  const maximumPossibleMatch =
    100 * (1 - minimumPossibleDistance / 4)

  return {
    distance,
    minimumPossibleDistance,
    maximumPossibleDistance,
    minimumPossibleMatch,
    maximumPossibleMatch,
    coverage,
    weightedCoverage,
    matchedPolicies,
  }
}

export interface RankedCandidate extends MatchResult {
  candidateId: string
}

export type RankingMode = 'stance' | 'conservative'

export function rankCandidates(
  preferences: UserPolicyPreference[],
  candidates: CandidatePolicyPositions[],
  mode: RankingMode = 'stance',
  minimumCoverage = MIN_COVERAGE,
): RankedCandidate[] {
  if (mode !== 'stance' && mode !== 'conservative') {
    throw new Error('Invalid ranking mode')
  }

  if (
    !Number.isFinite(minimumCoverage) ||
    minimumCoverage < 0 ||
    minimumCoverage > 1
  ) {
    throw new Error('Invalid minimum coverage')
  }

  return candidates
    .map((candidate) => {
      const result = calculatePolicyMatch(
        preferences,
        candidate,
        minimumCoverage,
      )

      if (!result) return null

      return {
        candidateId: candidate.candidateId,
        ...result,
      }
    })
    .filter((result) => result !== null)
    .sort((a, b) => {
      if (mode === 'conservative') {
        if (a.minimumPossibleMatch !== b.minimumPossibleMatch) {
          return b.minimumPossibleMatch - a.minimumPossibleMatch
        }
      } else {
        if (a.distance !== b.distance) {
          return a.distance - b.distance
        }
      }

      if (a.coverage !== b.coverage) {
        return b.coverage - a.coverage
      }

      return a.candidateId.localeCompare(b.candidateId)
    })
}
