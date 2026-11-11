
import { describe, expect, it } from 'vitest'
import { candidates } from '../data/candidates'
import { getAssessmentCoverage } from './assessmentCoverage'

describe('getAssessmentCoverage', () => {
  it('reports coverage for every candidate', () => {
    const coverage = getAssessmentCoverage()

    expect(coverage).toHaveLength(candidates.length)
    expect(coverage.map(item => item.candidateId)).toEqual(
      candidates.map(candidate => candidate.id),
    )

    for (const candidate of coverage) {
      expect(candidate.assessedPolicies).toBeGreaterThanOrEqual(0)
      expect(candidate.assessedPolicies).toBeLessThanOrEqual(
        candidate.totalPolicies,
      )
      expect(candidate.coverage).toBeGreaterThanOrEqual(0)
      expect(candidate.coverage).toBeLessThanOrEqual(1)
    }
  })

  it('reports missing policy IDs', () => {
    const coverage = getAssessmentCoverage()

    for (const candidate of coverage) {
      expect(candidate.missingPolicyIds.length).toBe(
        candidate.totalPolicies - candidate.assessedPolicies,
      )
    }
  })
})
