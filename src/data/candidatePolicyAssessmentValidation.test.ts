
import { describe, expect, it } from 'vitest'
import { validateCandidatePolicyAssessments } from './candidatePolicyAssessmentValidation'
import type { CandidatePolicyAssessment } from './candidatePolicyAssessments'

const validAssessment: CandidatePolicyAssessment = {
  candidateId: 'vic-2026-albert-park-dragwidge-georgie',
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
  status: 'draft',
}

describe('validateCandidatePolicyAssessments', () => {
  it('accepts a valid assessment', () => {
    expect(validateCandidatePolicyAssessments([validAssessment])).toEqual([])
  })

  it('rejects unknown candidates', () => {
    const errors = validateCandidatePolicyAssessments([
      { ...validAssessment, candidateId: 'unknown-candidate' },
    ])

    expect(errors).toContain('Assessment 1: unknown candidate')
  })

  it('rejects unknown policy IDs', () => {
    const errors = validateCandidatePolicyAssessments([
      {
        ...validAssessment,
        policyId: 'unknown-policy',
      } as unknown as CandidatePolicyAssessment,
    ])

    expect(errors).toContain('Assessment 1: unknown policy')
  })

  it('accepts null when evidence and rationale are present', () => {
    expect(
      validateCandidatePolicyAssessments([
        { ...validAssessment, score: null },
      ]),
    ).toEqual([])
  })

  it('accepts a score of -2', () => {
    expect(
      validateCandidatePolicyAssessments([
        { ...validAssessment, score: -2 },
      ]),
    ).toEqual([])
  })

  it('accepts a score of +2', () => {
    expect(
      validateCandidatePolicyAssessments([
        { ...validAssessment, score: 2 },
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

  it('rejects a score of -3', () => {
    const errors = validateCandidatePolicyAssessments([
      { ...validAssessment, score: -3 } as unknown as CandidatePolicyAssessment,
    ])

    expect(errors).toContain('Assessment 1: score must be between -2 and 2')
  })

  it('rejects a score of +3', () => {
    const errors = validateCandidatePolicyAssessments([
      { ...validAssessment, score: 3 } as unknown as CandidatePolicyAssessment,
    ])

    expect(errors).toContain('Assessment 1: score must be between -2 and 2')
  })

  it('rejects published assessments without approved review', () => {
    const errors = validateCandidatePolicyAssessments([
      {
        ...validAssessment,
        status: 'published',
        reviewStatus: 'pending',
      } as CandidatePolicyAssessment,
    ])

    expect(errors).toContain(
      'Assessment 1: published assessments require approved review',
    )
  })

  it('rejects published assessments with fewer than two evidence sources', () => {
    const errors = validateCandidatePolicyAssessments([
      {
        ...validAssessment,
        status: 'published',
        reviewStatus: 'approved',
      } as CandidatePolicyAssessment,
    ])

    expect(errors).toContain(
      'Assessment 1: published assessments require at least two evidence sources',
    )
  })

  it('accepts valid published assessments', () => {
    expect(
      validateCandidatePolicyAssessments([
        {
          ...validAssessment,
          status: 'published',
          reviewStatus: 'approved',
          evidence: [
            ...validAssessment.evidence,
            {
              sourceTitle: 'Transport plan',
              sourceUrl: 'https://example.com/transport-plan',
              excerpt: 'Supports housing near transport corridors.',
            },
          ],
        } as CandidatePolicyAssessment,
      ]),
    ).toEqual([])
  })

  it('accepts correctly rejected assessments', () => {
    expect(
      validateCandidatePolicyAssessments([
        {
          ...validAssessment,
          score: null,
          status: 'rejected',
        },
      ]),
    ).toEqual([])
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
