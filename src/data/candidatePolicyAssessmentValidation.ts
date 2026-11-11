
import { candidates } from './candidates'
import { policyQuestions } from './policies'
import type { CandidatePolicyAssessment } from './candidatePolicyAssessments'

const candidateIds = new Set(candidates.map((candidate) => candidate.id))
const policyIds = new Set(policyQuestions.map((policy) => policy.id))

const validScores = new Set([-2, -1, 0, 1, 2])
const validStatuses = new Set(['draft', 'reviewed', 'published'])
const minimumPublishedEvidence = 2

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false

  const date = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
}

export function validateCandidatePolicyAssessments(
  assessments: CandidatePolicyAssessment[],
): string[] {
  const errors: string[] = []
  const seen = new Set<string>()

  assessments.forEach((assessment, index) => {
    const prefix = `Assessment ${index + 1}`
    const assessmentWithReview = assessment as CandidatePolicyAssessment & {
      status?: string
      reviewerName?: string
      reviewedAt?: string
    }

    if (!validStatuses.has(assessmentWithReview.status ?? '')) {
      errors.push(`${prefix}: invalid assessment status`)
    }

    const requiresReviewMetadata =
      assessmentWithReview.status === 'reviewed' ||
      assessmentWithReview.status === 'published'

    if (requiresReviewMetadata && !assessmentWithReview.reviewerName?.trim()) {
      errors.push(`${prefix}: reviewer name is required`)
    }

    if (requiresReviewMetadata && !assessmentWithReview.reviewedAt) {
      errors.push(`${prefix}: review date is required`)
    }

    if (
      assessmentWithReview.reviewerName !== undefined &&
      !assessmentWithReview.reviewerName.trim()
    ) {
      errors.push(`${prefix}: reviewer name cannot be empty`)
    }

    if (
      assessmentWithReview.reviewedAt !== undefined &&
      !isValidDate(assessmentWithReview.reviewedAt)
    ) {
      errors.push(`${prefix}: invalid review date`)
    }

    if (!candidateIds.has(assessment.candidateId)) {
      errors.push(`${prefix}: unknown candidate "${assessment.candidateId}"`)
    }

    if (!policyIds.has(assessment.policyId)) {
      errors.push(`${prefix}: unknown policy "${assessment.policyId}"`)
    }

    if (
      assessment.score !== null &&
      !validScores.has(assessment.score)
    ) {
      errors.push(`${prefix}: invalid score`)
    }

    const key = `${assessment.candidateId}:${assessment.policyId}`

    if (seen.has(key)) {
      errors.push(`${prefix}: duplicate candidate-policy assessment`)
    }
    seen.add(key)

    if (!assessment.rationale.trim()) {
      errors.push(`${prefix}: rationale is required`)
    }

    if (!isValidDate(assessment.assessedAt)) {
      errors.push(`${prefix}: invalid assessment date`)
    }

    if (assessment.evidence.length === 0) {
      errors.push(`${prefix}: at least one evidence source is required`)
    }

    if (
      assessmentWithReview.status === 'published' &&
      assessment.evidence.length < minimumPublishedEvidence
    ) {
      errors.push(`${prefix}: published assessments require at least two evidence sources`)
    }

    assessment.evidence.forEach((evidence, evidenceIndex) => {
      const evidencePrefix = `${prefix}, evidence ${evidenceIndex + 1}`

      if (!evidence.sourceTitle.trim()) {
        errors.push(`${evidencePrefix}: source title is required`)
      }

      try {
        const url = new URL(evidence.sourceUrl)

        if (!['http:', 'https:'].includes(url.protocol)) {
          errors.push(`${evidencePrefix}: URL must use HTTP or HTTPS`)
        }
      } catch {
        errors.push(`${evidencePrefix}: invalid source URL`)
      }

      if (!evidence.excerpt.trim()) {
        errors.push(`${evidencePrefix}: excerpt is required`)
      }

      if (
        evidence.publishedAt !== undefined &&
        !isValidDate(evidence.publishedAt)
      ) {
        errors.push(`${evidencePrefix}: invalid publication date`)
      }
    })
  })

  return errors
}
