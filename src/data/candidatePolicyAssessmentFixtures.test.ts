
import { describe, expect, it } from 'vitest'
import { pilotCandidatePolicyAssessments } from './candidatePolicyAssessmentFixtures'

describe('pilot candidate assessments', () => {
  it('contains valid scores and assessment metadata', () => {
    for (const assessment of pilotCandidatePolicyAssessments) {
      expect(
        assessment.score === null ||
          [-2, -1, 0, 1, 2].includes(assessment.score),
      ).toBe(true)

      expect(assessment.rationale.length).toBeGreaterThan(0)
      expect(assessment.evidence.length).toBeGreaterThan(0)
      expect(assessment.assessedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })

  it('includes an insufficient-evidence assessment', () => {
    expect(
      pilotCandidatePolicyAssessments.some(
        (assessment) => assessment.score === null,
      ),
    ).toBe(true)
  })
})
