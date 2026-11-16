import { describe, expect, it } from 'vitest'
import type { Candidate } from '../data/candidateTypes'
import { candidates } from '../data/candidates'
import {
  getCandidatesForElectorate,
  rankAllCandidates,
} from './candidateMatching'

const testCandidates: Candidate[] = [
  {
    id: 'candidate-a',
    name: 'Candidate A',
    party: 'Party A',
    electionId: 'election-2026',
    electorateId: 'albert-park',
    status: 'active',
    policies: {},
  },
  {
    id: 'candidate-b',
    name: 'Candidate B',
    party: 'Party B',
    electionId: 'election-2026',
    electorateId: 'albert-park',
    status: 'withdrawn',
    policies: {},
  },
  {
    id: 'candidate-c',
    name: 'Candidate C',
    party: 'Party C',
    electionId: 'election-2026',
    electorateId: 'prahran',
    status: 'active',
    policies: {},
  },
]

describe('getCandidatesForElectorate', () => {
  it('returns only active candidates from the selected electorate', () => {
    const result = getCandidatesForElectorate(
      testCandidates,
      'albert-park',
    )

    expect(result.map((candidate) => candidate.id)).toEqual([
      'candidate-a',
    ])
  })

  it('returns no candidates when no electorate is selected', () => {
    expect(
      getCandidatesForElectorate(testCandidates, null),
    ).toEqual([])
  })

  it('returns no candidates for an unknown electorate', () => {
    expect(
      getCandidatesForElectorate(testCandidates, 'unknown'),
    ).toEqual([])
  })
})

describe('rankAllCandidates', () => {
  it('returns no matches when no candidate assessments are published', () => {
    const electorateId = candidates.find(
      (candidate) => candidate.status === 'active',
    )?.electorateId

    expect(electorateId).toBeTruthy()

    expect(
      rankAllCandidates(
        [{ policyId: 'housing-supply', score: 2, importance: 3 }],
        electorateId!,
      ),
    ).toEqual([])
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