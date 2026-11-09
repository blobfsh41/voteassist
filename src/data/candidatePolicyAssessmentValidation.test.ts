
import { describe, expect, it } from 'vitest'
import { validateCandidatePolicyAssessments } from './candidatePolicyAssessmentValidation'
import type { CandidatePolicyAssessment } from './candidatePolicyAssessments'

const validAssessment: CandidatePolicyAssessment = {
  candidateId: 'maya-chen',
  policyId: 'housing-supply',
  score: 1,
  rationale: 'Supports additional housing near transport.',
  evidence: [
    {
      sourceTitle: 'Candidate profile',
      sourceUrl: 'https://example.com/profile',
      excerpt: 'Supports affordable housing near public transport.',
    },
  ],
  assessedAt: '2026-11-10',
}

describe('validateCandidatePolicyAssessments', () => {
  it('accepts a valid assessment', () => {
    expect(validateCandidatePolicyAssessments([validAssessment])).toEqual([])
  })

  it('accepts null when evidence and rationale are present', () => {
    expect(
      validateCandidatePolicyAssessments([
        { ...validAssessment, score: null },
      ]),
    ).toEqual([])
  })

  it('rejects duplicate candidate-policy assessments', () => {
    const errors = validateCandidatePolicyAssessments([
      validAssessment,
      validAssessment,
    ])

    expect(errors).toContain(
      'Assessment 2: duplicate candidate-policy assessment',
    )
  })

  it('rejects invalid evidence URLs', () => {
    const errors = validateCandidatePolicyAssessments([
      {
        ...validAssessment,
        evidence: [
          {
            ...validAssessment.evidence[0],
            sourceUrl: 'javascript:alert(1)',
          },
        ],
      },
    ])

    expect(errors).toContain(
      'Assessment 1, evidence 1: URL must use HTTP or HTTPS',
    )
  })

  it('rejects invalid assessment dates', () => {
    const errors = validateCandidatePolicyAssessments([
      { ...validAssessment, assessedAt: '2026-02-30' },
    ])

    expect(errors).toContain('Assessment 1: invalid assessment date')
  })
})
