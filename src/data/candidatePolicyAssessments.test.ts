
import { describe, expect, it } from 'vitest'
import {
  getCandidatePolicyPositions,
} from './candidatePolicyAssessments'
import type { CandidatePolicyAssessment } from './candidatePolicyAssessments'

const makeAssessment = (
  overrides: Partial<CandidatePolicyAssessment> = {},
): CandidatePolicyAssessment => ({
  candidateId: 'candidate-1',
  policyId: 'housing-supply',
  score: 2,
  rationale: 'Test rationale',
  evidence: [],
  assessedAt: '2026-11-08',
  status: 'published',
  ...overrides,
})

describe('getCandidatePolicyPositions', () => {
  it('returns numerical positions for the requested candidate', () => {
    const assessments = [makeAssessment()]

    expect(
      getCandidatePolicyPositions('candidate-1', assessments),
    ).toEqual({
      candidateId: 'candidate-1',
      positions: {
        'housing-supply': 2,
      },
    })
  })

  it('omits assessments with insufficient evidence', () => {
    const assessments = [
      makeAssessment({
        score: null,
        rationale: 'Insufficient evidence',
      }),
    ]

    expect(
      getCandidatePolicyPositions('candidate-1', assessments),
    ).toEqual({
      candidateId: 'candidate-1',
      positions: {},
    })
  })

  it('rejects duplicate assessments even when one score is null', () => {
    const assessments = [
      makeAssessment({ score: null }),
      makeAssessment({ score: 2 }),
    ]

    expect(() =>
      getCandidatePolicyPositions('candidate-1', assessments),
    ).toThrow(
      'Duplicate assessment for candidate-1: housing-supply',
    )
  })
})
