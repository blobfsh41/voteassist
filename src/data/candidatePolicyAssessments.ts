
import type {
  PolicyQuestionId,
  PolicyScore,
} from './policies'

import type { CandidatePolicyPositions } from '../lib/policyMatching'

export interface PolicyEvidence {
  sourceTitle: string
  sourceUrl: string
  publishedAt?: string
  excerpt: string
}

export interface AssessmentReview {
  reviewer: string
  reviewedAt: string
  decision: 'approved' | 'rejected'
  notes: string
}

export type AssessmentStatus =
  | 'draft'
  | 'reviewed'
  | 'published'
  | 'rejected'

export interface CandidatePolicyAssessment {
  candidateId: string
  policyId: PolicyQuestionId
  score: PolicyScore | null
  rationale: string
  evidence: PolicyEvidence[]
  assessedAt: string
  status: AssessmentStatus
  review?: AssessmentReview
  rejectionReason?: string
}

export const candidatePolicyAssessments: CandidatePolicyAssessment[] = []



export function getCandidatePolicyPositions(
  candidateId: string,
): CandidatePolicyPositions {
  const assessments = candidatePolicyAssessments.filter(
    (assessment) =>
      assessment.candidateId === candidateId &&
      assessment.status === 'published',
  )

  const positions: CandidatePolicyPositions['positions'] = {}
  const seenPolicies = new Set<PolicyQuestionId>()

  for (const assessment of assessments) {
    if (seenPolicies.has(assessment.policyId)) {
      throw new Error(
        `Duplicate assessment for ${candidateId}: ${assessment.policyId}`,
      )
    }

    seenPolicies.add(assessment.policyId)

    // Null means insufficient evidence, not a neutral position.
    if (assessment.score === null) continue

    positions[assessment.policyId] = assessment.score
  }

  return {
    candidateId,
    positions,
  }
}

