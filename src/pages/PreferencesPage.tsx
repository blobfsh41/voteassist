import {
  policyQuestions,
  type PolicyQuestionId,
  type PolicyScore,
} from '../data/policies'
import type { UserProfile } from '../data/profileTypes'

interface PreferencesPageProps {
  profile: UserProfile
  onUpdatePreference: (
    policyId: PolicyQuestionId,
    update: { score?: PolicyScore | null; importance?: number },
  ) => void
}

const stanceOptions: {
  score: PolicyScore
  label: string
}[] = [
  { score: -2, label: 'Strongly oppose' },
  { score: -1, label: 'Somewhat oppose' },
  { score: 0, label: 'Neutral' },
  { score: 1, label: 'Somewhat support' },
  { score: 2, label: 'Strongly support' },
]

export default function PreferencesPage({
  profile,
  onUpdatePreference,
}: PreferencesPageProps) {
  return (
    <main className="content">
      <h1>My preferences</h1>
      <p>Tell VoteAssist which issues matter to you.</p>

      {policyQuestions.map((policy) => {
        const preference =
          profile.preferences.policyPreferences[policy.id]

        return (
          <section key={policy.id} className="preference-card">
            <h2>{policy.title}</h2>

            <div className="stance-options">
              {stanceOptions.map((option) => (
                <button
                  key={option.score}
                  type="button"
                  aria-pressed={preference?.score === option.score}
                  className={
                    preference?.score === option.score
                      ? 'selected'
                      : ''
                  }
                  onClick={() =>
                    onUpdatePreference(policy.id, {
                      score: option.score,
                    })
                  }
                >
                  {option.label}
                </button>
              ))}
            </div>

            <label htmlFor={`importance-${policy.id}`}>
              Importance: {preference?.importance ?? 3}/5
              <input
                id={`importance-${policy.id}`}
                type="range"
                min={1}
                max={5}
                step={1}
                value={preference?.importance ?? 3}
                onChange={(event) =>
                  onUpdatePreference(policy.id, {
                    importance: Number(event.target.value),
                  })
                }
              />
            </label>

            {preference?.score != null && (
              <button
                type="button"
                onClick={() =>
                  onUpdatePreference(policy.id, {
                    score: null,
                  })
                }
              >
                Clear response
              </button>
            )}
          </section>
        )
      })}
    </main>
  )
}