
import { describe, expect, it } from 'vitest'
import type { CandidatePolicyAssessment } from './candidatePolicyAssessments'
import {
  approveAssessment,
  publishAssessment,
  rejectAssessment,
} from './candidatePolicyAssessmentWorkflow'

const REVIEWED_AT = '2026-11-15'
const CANDIDATE_ID = 'vic-2026-albert-park-dragwidge-georgie'

function makeAssessment(
  overrides: Partial<CandidatePolicyAssessment> = {},
): CandidatePolicyAssessment {
  return {
    candidateId: CANDIDATE_ID,
    policyId: 'housing-supply',
    score: 0,
    rationale: 'Initial assessment for workflow testing.',
    evidence: [
      {
        sourceTitle: 'Source one',
        sourceUrl: 'https://example.com/one',
        excerpt: 'Supporting evidence from source one.',
      },
      {
        sourceTitle: 'Source two',
        sourceUrl: 'https://example.com/two',
        excerpt: 'Supporting evidence from source two.',
      },
    ],
    assessedAt: REVIEWED_AT,
    status: 'draft',
    ...overrides,
  }
}

describe('candidate policy assessment workflow', () => {
  it('changes a draft assessment to reviewed', () => {
    expect(
      approveAssessment(makeAssessment(), 'reviewer-1', REVIEWED_AT),
    ).toMatchObject({
      status: 'reviewed',
    })
  })

  it('records the reviewer and review date', () => {
    expect(
      approveAssessment(makeAssessment(), 'reviewer-1', REVIEWED_AT),
    ).toMatchObject({
      reviewStatus: 'approved',
      review: {
        reviewer: 'reviewer-1',
        reviewedAt: REVIEWED_AT,
        decision: 'approved',
      },
    })
  })

  it('rejects approval of a non-draft assessment', () => {
    expect(() =>
      approveAssessment(
        makeAssessment({ status: 'reviewed' }),
        'reviewer-1',
        REVIEWED_AT,
      ),
    ).toThrow()
  })

  it('rejects approval of an unknown candidate', () => {
    expect(() =>
      approveAssessment(
        makeAssessment({ candidateId: 'unknown-candidate' }),
        'reviewer-1',
        REVIEWED_AT,
      ),
    ).toThrow('unknown candidate')
  })

  it('rejects approval of an invalid score', () => {
    expect(() =>
      approveAssessment(
        makeAssessment({ score: 3 as CandidatePolicyAssessment['score'] }),
        'reviewer-1',
        REVIEWED_AT,
      ),
    ).toThrow('score must be between -2 and 2')
  })

  it('rejects approval without evidence', () => {
    expect(() =>
      approveAssessment(
        makeAssessment({ evidence: [] }),
        'reviewer-1',
        REVIEWED_AT,
      ),
    ).toThrow('at least one evidence source is required')
  })

  it('changes a reviewed assessment to published', () => {
    const reviewed = approveAssessment(
      makeAssessment(),
      'reviewer-1',
      REVIEWED_AT,
    )

    expect(publishAssessment(reviewed)).toMatchObject({
      status: 'published',
    })
  })

  it('rejects publishing with fewer than two evidence sources', () => {
    expect(() =>
      publishAssessment(
        approveAssessment(
          makeAssessment({
            evidence: [
              {
                sourceTitle: 'Only source',
                sourceUrl: 'https://example.com/one',
                excerpt: 'Supporting evidence.',
              },
            ],
          }),
          'reviewer-1',
          REVIEWED_AT,
        ),
      ),
    ).toThrow()
  })

  it('rejects publishing an unapproved assessment', () => {
    expect(() => publishAssessment(makeAssessment())).toThrow()
  })

  it('rejects publication if evidence becomes invalid after approval', () => {
    const reviewed = approveAssessment(
      makeAssessment(),
      'reviewer-1',
      REVIEWED_AT,
    )

    expect(() =>
      publishAssessment({
        ...reviewed,
        evidence: [],
      }),
    ).toThrow()
  })

  it('records a rejection and its reason', () => {
    expect(
      rejectAssessment(
        makeAssessment(),
        'reviewer-1',
        REVIEWED_AT,
        'Insufficient support for the claim',
      ),
    ).toMatchObject({
      status: 'rejected',
      reviewStatus: 'rejected',
      review: {
        reviewer: 'reviewer-1',
        reviewedAt: REVIEWED_AT,
        decision: 'rejected',
      },
      rejectionReason: 'Insufficient support for the claim',
    })
  })

  it('allows rejecting an incomplete draft', () => {
    expect(
      rejectAssessment(
        makeAssessment({
          rationale: '',
          evidence: [],
          score: null,
        }),
        'reviewer-1',
        REVIEWED_AT,
        'Insufficient evidence to assess this policy',
      ),
    ).toMatchObject({
      status: 'rejected',
      score: null,
      rationale: '',
      evidence: [],
    })
  })

  it('rejects an invalid calendar date during rejection', () => {
    expect(() =>
      rejectAssessment(
        makeAssessment(),
        'reviewer-1',
        '2026-02-30',
        'Insufficient evidence',
      ),
    ).toThrow('invalid review date')
  })

  it('rejects a missing rejection reason', () => {
    expect(() =>
      rejectAssessment(makeAssessment(), 'reviewer-1', REVIEWED_AT, ''),
    ).toThrow()
  })

  it('rejects rejecting a non-draft assessment', () => {
    expect(() =>
      rejectAssessment(
        makeAssessment({ status: 'reviewed' }),
        'reviewer-1',
        REVIEWED_AT,
        'Needs revision',
      ),
    ).toThrow()
  })
})
