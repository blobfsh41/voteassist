
import { candidates } from '../data/candidates'
import { useState } from 'react'
import Icon from '../components/Icon'
import Notice from '../components/Notice'

interface CandidatesPageProps {
  comparison: string[]
  onChangeCandidate: (column: number, candidateId: string) => void
  onViewPolicies: (candidateId: string) => void
  onCompare: () => void
}

export default function CandidatesPage({
  comparison,
  onChangeCandidate,
  onViewPolicies,
  onCompare,
}: CandidatesPageProps) {
  const [pendingCandidate, setPendingCandidate] = useState<string | null>(null)
  const selected = comparison

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
    <main className="content" data-node-id="5:764">
      <section className="results-intro">
        <div className="location">
          <Icon name="pin" size={15} />
          <span>3056 · Brunswick, VIC</span>
        </div>
        <h1>Meet your local choices.</h1>
        <p>
          Explore the example ballot, then select two candidates to compare
          their policies.
        </p>
      </section>

      <section className="candidate-list">
        <div className="list-meta">
          <strong>3 illustrative candidates</strong>
          <span>Demo order · not ranked</span>
        </div>

        {candidates.map(candidate => (
          <article
            className={`card candidate-card ${
              selected.includes(candidate.id) ? 'selected' : ''
            }`}
            key={candidate.id}
          >
            <div className="candidate-details">
              <img src={candidate.image} alt={candidate.name} />
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
        {pendingCandidate && (
          <section className="card candidate-replace-prompt">
            <strong>Replace which candidate?</strong>
            <p>Choose which candidate to remove from your comparison.</p>

            <div className="candidate-replace-options">
              {selected.map((candidateId, column) => {
                const candidate = candidates.find(
                  item => item.id === candidateId,
                )

                return (
                  <button
                    key={candidateId}
                    onClick={() => {
                      onChangeCandidate(column, pendingCandidate)
                      setPendingCandidate(null)
                    }}
                  >
                    Replace {candidate?.name ?? candidateId}
                  </button>
                )
              })}
            </div>

            <button
              className="text-link"
              onClick={() => setPendingCandidate(null)}
            >
              Cancel
            </button>
          </section>
        )}
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
