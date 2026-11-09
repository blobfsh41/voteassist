
import {
  candidatePolicyAssessments,
  getCandidatePolicyPositions,
} from './candidatePolicyAssessments'
import { validateCandidatePolicyAssessments } from './candidatePolicyAssessmentValidation'
import type { CandidatePolicyPositions } from '../lib/policyMatching'

const errors = validateCandidatePolicyAssessments(
  candidatePolicyAssessments,
)

if (errors.length > 0) {
  throw new Error(
    `Invalid candidate policy assessments:\n${errors.join('\n')}`,
  )
}

export function getValidatedCandidatePolicyPositions(
  candidateId: string,
): CandidatePolicyPositions {
  return getCandidatePolicyPositions(candidateId)
}
