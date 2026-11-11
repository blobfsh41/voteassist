
import type { CandidatePolicyAssessment } from './candidatePolicyAssessments'

export const pilotCandidatePolicyAssessments: CandidatePolicyAssessment[] = [
  {
    candidateId: 'maya-chen',
    policyId: 'housing-supply',
    score: 1,
    rationale:
      'Supports affordable housing near transport but does not explicitly endorse planning reform.',
    evidence: [
      {
        sourceTitle: 'Fictional candidate profile',
        sourceUrl: 'https://example.com/maya-chen',
        excerpt:
          'Supports affordable housing development near public transport.',
      },
    ],
    assessedAt: '2026-11-10',
    status: 'draft',
  },
  {
    candidateId: 'daniel-brooks',
    policyId: 'housing-supply',
    score: 2,
    rationale:
      'Explicitly supports faster planning approvals and smaller homes.',
    evidence: [
      {
        sourceTitle: 'Fictional candidate profile',
        sourceUrl: 'https://example.com/daniel-brooks',
        excerpt:
          'Supports faster approvals for new housing and smaller homes.',
      },
    ],
    assessedAt: '2026-11-10',
    status: 'draft',
  },
  {
    candidateId: 'aisha-patel',
    policyId: 'housing-supply',
    score: null,
    rationale:
      'Supports affordable housing and community input, but does not establish a position on increasing housing supply.',
    evidence: [
      {
        sourceTitle: 'Fictional candidate profile',
        sourceUrl: 'https://example.com/aisha-patel',
        excerpt:
          'Supports affordable housing and community consultation.',
      },
    ],
    assessedAt: '2026-11-10',
    status: 'draft',
  },
]
