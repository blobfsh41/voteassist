
import { describe, expect, it } from 'vitest'
import {
  setPolicyImportance,
  setPolicyStance,
  toUserPolicyPreferences,
} from './policyPreferences'
import type { UserProfile } from '../data/profileTypes'

const profile: UserProfile = {
  id: 'test',
  createdAt: '2026-11-10',
  electorateId: null,
  preferences: {
    followedCandidates: [],
    followedPolicies: [],
    bookmarkedStories: [],
    policyPreferences: {},
  },
}

describe('policy preferences', () => {
  it('stores a stance and importance', () => {
    const withStance = setPolicyStance(profile, 'housing-supply', 2)
    const updated = setPolicyImportance(
      withStance,
      'housing-supply',
      5,
    )

    expect(updated.preferences.policyPreferences['housing-supply'])
      .toEqual({ score: 2, importance: 5 })
  })

  it('preserves importance when setting a stance', () => {
    const withImportance = setPolicyImportance(
      profile,
      'housing-supply',
      4,
    )

    const updated = setPolicyStance(withImportance, 'housing-supply', 1)

    expect(updated.preferences.policyPreferences['housing-supply'])
      .toEqual({ importance: 4, score: 1 })
  })

  it('preserves stance when setting importance', () => {
    const withStance = setPolicyStance(profile, 'housing-supply', -1)

    const updated = setPolicyImportance(
      withStance,
      'housing-supply',
      3,
    )

    expect(updated.preferences.policyPreferences['housing-supply'])
      .toEqual({ score: -1, importance: 3 })
  })

  it('does not create a neutral answer when setting importance alone', () => {
    const updated = setPolicyImportance(profile, 'housing-supply', 5)

    expect(updated.preferences.policyPreferences['housing-supply'])
      .toEqual({ score: null, importance: 5 })
  })

  it('retains explicit neutrality', () => {
    const withNeutralStance = setPolicyStance(profile, 'housing-supply', 0)
    const updated = setPolicyImportance(
      withNeutralStance,
      'housing-supply',
      2,
    )

    expect(updated.preferences.policyPreferences['housing-supply'])
      .toEqual({ score: 0, importance: 2 })
  })

  it('converts only answered preferences for matching', () => {
    const updated = {
      ...profile,
      preferences: {
        ...profile.preferences,
        policyPreferences: {
          'housing-supply': { score: null, importance: 5 },
          'social-housing': { score: 0 as const, importance: 4 },
          'rental-protections': { score: -1 as const, importance: 2 },
        },
      },
    }

    expect(toUserPolicyPreferences(updated)).toEqual([
      { policyId: 'social-housing', score: 0, importance: 4 },
      { policyId: 'rental-protections', score: -1, importance: 2 },
    ])
  })

  it('preserves other preferences', () => {
    const original = {
      ...profile,
      preferences: {
        ...profile.preferences,
        followedCandidates: ['maya-chen'],
      },
    }

    const updated = setPolicyStance(original, 'housing-supply', -1)

    expect(updated.preferences.followedCandidates).toEqual(['maya-chen'])
  })

  it('rejects invalid importance', () => {
    expect(() =>
      setPolicyImportance(profile, 'housing-supply', 0),
    ).toThrow('Invalid policy importance')
  })

  it('rejects importance values outside the valid range', () => {
    expect(() =>
      setPolicyImportance(profile, 'housing-supply', 6),
    ).toThrow('Invalid policy importance')
  })

  it('rejects invalid stance', () => {
    expect(() =>
      setPolicyStance(profile, 'housing-supply', 3 as never),
    ).toThrow('Invalid policy score')
  })

  it('rejects scores below the valid range', () => {
    expect(() =>
      setPolicyStance(profile, 'housing-supply', -3 as never),
    ).toThrow('Invalid policy score')
  })
})
