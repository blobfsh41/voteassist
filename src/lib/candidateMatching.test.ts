import { describe, expect, it } from 'vitest'
import { candidates } from '../data/candidates'
import { rankAllCandidates } from './candidateMatching'

describe('rankAllCandidates', () => {
  it('returns no matches when no electorate is selected', () => {
    expect(
      rankAllCandidates(
        [{ policyId: 'housing-supply', score: 2, importance: 3 }],
        null,
      ),
    ).toEqual([])
  })

  it('returns no matches when no candidate assessments are published', () => {
    const electorateId = candidates.find(
      (candidate) => candidate.status === 'active',
    )?.electorateId

    expect(electorateId).toBeTruthy()

    const results = rankAllCandidates(
      [{ policyId: 'housing-supply', score: 2, importance: 3 }],
      electorateId!,
    )

    expect(results).toEqual([])
  })

  it('supports conservative ranking mode', () => {
    const electorateId = candidates.find(
      (candidate) => candidate.status === 'active',
    )?.electorateId

    expect(
      rankAllCandidates(
        [{ policyId: 'housing-supply', score: 2, importance: 3 }],
        electorateId ?? null,
        'conservative',
      ),
    ).toEqual([])
  })
})