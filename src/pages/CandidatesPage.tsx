
import { candidates } from '../data/candidates'
import { electorates } from '../data/electorates'
import Icon from '../components/Icon'

interface CandidatesPageProps {
  comparison: string[]
  electorateId: string | null
  onChangeCandidate: (column: number, candidateId: string) => void
  onViewPolicies: (candidateId: string) => void
  onCompare: () => void
}

function getCandidateStatusLabel(status: string) {
  switch (status) {
    case 'active':
      return 'Nominated'
    case 'withdrawn':
      return 'Withdrawn'
    case 'former':
      return 'Former candidate'
    default:
      return 'Status unconfirmed'
  }
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase()
}

export default function CandidatesPage({
  comparison,
  electorateId,
  onChangeCandidate,
  onViewPolicies,
  onCompare,
}: CandidatesPageProps) {
  const electorate = electorates.find(item => item.id === electorateId)

  const visibleCandidates = electorateId
    ? candidates.filter(candidate => candidate.electorateId === electorateId)
    : []

  const toggleCandidate = (candidateId: string) => {
    const selectedColumn = comparison.indexOf(candidateId)

    if (selectedColumn !== -1) {
      onChangeCandidate(selectedColumn, '')
      return
    }

    if (comparison.length >= 2) return

    onChangeCandidate(comparison.length, candidateId)
  }

  const selectedCandidates = comparison
    .map(id => candidates.find(candidate => candidate.id === id))
    .filter(candidate => candidate !== undefined)

  return (
    <main className="content candidates-page">
      <section className="candidates-hero">
        <div>
          <span className="eyebrow">2026 VICTORIAN STATE ELECTION</span>
          <h1>Know who is<br />standing in your electorate.</h1>
          <p>
            Explore the candidates, understand their affiliations
            and compare their published policy positions.
          </p>
        </div>

        <div className="candidates-location">
          <Icon name="pin" size={17} />
          <div>
            <span>YOUR ELECTORATE</span>
            <strong>{electorate?.name ?? 'Not selected'}</strong>
            <small>Victoria, Australia</small>
          </div>
        </div>
      </section>

      <section className="candidate-directory">
        <div className="candidate-directory-heading">
          <div>
            <span className="eyebrow">THE CANDIDATES</span>
            <h2>
              {electorate ? electorate.name : 'Your local candidates'}
            </h2>
          </div>

          <div className="candidate-count">
            <strong>{visibleCandidates.length}</strong>
            <span>
              {visibleCandidates.length === 1 ? 'candidate' : 'candidates'}
            </span>
          </div>
        </div>

        {!electorateId && (
          <div className="candidate-empty">
            <h3>Choose your electorate first.</h3>
            <p>
              Select your Legislative Assembly electorate in Preferences
              to see the candidates contesting your district.
            </p>
          </div>
        )}

        {electorateId && visibleCandidates.length === 0 && (
          <div className="candidate-empty">
            <h3>No candidates found.</h3>
            <p>
              There are currently no candidate records associated with
              this electorate.
            </p>
          </div>
        )}

        {visibleCandidates.length > 0 && (
          <div className="candidate-grid">
            {visibleCandidates.map((candidate, index) => {
              const isSelected = comparison.includes(candidate.id)
              const selectionDisabled =
                !isSelected && comparison.length >= 2

              return (
                <article
                  className={`candidate-profile ${
                    isSelected ? 'is-selected' : ''
                  }`}
                  key={candidate.id}
                >
                  <div className="candidate-profile-top">
                    <span className="candidate-index">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <span
                      className={`candidate-selection-indicator ${
                        isSelected ? 'active' : ''
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Icon name="check" size={13} />
                          Selected
                        </>
                      ) : (
                        'Candidate'
                      )}
                    </span>
                  </div>

                  <div className="candidate-monogram" aria-hidden="true">
                    {getInitials(candidate.name)}
                  </div>

                  <div className="candidate-profile-details">
                    <h3>{candidate.name}</h3>
                    <p className="candidate-party">{candidate.party}</p>
                    <span className="candidate-status">
                      {getCandidateStatusLabel(candidate.status)}
                    </span>
                  </div>

                  <div className="candidate-profile-footer">
                    <button
                      className="candidate-view-link"
                      onClick={() => onViewPolicies(candidate.id)}
                    >
                      View policy positions
                      <Icon name="arrow" size={15} />
                    </button>

                    <button
                      className={`candidate-compare-button ${
                        isSelected ? 'selected' : ''
                      }`}
                      onClick={() => toggleCandidate(candidate.id)}
                      disabled={selectionDisabled}
                      aria-pressed={isSelected}
                      aria-label={
                        isSelected
                          ? `Remove ${candidate.name} from comparison`
                          : `Add ${candidate.name} to comparison`
                      }
                    >
                      {isSelected ? 'Remove' : 'Select'}
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      <section className="candidate-comparison-bar">
        <div className="comparison-bar-info">
          <span className="eyebrow">YOUR COMPARISON</span>

          <strong>
            {selectedCandidates.length === 0
              ? 'Select two candidates to begin.'
              : selectedCandidates.map(candidate => candidate.name).join(' vs ')}
          </strong>

          <small>{comparison.length} of 2 candidates selected</small>
        </div>

        <button
          className="candidate-comparison-action"
          disabled={comparison.length !== 2}
          onClick={onCompare}
        >
          Compare candidates
          <Icon name="arrow" size={16} />
        </button>
      </section>

      <p className="candidate-source-note">
        Candidate names and affiliations are based on VEC nomination
        records dated 9 November 2026. Nomination information is
        separate from policy assessments. VoteAssist is not an
        official electoral service or a source of voting advice.
      </p>
    </main>
  )
}
