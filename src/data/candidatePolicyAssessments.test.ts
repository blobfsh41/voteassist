import { describe, expect, it } from 'vitest'
import {
  candidatePolicyAssessments,
  getCandidatePolicyPositions,
} from './candidatePolicyAssessments'

describe('getCandidatePolicyPositions', () => {
  it('returns numerical positions for the requested candidate', () => {
    candidatePolicyAssessments.push({
      candidateId: 'candidate-1',
      policyId: 'housing-supply',
      score: 2,
      rationale: 'Test rationale',
      evidence: [],
      assessedAt: '2026-11-08',
      status: 'published',
    })

    try {
      expect(getCandidatePolicyPositions('candidate-1')).toEqual({
        candidateId: 'candidate-1',
        positions: {
          'housing-supply': 2,
        },
      })
    } finally {
      candidatePolicyAssessments.pop()
    }
  })

  it('omits assessments with insufficient evidence', () => {
    candidatePolicyAssessments.push({
      candidateId: 'candidate-1',
      policyId: 'housing-supply',
      score: null,
      rationale: 'Insufficient evidence',
      evidence: [],
      assessedAt: '2026-11-08',
      status: 'published',
    })

    try {
      expect(getCandidatePolicyPositions('candidate-1')).toEqual({
        candidateId: 'candidate-1',
        positions: {},
      })
    } finally {
      candidatePolicyAssessments.pop()
    }
  })

  it('rejects duplicate assessments even when one score is null', () => {
    candidatePolicyAssessments.push(
      {
        candidateId: 'candidate-1',
        policyId: 'housing-supply',
        score: null,
        rationale: 'Insufficient evidence',
        evidence: [],
        assessedAt: '2026-11-08',
        status: 'published',
      },
      {
        candidateId: 'candidate-1',
        policyId: 'housing-supply',
        score: 2,
        rationale: 'Test rationale',
        evidence: [],
        assessedAt: '2026-11-08',
        status: 'published',
      },
    )

    try {
      expect(() => getCandidatePolicyPositions('candidate-1')).toThrow(
        'Duplicate assessment for candidate-1: housing-supply',
      )
    } finally {
      candidatePolicyAssessments.splice(-2)
    }
  })
})