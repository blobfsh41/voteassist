import { describe, expect, it } from 'vitest'
import { changeCandidateSelection } from './candidateSelection'

describe('changeCandidateSelection', () => {
  it('adds a candidate to an empty selection', () => {
    expect(changeCandidateSelection([], 0, 'maya-chen')).toEqual([
      'maya-chen',
    ])
  })

  it('adds a second candidate', () => {
    expect(changeCandidateSelection(['maya-chen'], 1, 'daniel-brooks')).toEqual([
      'maya-chen',
      'daniel-brooks',
    ])
  })

  it('removes a selected candidate', () => {
    expect(
      changeCandidateSelection(['maya-chen', 'daniel-brooks'], 0, ''),
    ).toEqual(['daniel-brooks'])
  })

  it('replaces a candidate in an existing column', () => {
    expect(
      changeCandidateSelection(['maya-chen', 'daniel-brooks'], 0, 'aisha-patel'),
    ).toEqual(['aisha-patel', 'daniel-brooks'])
  })

  it('does not allow more than two candidates', () => {
    expect(
      changeCandidateSelection(['maya-chen', 'daniel-brooks'], 2, 'aisha-patel'),
    ).toEqual(['maya-chen', 'daniel-brooks'])
  })

  it('does not allow duplicate candidates', () => {
    expect(
      changeCandidateSelection(['maya-chen'], 1, 'maya-chen'),
    ).toEqual(['maya-chen'])
  })

  it('ignores invalid column indexes', () => {
    expect(
      changeCandidateSelection(['maya-chen'], 5, 'aisha-patel'),
    ).toEqual(['maya-chen'])
  })

  it('does not replace a candidate with one already in another column', () => {
    expect(
      changeCandidateSelection(
        ['maya-chen', 'daniel-brooks'],
        0,
        'daniel-brooks',
      ),
    ).toEqual(['maya-chen', 'daniel-brooks'])
  })

  it('ignores removal with an invalid column index', () => {
    expect(
      changeCandidateSelection(['maya-chen', 'daniel-brooks'], 5, ''),
    ).toEqual(['maya-chen', 'daniel-brooks'])
  })

  it('does not change the selection when adding at an invalid position', () => {
    expect(
      changeCandidateSelection(['maya-chen'], 3, 'aisha-patel'),
    ).toEqual(['maya-chen'])
  })
})