import type {
  CandidatePolicyAssessment,
  AssessmentReview,
} from './candidatePolicyAssessments'

export function publishAssessment(
  assessment: CandidatePolicyAssessment,
  review: AssessmentReview,
): CandidatePolicyAssessment {
  if (assessment.status !== 'draft' && assessment.status !== 'reviewed') {
    throw new Error('Only draft or reviewed assessments can be published')
  }

  if (review.decision !== 'approved') {
    throw new Error('Assessment must be approved before publication')
  }

  return {
    ...assessment,
    status: 'published',
    review,
  }
}

export function rejectAssessment(
  assessment: CandidatePolicyAssessment,
  review: AssessmentReview,
  reason: string,
): CandidatePolicyAssessment {
  if (!reason.trim()) {
    throw new Error('A rejection reason is required')
  }

  if (assessment.status === 'published') {
    throw new Error('Published assessments must be withdrawn before rejection')
  }

  return {
    ...assessment,
    status: 'rejected',
    review,
    rejectionReason: reason.trim(),
  }
}