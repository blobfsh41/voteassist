
import { describe, expect, it } from 'vitest'
import { calculatePolicyMatch, rankCandidates } from './policyMatching'
import type {
  UserPolicyPreference,
  CandidatePolicyPositions,
  RankingMode,
} from './policyMatching'


const preferences: UserPolicyPreference[] = [
  { policyId: 'housing-supply', score: 2, importance: 1 },
  { policyId: 'social-housing', score: 2, importance: 1 },
  { policyId: 'rental-protections', score: 2, importance: 1 },
]

const candidate: CandidatePolicyPositions = {
  candidateId: 'candidate-1',
  positions: {
    'housing-supply': -2,
    'social-housing': -2,
    'rental-protections': -2,
    'transport-frequency': 0,
    'transport-investment': 0,
  },
}

it('calculates coverage by importance, not question count', () => {
  const weightedPreferences: UserPolicyPreference[] = [
    { policyId: 'housing-supply', score: 2, importance: 5 },
    { policyId: 'social-housing', score: 1, importance: 1 },
    { policyId: 'rental-protections', score: 0, importance: 1 },
  ]

  const partiallyAssessedCandidate: CandidatePolicyPositions = {
    candidateId: 'partial',
    positions: {
      'housing-supply': 2,
    },
  }

  expect(
    calculatePolicyMatch(
      weightedPreferences,
      partiallyAssessedCandidate,
    ),
  ).not.toBeNull()
})

it('rejects preferences with unknown policy IDs', () => {
  const preferences: UserPolicyPreference[] = [
    {
      policyId: 'unknown-policy' as UserPolicyPreference['policyId'],
      score: 0,
      importance: 3,
    },
  ]

  const candidate: CandidatePolicyPositions = {
    candidateId: 'candidate-1',
    positions: {},
  }

  expect(() => calculatePolicyMatch(preferences, candidate)).toThrow(
    'Invalid policy preference',
  )
})

it('ranks candidates by stance distance', () => {
  const preferences: UserPolicyPreference[] = [
    { policyId: 'housing-supply', score: 2, importance: 3 },
    { policyId: 'social-housing', score: 1, importance: 2 },
  ]

  const candidates: CandidatePolicyPositions[] = [
    {
      candidateId: 'worse',
      positions: {
        'housing-supply': -2,
        'social-housing': -1,
      },
    },
    {
      candidateId: 'better',
      positions: {
        'housing-supply': 2,
        'social-housing': 1,
      },
    },
  ]

  const ranked = rankCandidates(preferences, candidates)

  expect(ranked.map((result) => result.candidateId)).toEqual([
    'better',
    'worse',
  ])
})

it('ranks realistic candidates according to weighted user priorities', () => {
  const preferences: UserPolicyPreference[] = [
    { policyId: 'housing-supply', score: 2, importance: 5 },
    { policyId: 'social-housing', score: 1, importance: 2 },
    { policyId: 'rental-protections', score: 0, importance: 1 },
  ]

  const candidates: CandidatePolicyPositions[] = [
    {
      candidateId: 'candidate-a',
      positions: {
        'housing-supply': 2,
        'social-housing': 1,
        'rental-protections': 0,
      },
    },
    {
      candidateId: 'candidate-b',
      positions: {
        'housing-supply': -2,
        'social-housing': 1,
        'rental-protections': 0,
      },
    },
    {
      candidateId: 'candidate-c',
      positions: {
        'housing-supply': 1,
        'social-housing': 1,
        'rental-protections': 1,
      },
    },
  ]

  const ranked = rankCandidates(preferences, candidates)

  expect(ranked.map((candidate) => candidate.candidateId)).toEqual([
    'candidate-a',
    'candidate-c',
    'candidate-b',
  ])
})

it('ranks candidates conservatively when assessments are missing', () => {
  const preferences: UserPolicyPreference[] = [
    { policyId: 'housing-supply', score: 2, importance: 3 },
    { policyId: 'social-housing', score: 1, importance: 2 },
  ]

  const candidates: CandidatePolicyPositions[] = [
    {
      candidateId: 'incomplete',
      positions: {
        'housing-supply': 2,
      },
    },
    {
      candidateId: 'complete',
      positions: {
        'housing-supply': 2,
        'social-housing': 1,
      },
    },
  ]

  const ranked = rankCandidates(preferences, candidates, 'conservative')

  expect(ranked[0].candidateId).toBe('complete')
})

