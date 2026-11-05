
import { candidates } from '../data/candidates'
import Icon from '../components/Icon'
import Notice from '../components/Notice'
import { useState } from 'react'

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

      {['Housing', 'Public transport'].map((issue, issueIndex) => (
        <section className="card issue-card" key={issue}>
          <div className="issue-heading">
            <Icon
              name={issueIndex === 0 ? 'home' : 'tram'}
              size={19}
            />
            <h2>{issue}</h2>
          </div>

          <div className="policy-grid">
            {comparison.map(index => (
              <div className="policy" key={index}>
                <h3>{candidates[index].policies[issueIndex].title}</h3>
                <p>{candidates[index].policies[issueIndex].text}</p>
                <span>Example policy</span>
              </div>
            ))}
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
