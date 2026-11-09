
import { describe, expect, it } from 'vitest'
import { matchCandidate, rankAllCandidates } from './candidateMatching'

const preferences = [
  {
    policyId: 'housing-supply' as const,
    score: 2 as const,
    importance: 5,
  },
]

describe('candidate matching integration', () => {
  it('returns null for candidates with insufficient assessment coverage', () => {
    expect(matchCandidate(preferences, 'maya-chen')).toBeNull()
  })

  it('ranks candidates using their assessment positions', () => {
    expect(rankAllCandidates(preferences)).toEqual([])
  })
})
