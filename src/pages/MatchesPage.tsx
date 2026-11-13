
import { candidates } from '../data/candidates'
import { policyQuestions } from '../data/policies'
import type { UserProfile } from '../data/profileTypes'
import { toUserPolicyPreferences } from '../lib/policyPreferences'
import { rankAllCandidates } from '../lib/candidateMatching'

interface MatchesPageProps {
  profile: UserProfile
}

export default function MatchesPage({ profile }: MatchesPageProps) {
  const preferences = toUserPolicyPreferences(profile)
  const results = rankAllCandidates(preferences, profile.electorateId)
  const totalImportance = preferences.reduce(
    (total, preference) => total + preference.importance,
    0,
  )

  return (
    <main className="content">
      <h1>Your matches</h1>
      <p>
        Compare candidates based on your stated policy positions
        and issue priorities.
      </p>

      {!profile.electorateId && (
        <section className="match-empty">
          <h2>Select your electorate first</h2>
          <p>
            Choose your Victorian state electorate in Preferences
            to see candidate matches for your district.
          </p>
        </section>
      )}

      <section className="match-explanation">
        <h2>Understanding your results</h2>
        <p>
          <strong>Alignment range:</strong> The lowest and highest
          possible alignment scores, accounting for policies that
          have not yet been assessed. A wider range means more
          uncertainty.
        </p>
        <p>
          <strong>Coverage:</strong> The proportion of your answered
          issues that have a candidate assessment.
        </p>
        <p>
          <strong>Weighted coverage:</strong> Coverage adjusted for
          how important each issue is to you. Missing assessments
          on issues you care about more reduce this figure more.
        </p>
        <p>
          <strong>Important:</strong> Alignment measures similarity
          between your stated preferences and available policy
          assessments. It is not an endorsement or a prediction of
          how a candidate will govern.
        </p>
      </section>

      <section className="match-summary">
        <strong>
          {preferences.length} of {policyQuestions.length} issues answered
        </strong>
        <p>
          {totalImportance > 0
            ? 'Your issue importance is included in the matching calculation.'
            : 'Set your preferences to begin matching.'}
        </p>
      </section>

      {preferences.length === 0 && (
        <section className="match-empty">
          <h2>Set your preferences first</h2>
          <p>
            Answer some policy questions before calculating
            candidate alignment.
          </p>
        </section>
      )}

      {preferences.length > 0 && results.length === 0 && (
        <section className="match-empty">
          <h2>Candidate assessments unavailable</h2>
          <p>
            No candidates currently have enough assessed policy
            positions to meet the matching coverage requirement.
            This does not mean they disagree with your preferences.
          </p>
        </section>
      )}

      {results.length > 0 && (
        <section className="match-results">
          <h2>Candidate alignment</h2>

          {results.map((result, index) => {
            const candidate = candidates.find(
              item => item.id === result.candidateId,
            )

            if (!candidate) return null

            return (
              <article
                key={result.candidateId}
                className="match-card"
              >
                <div className="match-card-header">
                  <span className="match-rank">#{index + 1}</span>
                  <div>
                    <h3>{candidate.name}</h3>
                    <p>{candidate.party}</p>
                  </div>
                </div>

                <strong className="match-score">
                  {Math.round(result.minimumPossibleMatch)}–
                  {Math.round(result.maximumPossibleMatch)}
                  /100
                </strong>

                <p>Possible alignment range</p>

                <div className="match-metrics">
                  <span>
                    Coverage: {Math.round(result.coverage * 100)}%
                  </span>
                  <span>
                    Weighted coverage:{' '}
                    {Math.round(result.weightedCoverage * 100)}%
                  </span>
                  <span>
                    Policies matched: {result.matchedPolicies}
                  </span>
                </div>
              </article>
            )
          })}
        </section>
      )}
    </main>
  )
}
