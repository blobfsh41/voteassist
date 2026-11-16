import { describe, expect, it } from 'vitest'
import { rankAssemblyCandidates } from './candidateMatching'

describe('rankAssemblyCandidates', () => {
  it('returns no matches when no candidate assessments are published', () => {
    const results = rankAssemblyCandidates([
      {
        policyId: 'housing-supply',
        score: 2,
        importance: 3,
      },
    ])

    expect(results).toEqual([])
  })

  it('accepts the conservative ranking mode', () => {
    const results = rankAssemblyCandidates(
      [
        {
          policyId: 'housing-supply',
          score: 2,
          importance: 3,
        },
      ],
      'conservative',
    )

    expect(results).toEqual([])
  })
})
