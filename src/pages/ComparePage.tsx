
import { candidates } from '../data/candidates'
import Icon from '../components/Icon'
import Notice from '../components/Notice'
import { useState } from 'react'
import { policyCategories } from '../data/policies'

interface ComparePageProps {
  comparison: number[]
  onChangeCandidate: (column: number, candidateIndex: number) => void
}

export default function ComparePage({
  comparison,
  onChangeCandidate,
}: ComparePageProps) {
  const [changeColumn, setChangeColumn] = useState<number | null>(null)
  return (
    <main className="content" data-node-id="5:861">
      <section className="compare-intro">
        <div className="eyebrow">
          <Icon name="pin" size={14} /> BRUNSWICK ELECTORATE
        </div>
        <h1>The issues, side by side.</h1>
        <p>
          Two perspectives on your neighbourhood. Compare policies, not
          personalities.
        </p>
      </section>

      <div className="compare-headings">
        {comparison.map((candidateIndex, column) => {
          const candidate = candidates[candidateIndex]

          return (
            <div className="card compare-person" key={column}>
              <img src={candidate.image} alt={candidate.name} />
              <h2>{candidate.name}</h2>
              <p>{candidate.party}</p>

              <button
                className="text-link"
                onClick={() =>
                  setChangeColumn(changeColumn === column ? null : column)
                }
              >
                Change <Icon name="chevron" size={13} />
              </button>

              {changeColumn === column && (
                <div className="candidate-menu">
                  {candidates.map((option, index) => (
                    <button
                      key={option.name}
                      disabled={comparison[1 - column] === index}
                      onClick={() => onChangeCandidate(column, index)}
                    >
                      {option.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      
    {policyCategories.map(category => (
      <section className="card issue-card" key={category.id}>
        <div className="issue-heading">
          <Icon
            name={category.id === 'housing' ? 'home' : 'tram'}
            size={19}
          />
          <h2>{category.title}</h2>
        </div>

        <p>{category.description}</p>

        <div className="policy-grid">
          {comparison.map(candidateIndex => {
            const candidate = candidates[candidateIndex]
            const policy = candidate.policies[category.id]

            return (
              <div className="policy" key={candidateIndex}>
                {policy ? (
                  <>
                    <h3>{policy.title}</h3>
                    <p>{policy.text}</p>
                  </>
                ) : (
                  <p>No published position available.</p>
                )}
              </div>
            )
          })}
        </div>
      </section>
    ))}


      <div className="guidance">
        <div>
          <Icon name="scale" size={17} />
          <strong>Same issues. No scores or rankings.</strong>
        </div>
        <Notice />
      </div>
    </main>
  )
}