it('breaks ranking ties deterministically by candidate ID', () => {
  const preferences: UserPolicyPreference[] = [
    { policyId: 'housing-supply', score: 2, importance: 3 },
  ]

  const candidates: CandidatePolicyPositions[] = [
    {
      candidateId: 'zeta',
      positions: { 'housing-supply': 2 },
    },
    {
      candidateId: 'alpha',
      positions: { 'housing-supply': 2 },
    },
  ]

  const ranked = rankCandidates(preferences, candidates)

  expect(ranked.map((result) => result.candidateId)).toEqual([
    'alpha',
    'zeta',
  ])
})

it('rejects candidates with insufficient weighted coverage despite high policy coverage', () => {
  const preferences: UserPolicyPreference[] = [
    { policyId: 'housing-supply', score: 0, importance: 5 },
    { policyId: 'social-housing', score: 0, importance: 1 },
    { policyId: 'rental-protections', score: 0, importance: 1 },
    { policyId: 'transport-frequency', score: 0, importance: 1 },
    { policyId: 'transport-investment', score: 0, importance: 1 },
  ]

  const candidate: CandidatePolicyPositions = {
    candidateId: 'candidate-1',
    positions: {
      'social-housing': 0,
      'rental-protections': 0,
      'transport-frequency': 0,
      'transport-investment': 0,
    },
  }

  const result = calculatePolicyMatch(preferences, candidate)

  expect(result).toBeNull()
})

describe('rankCandidates', () => {
  it('ranks candidates from closest to furthest', () => {
    const preferences: UserPolicyPreference[] = [
      { policyId: 'housing-supply', score: 2, importance: 1 },
    ]

    const candidates: CandidatePolicyPositions[] = [
      {
        candidateId: 'opposite',
        positions: { 'housing-supply': -2 },
      },
      {
        candidateId: 'identical',
        positions: { 'housing-supply': 2 },
      },
      {
        candidateId: 'neutral',
        positions: { 'housing-supply': 0 },
      },
    ]

    expect(rankCandidates(preferences, candidates).map((c) => c.candidateId))
      .toEqual(['identical', 'neutral', 'opposite'])
  })

  it('uses candidate ID as a deterministic final tie-break', () => {
    const candidates: CandidatePolicyPositions[] = [
      {
        candidateId: 'candidate-c',
        positions: {
          'housing-supply': 2,
          'social-housing': 2,
          'rental-protections': 2,
        },
      },
      {
        candidateId: 'candidate-a',
        positions: {
          'housing-supply': 2,
          'social-housing': 2,
          'rental-protections': 2,
        },
      },
      {
        candidateId: 'candidate-b',
        positions: {
          'housing-supply': 2,
          'social-housing': 2,
          'rental-protections': 2,
        },
      },
    ]

    const firstRanking = rankCandidates(preferences, candidates)
    const secondRanking = rankCandidates(preferences, [...candidates].reverse())

    expect(firstRanking.map((result) => result.candidateId)).toEqual([
      'candidate-a',
      'candidate-b',
      'candidate-c',
    ])

    expect(secondRanking.map((result) => result.candidateId)).toEqual([
      'candidate-a',
      'candidate-b',
      'candidate-c',
    ])
  })

  it.each(['stance', 'conservative'] as const)(
    'excludes candidates below minimum coverage in %s mode',
    (mode) => {
      const candidates: CandidatePolicyPositions[] = [
        {
          candidateId: 'sufficient-data',
          positions: {
            'housing-supply': 2,
            'social-housing': 2,
          },
        },
        {
          candidateId: 'insufficient-data',
          positions: {
            'housing-supply': 2,
          },
        },
      ]

      const result = rankCandidates(preferences, candidates, mode)

      expect(result).toHaveLength(1)
      expect(result[0].candidateId).toBe('sufficient-data')
    },
  )

  it('ranks by known stance match when using stance mode', () => {
    const candidates: CandidatePolicyPositions[] = [
      {
        candidateId: 'partial-match',
        positions: {
          'housing-supply': 2,
          'social-housing': 2,
        },
      },
      {
        candidateId: 'conservative-match',
        positions: {
          'housing-supply': 1,
          'social-housing': 1,
          'rental-protections': 1,
        },
      },
    ]

    const result = rankCandidates(preferences, candidates, 'stance')

    expect(result[0].candidateId).toBe('partial-match')
  })

  it('ranks by conservative match when using conservativeness mode', () => {
    const candidates: CandidatePolicyPositions[] = [
      {
        candidateId: 'inconservative',
        positions: {
          'housing-supply': 2,
          'social-housing': 2,
        },
      },
      {
        candidateId: 'conservative',
        positions: {
          'housing-supply': 1,
          'social-housing': 1,
          'rental-protections': 1,
        },
      },
    ]

    const result = rankCandidates(preferences, candidates, 'conservative')

    expect(result[0].candidateId).toBe('conservative')
  })

  it('applies the minimum coverage threshold when ranking candidates', () => {
    const partiallyAssessedCandidate: CandidatePolicyPositions = {
      candidateId: 'partial',
      positions: {
        'housing-supply': 2,
        'social-housing': 2,
      },
    }

    const candidates = [candidate, partiallyAssessedCandidate]

    const resultsAt40 = rankCandidates(
      preferences,
      candidates,
      'stance',
      0.4,
    )

    const resultsAt80 = rankCandidates(
      preferences,
      candidates,
      'stance',
      0.8,
    )

    expect(resultsAt40.map((result) => result.candidateId)).toContain('partial')
    expect(resultsAt80.map((result) => result.candidateId)).not.toContain('partial')
  })

  it('excludes candidates below minimum coverage', () => {
    const preferences: UserPolicyPreference[] = [
      { policyId: 'housing-supply', score: 2, importance: 1 },
      { policyId: 'social-housing', score: 2, importance: 1 },
      { policyId: 'rental-protections', score: 2, importance: 1 },
      { policyId: 'transport-frequency', score: 2, importance: 1 },
      { policyId: 'transport-investment', score: 2, importance: 1 },
    ]

    const candidates: CandidatePolicyPositions[] = [
      {
        candidateId: 'low-coverage',
        positions: {
          'housing-supply': 2,
          'social-housing': 2,
        },
      },
    ]

    expect(rankCandidates(preferences, candidates)).toEqual([])
  })

  it('rejects invalid ranking modes', () => {
    expect(() =>
      rankCandidates(
        preferences,
        [candidate],
        'invalid' as RankingMode,
      ),
    ).toThrow('Invalid ranking mode')
  })
})

