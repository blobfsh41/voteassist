
import { candidates } from '../data/candidates'
import Icon from '../components/Icon'
import Notice from '../components/Notice'
import { electorates } from '../data/electorates'

interface CandidatesPageProps {
  comparison: string[]
  electorateId: string | null
  onChangeCandidate: (column: number, candidateId: string) => void
  onViewPolicies: (candidateId: string) => void
  onCompare: () => void
}

export default function CandidatesPage({
  comparison,
  electorateId,
  onChangeCandidate,
  onViewPolicies,
  onCompare,
}: CandidatesPageProps) {
  const selected = comparison

  const electorate = electorates.find(
    item => item.id === electorateId,
  )

  const visibleCandidates = electorateId
    ? candidates.filter(
        candidate => candidate.electorateId === electorateId,
      )
    : []

  const toggleCandidate = (candidateId: string) => {
    const selectedColumn = selected.indexOf(candidateId)

    if (selectedColumn !== -1) {
      onChangeCandidate(selectedColumn, '')
      return
    }

    if (selected.length >= 2) return

    onChangeCandidate(selected.length, candidateId)
  }

  return (
    <main className="content candidates-page" data-node-id="5:764">
      <section className="results-intro">
        <div className="location">
          <Icon name="pin" size={15} />
          <span>
            {electorate?.name ?? 'Electorate not selected'}, VIC
          </span>
        </div>
        <h1>Meet your local choices.</h1>
        <p>
          {electorate
            ? `Explore candidates contesting ${electorate.name}, then select two to compare their policies.`
            : 'Select your electorate in Preferences to see your local candidates.'}
        </p>
      </section>

      <section className="candidate-list">
        <div className="list-meta">
          <strong>{visibleCandidates.length} candidates</strong>
          <span>2026 Victorian State Election · not ranked</span>
        </div>

        {electorateId && visibleCandidates.length === 0 && (
          <p>No candidates found for this electorate.</p>
        )}

        {!electorateId && (
          <p>Select an electorate in Preferences to see candidates.</p>
        )}

        {visibleCandidates.map(candidate => (
          <article
            className={`card candidate-card ${
              selected.includes(candidate.id) ? 'selected' : ''
            }`}
            key={candidate.id}
          >
            <div className="candidate-details">
              <div>
                <h2>{candidate.name}</h2>
                <p>{candidate.party}</p>
                <span>ILLUSTRATIVE CANDIDATE</span>
              </div>
            </div>

            <div className="candidate-actions">
              <button
                className="text-link"
                onClick={() => onViewPolicies(candidate.id)}
              >
                View policies <Icon name="arrow" size={14} />
              </button>

              <button
                className="select-button"
                onClick={() => toggleCandidate(candidate.id)}
                aria-pressed={selected.includes(candidate.id)}
                disabled={
                  !selected.includes(candidate.id) && selected.length >= 2
                }
              >
                <span
                  className={`checkbox ${
                    selected.includes(candidate.id) ? 'checked' : ''
                  }`}
                >
                  {selected.includes(candidate.id) && (
                    <Icon name="check" size={15} />
                  )}
                </span>
                {selected.includes(candidate.id) ? 'Selected' : 'Compare'}
              </button>
            </div>
          </article>
        ))}
      </section>

      <section className="card selection-card">
        <div aria-live="polite" aria-atomic="true">
          <span>
            {selected.length
              ? selected
                  .map(
                    id =>
                      candidates.find(candidate => candidate.id === id)?.name ??
                      id,
                  )
                  .join(' + ')
              : 'Choose two candidates'}
          </span>
          <strong>{selected.length} of 2 selected</strong>
        </div>

        <button
          className="primary-button"
          disabled={selected.length !== 2}
          onClick={onCompare}
        >
          Compare candidates <Icon name="columns" size={18} />
        </button>
      </section>

      <Notice />
    </main>
  )
}
