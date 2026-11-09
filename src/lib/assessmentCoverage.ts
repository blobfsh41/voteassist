
import { candidates } from '../data/candidates'
import { policyQuestions } from '../data/policies'
import { candidatePolicyAssessments } from '../data/candidatePolicyAssessments'

export interface CandidateAssessmentCoverage {
  candidateId: string
  assessedPolicies: number
  totalPolicies: number
  missingPolicyIds: string[]
  coverage: number
}

export function getAssessmentCoverage(): CandidateAssessmentCoverage[] {
  return candidates.map(candidate => {
    const assessedIds = new Set(
      candidatePolicyAssessments
        .filter(assessment => assessment.candidateId === candidate.id)
        .map(assessment => assessment.policyId),
    )

    const missingPolicyIds = policyQuestions
      .filter(policy => !assessedIds.has(policy.id))
      .map(policy => policy.id)

    return {
      candidateId: candidate.id,
      assessedPolicies: policyQuestions.length - missingPolicyIds.length,
      totalPolicies: policyQuestions.length,
      missingPolicyIds,
      coverage:
        (policyQuestions.length - missingPolicyIds.length) /
        policyQuestions.length,
    }
  })
}