describe('calculatePolicyMatch', () => {
  it.each([-0.1, 1.1, Number.NaN, Infinity])(
    'rejects invalid minimum coverage threshold: %s',
    (threshold) => {
      expect(() =>
        calculatePolicyMatch(preferences, candidate, threshold),
      ).toThrow('Invalid minimum coverage')
    },
  )

  it('returns zero distance for identical positions', () => {
    const result = calculatePolicyMatch(preferences, {
      candidateId: 'identical',
      positions: {
        'housing-supply': 2,
        'social-housing': 2,
        'rental-protections': 2,
      },
    })

    expect(result?.distance).toBe(0)
    expect(result?.coverage).toBe(1)
  })

  it('keeps all match distances within the valid 0–4 range', () => {
    const testCandidates: CandidatePolicyPositions[] = [
      {
        candidateId: 'identical',
        positions: {
          'housing-supply': 2,
          'social-housing': 2,
          'rental-protections': 2,
        },
      },
      {
        candidateId: 'opposite',
        positions: {
          'housing-supply': -2,
          'social-housing': -2,
          'rental-protections': -2,
        },
      },
      {
        candidateId: 'partial',
        positions: {
          'housing-supply': -2,
          'social-housing': 0,
        },
      },
    ]

    for (const testCandidate of testCandidates) {
      const result = calculatePolicyMatch(preferences, testCandidate)

      expect(result).not.toBeNull()

      if (!result) continue

      expect(result.distance).toBeGreaterThanOrEqual(0)
      expect(result.distance).toBeLessThanOrEqual(4)

      expect(result.minimumPossibleDistance).toBeLessThanOrEqual(
        result.distance,
      )

      expect(result.maximumPossibleDistance).toBeGreaterThanOrEqual(
        result.distance,
      )

      expect(result.minimumPossibleMatch).toBeGreaterThanOrEqual(0)
      expect(result.maximumPossibleMatch).toBeLessThanOrEqual(100)

      expect(result.minimumPossibleMatch).toBeLessThanOrEqual(
        result.maximumPossibleMatch,
      )

      expect(result.coverage).toBeGreaterThan(0)
      expect(result.coverage).toBeLessThanOrEqual(1)
    }
  })

  it('returns 100% match for identical complete positions', () => {
    const result = calculatePolicyMatch(preferences, {
      candidateId: 'identical',
      positions: {
        'housing-supply': 2,
        'social-housing': 2,
        'rental-protections': 2,
      },
    })

    expect(result?.distance).toBe(0)
    expect(result?.minimumPossibleMatch).toBe(100)
    expect(result?.maximumPossibleMatch).toBe(100)
  })

  it('returns 0% match for completely opposite positions', () => {
    const result = calculatePolicyMatch(preferences, {
      candidateId: 'opposite',
      positions: {
        'housing-supply': -2,
        'social-housing': -2,
        'rental-protections': -2,
      },
    })

    expect(result?.distance).toBe(4)
    expect(result?.minimumPossibleMatch).toBe(0)
    expect(result?.maximumPossibleMatch).toBe(0)
  })

  it('calculates the best and worst possible match with missing policies', () => {
    const preferences: UserPolicyPreference[] = [
      { policyId: 'housing-supply', score: 2, importance: 1 },
      { policyId: 'social-housing', score: 2, importance: 1 },
      { policyId: 'rental-protections', score: 2, importance: 1 },
      { policyId: 'transport-frequency', score: 2, importance: 1 },
      { policyId: 'transport-investment', score: 2, importance: 1 },
    ]

    const candidate: CandidatePolicyPositions = {
      candidateId: 'candidate-1',
      positions: {
        'housing-supply': 2,
        'social-housing': 2,
        'rental-protections': 2,
      },
    }

    const result = calculatePolicyMatch(preferences, candidate)

    expect(result?.minimumPossibleMatch).toBe(36.754446796632415)
    expect(result?.maximumPossibleMatch).toBe(100)
    expect(result?.minimumPossibleDistance).toBe(0)
    expect(result?.maximumPossibleDistance).toBe(2.5298221281347035)
  })

  it('returns identical minimum and maximum matches with conservative coverage', () => {
    const preferences: UserPolicyPreference[] = [
      { policyId: 'housing-supply', score: 2, importance: 1 },
      { policyId: 'social-housing', score: 2, importance: 1 },
    ]

    const candidate: CandidatePolicyPositions = {
      candidateId: 'candidate-1',
      positions: {
        'housing-supply': 2,
        'social-housing': 0,
      },
    }

    const result = calculatePolicyMatch(preferences, candidate)

    expect(result?.minimumPossibleMatch).toBeCloseTo(64.64466094)
    expect(result?.maximumPossibleMatch).toBeCloseTo(64.64466094)
  })

  it('returns maximum distance for opposite positions', () => {
    const result = calculatePolicyMatch(preferences, {
      candidateId: 'opposite',
      positions: {
        'housing-supply': -2,
        'social-housing': -2,
        'rental-protections': -2,
      },
    })

    expect(result?.distance).toBe(4)
  })

  it('weights more important policies more heavily', () => {
    const preferences: UserPolicyPreference[] = [
      { policyId: 'housing-supply', score: 2, importance: 5 },
      { policyId: 'social-housing', score: 2, importance: 1 },
    ]

    const candidate: CandidatePolicyPositions = {
      candidateId: 'candidate-1',
      positions: {
        'housing-supply': -2,
        'social-housing': 2,
      },
    }

    const result = calculatePolicyMatch(preferences, candidate)

    expect(result?.distance).toBeCloseTo(Math.sqrt(80 / 6))
  })

  it('calculates coverage when a policy is missing', () => {
    const result = calculatePolicyMatch(preferences, {
      candidateId: 'partial',
      positions: {
        'housing-supply': 2,
        'social-housing': 2,
      },
    })

    expect(result?.coverage).toBeCloseTo(2 / 3)
    expect(result?.matchedPolicies).toBe(2)
  })

  it('returns null below minimum coverage', () => {
    const result = calculatePolicyMatch(preferences, {
      candidateId: 'partial',
      positions: { 'transport-frequency': -1 },
    })

    expect(result).toBeNull()
  })

  it('returns null when no policies are comparable', () => {
    expect(
      calculatePolicyMatch(preferences, {
        candidateId: 'unknown',
        positions: {},
      }),
    ).toBeNull()
  })

  it('rejects duplicate policy preferences', () => {
    expect(() =>
      calculatePolicyMatch(
        [
          { policyId: 'housing-supply', score: 2, importance: 5 },
          { policyId: 'housing-supply', score: 1, importance: 3 },
        ],
        candidate,
      ),
    ).toThrow()
  })

  it('treats an explicitly neutral position as a valid match', () => {
    const preferences: UserPolicyPreference[] = [
      { policyId: 'housing-supply', score: 0, importance: 1 },
      { policyId: 'social-housing', score: 0, importance: 1 },
      { policyId: 'rental-protections', score: 0, importance: 1 },
      { policyId: 'transport-frequency', score: 0, importance: 1 },
      { policyId: 'transport-investment', score: 0, importance: 1 },
    ]

    const candidate: CandidatePolicyPositions = {
      candidateId: 'candidate-1',
      positions: {
        'housing-supply': 0,
        'social-housing': 0,
        'rental-protections': 0,
        'transport-frequency': 0,
        'transport-investment': 0,
      },
    }

    expect(calculatePolicyMatch(preferences, candidate)).toEqual({
      distance: 0,
      minimumPossibleDistance: 0,
      maximumPossibleDistance: 0,
      minimumPossibleMatch: 100,
      maximumPossibleMatch: 100,
      coverage: 1,
      matchedPolicies: 5,
      weightedCoverage: 1,
    })
  })

  it('does not treat missing policies as neutral', () => {
    const preferences: UserPolicyPreference[] = [
      { policyId: 'housing-supply', score: 0, importance: 1 },
      { policyId: 'social-housing', score: 0, importance: 1 },
      { policyId: 'rental-protections', score: 0, importance: 1 },
      { policyId: 'transport-frequency', score: 0, importance: 1 },
      { policyId: 'transport-investment', score: 0, importance: 1 },
    ]

    const candidate: CandidatePolicyPositions = {
      candidateId: 'candidate-1',
      positions: {
        'housing-supply': 0,
        'social-housing': 0,
        'rental-protections': 0,
      },
    }

    const result = calculatePolicyMatch(preferences, candidate)

    expect(result).not.toBeNull()
    expect(result?.coverage).toBe(0.6)
    expect(result?.matchedPolicies).toBe(3)
  })

  it('returns null when candidate coverage is below 60%', () => {
    const preferences: UserPolicyPreference[] = [
      { policyId: 'housing-supply', score: 0, importance: 1 },
      { policyId: 'social-housing', score: 0, importance: 1 },
      { policyId: 'rental-protections', score: 0, importance: 1 },
      { policyId: 'transport-frequency', score: 0, importance: 1 },
      { policyId: 'transport-investment', score: 0, importance: 1 },
    ]

    const candidate: CandidatePolicyPositions = {
      candidateId: 'candidate-1',
      positions: {
        'housing-supply': 0,
        'social-housing': 0,
      },
    }

    expect(calculatePolicyMatch(preferences, candidate)).toBeNull()
  })

  it('accepts candidates with exactly 60% coverage', () => {
    const preferences: UserPolicyPreference[] = [
      { policyId: 'housing-supply', score: 2, importance: 1 },
      { policyId: 'social-housing', score: 2, importance: 1 },
      { policyId: 'rental-protections', score: 2, importance: 1 },
      { policyId: 'transport-frequency', score: 2, importance: 1 },
      { policyId: 'transport-investment', score: 2, importance: 1 },
    ]

    const candidate: CandidatePolicyPositions = {
      candidateId: 'boundary-test',
      positions: {
        'housing-supply': 2,
        'social-housing': 2,
        'rental-protections': 2,
      },
    }

    const result = calculatePolicyMatch(preferences, candidate)

    expect(result).not.toBeNull()
    expect(result?.coverage).toBe(0.6)
  })

  it('rejects invalid importance weights', () => {
    expect(() =>
      calculatePolicyMatch(
        [{ policyId: 'housing-supply', score: 2, importance: 0 }],
        candidate,
      ),
    ).toThrow()
  })

  it('rejects invalid candidate policy scores, even for unmatched policies', () => {
    const invalidCandidate = {
      candidateId: 'invalid',
      positions: {
        'housing-supply': 2,
        'transport-frequency': 3,
      },
    } as unknown as CandidatePolicyPositions

    expect(() =>
      calculatePolicyMatch(preferences, invalidCandidate),
    ).toThrow('Invalid candidate policy position')
  })

  it('rejects unknown candidate policy IDs', () => {
    const invalidCandidate = {
      candidateId: 'invalid',
      positions: {
        'unknown-policy': 1,
      },
    } as unknown as CandidatePolicyPositions

    expect(() =>
      calculatePolicyMatch(preferences, invalidCandidate),
    ).toThrow('Invalid candidate policy position')
  })
})
