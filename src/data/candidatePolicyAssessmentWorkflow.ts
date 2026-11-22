
import type {
  CandidatePolicyAssessment,
  AssessmentReview,
} from './candidatePolicyAssessments'
import { validateCandidatePolicyAssessments } from './candidatePolicyAssessmentValidation'

function createReview(
  reviewer: string,
  reviewedAt: string,
  decision: AssessmentReview['decision'],
  notes: string,
): AssessmentReview {
  if (!reviewer.trim()) {
    throw new Error('Reviewer is required')
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(reviewedAt)) {
    throw new Error('Invalid review date')
  }

  if (Number.isNaN(Date.parse(`${reviewedAt}T00:00:00Z`))) {
    throw new Error('Invalid review date')
  }

  return {
    reviewer: reviewer.trim(),
    reviewedAt,
    decision,
    notes: notes.trim(),
  }
}

function assertValidAssessment(
  assessment: CandidatePolicyAssessment,
): void {
  const errors = validateCandidatePolicyAssessments([assessment])

  if (errors.length > 0) {
    throw new Error(errors.join('\n'))
  }
}

export function approveAssessment(
  assessment: CandidatePolicyAssessment,
  reviewer: string,
  reviewedAt: string,
  notes = '',
): CandidatePolicyAssessment {
  if (assessment.status !== 'draft') {
    throw new Error('Only draft assessments can be reviewed')
  }

  const review = createReview(
    reviewer,
    reviewedAt,
    'approved',
    notes,
  )

  const reviewedAssessment: CandidatePolicyAssessment = {
    ...assessment,
    status: 'reviewed',
    reviewStatus: 'approved',
    review,
  }

  assertValidAssessment(reviewedAssessment)

  return reviewedAssessment
}

export function publishAssessment(
  assessment: CandidatePolicyAssessment,
): CandidatePolicyAssessment {
  if (assessment.status !== 'reviewed') {
    throw new Error('Only reviewed assessments can be published')
  }

  if (
    assessment.reviewStatus !== 'approved' ||
    assessment.review?.decision !== 'approved'
  ) {
    throw new Error('Assessment requires approved review')
  }

  if (assessment.evidence.length < 2) {
    throw new Error(
      'Published assessments require at least two evidence sources',
    )
  }

  const publishedAssessment: CandidatePolicyAssessment = {
    ...assessment,
    status: 'published',
  }

  assertValidAssessment(publishedAssessment)

  return publishedAssessment
}

export function rejectAssessment(
  assessment: CandidatePolicyAssessment,
  reviewer: string,
  reviewedAt: string,
  reason: string,
  notes = '',
): CandidatePolicyAssessment {
  if (assessment.status !== 'draft') {
    throw new Error('Only draft assessments can be rejected')
  }

  if (!reason.trim()) {
    throw new Error('Rejection reason is required')
  }

  const rejectedAssessment: CandidatePolicyAssessment = {
    ...assessment,
    status: 'rejected',
    reviewStatus: 'rejected',
    review: createReview(
      reviewer,
      reviewedAt,
      'rejected',
      notes,
    ),
    rejectionReason: reason.trim(),
  }

  assertValidAssessment(rejectedAssessment)

  return rejectedAssessment
}
