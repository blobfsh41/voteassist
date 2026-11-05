
import { candidates } from '../data/candidates'
import Icon from '../components/Icon'
import Notice from '../components/Notice'

interface CandidatesPageProps {
  selected: number[]
  toggleCandidate: (index: number) => void
  onCompare: () => void
  onViewPolicies: (index: number) => void
}

export default function CandidatesPage({
  selected,
  toggleCandidate,
  onCompare,
  onViewPolicies,
}: CandidatesPageProps) {
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

        {candidates.map((candidate, index) => (
          <article
            className={`card candidate-card ${
              selected.includes(index) ? 'selected' : ''
            }`}
            key={candidate.name}
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
                onClick={() => onViewPolicies(index)}
              >
                View policies <Icon name="arrow" size={14} />
              </button>

              <button
                className="select-button"
                onClick={() => toggleCandidate(index)}
                aria-pressed={selected.includes(index)}
              >
                <span
                  className={`checkbox ${
                    selected.includes(index) ? 'checked' : ''
                  }`}
                >
                  {selected.includes(index) && (
                    <Icon name="check" size={15} />
                  )}
                </span>
                {selected.includes(index) ? 'Selected' : 'Compare'}
              </button>
            </div>
          </article>
        ))}
      </section>

      <section className="card selection-card">
        <div>
          <span>
            {selected.length
              ? selected.map(i => candidates[i].name).join(' + ')
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