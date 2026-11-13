
import { candidates } from '../data/candidates'
import Icon from '../components/Icon'
import Notice from '../components/Notice'
import { useState } from 'react'
import { policyCategories, policyQuestions } from '../data/policies'
import { candidatePolicyAssessments } from '../data/candidatePolicyAssessments'
import { electorates } from '../data/electorates'

interface ComparePageProps {
  comparison: string[]
  electorateId: string | null
  onChangeCandidate: (column: number, candidateId: string) => void
}

function getScoreLabel(score: number | null) {
  if (score === null) return 'Insufficient evidence'

  const labels: Record<number, string> = {
    [-2]: 'Strongly opposes',
    [-1]: 'Somewhat opposes',
    [0]: 'Neutral or mixed',
    [1]: 'Somewhat supports',
    [2]: 'Strongly supports',
  }

  return labels[score] ?? 'Unknown position'
}

export default function ComparePage({
  comparison,
  electorateId,
  onChangeCandidate,
}: ComparePageProps) {
  const [changeColumn, setChangeColumn] = useState<number | null>(null)
  const electorate = electorates.find(
    item => item.id === electorateId,
  )

  const visibleCandidates = electorateId
    ? candidates.filter(
        candidate => candidate.electorateId === electorateId,
      )
    : []

  return (
    <main className="content" data-node-id="5:861">
      <section className="compare-intro">
        <div className="eyebrow">
          <Icon name="pin" size={14} />
          {electorate?.name.toUpperCase() ?? 'NO ELECTORATE SELECTED'}
        </div>
        <h1>The issues, side by side.</h1>
        <p>
          Two perspectives on your neighbourhood. Compare policies, not
          personalities.
        </p>
      </section>

      <div className="compare-headings">
        {comparison.map((candidateId, column) => {
          const candidate = candidates.find(
            candidate => candidate.id === candidateId,
          )

          if (!candidate) return null

          return (
            <div className="card compare-person" key={candidateId}>
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
                  {visibleCandidates.map(option => (
                    <button
                      key={option.id}
                      disabled={comparison[1 - column] === option.id}
                      onClick={() => {
                        onChangeCandidate(column, option.id)
                        setChangeColumn(null)
                      }}
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

      {policyCategories.map(category => {
        const questions = policyQuestions.filter(
          question => question.categoryId === category.id,
        )

        return (
          <section className="card issue-card" key={category.id}>
            <div className="issue-heading">
              <Icon name={category.icon} size={19} />
              <h2>{category.title}</h2>
            </div>

            <p className="issue-description">{category.description}</p>

            {questions.map(question => (
              <div className="comparison-question" key={question.id}>
                <h3>{question.title}</h3>
                <p className="question-proposition">
                  {question.proposition}
                </p>

                <div className="policy-grid">
                  {comparison.map(candidateId => {
                    const assessment = candidatePolicyAssessments.find(
                      item =>
                        item.candidateId === candidateId &&
                        item.policyId === question.id &&
                        item.status === 'published',
                    )

                    return (
                      <div className="policy" key={candidateId}>
                        {assessment ? (
                          <>
                            <strong>
                              {getScoreLabel(assessment.score)}
                            </strong>

                            <p>{assessment.rationale}</p>

                            <div className="assessment-evidence">
                              <strong>Evidence</strong>
                              {assessment.evidence.map((source, index) => (
                                <p key={`${source.sourceUrl}-${index}`}>
                                  <a
                                    href={source.sourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {source.sourceTitle}
                                  </a>
                                  {source.publishedAt &&
                                    ` · ${source.publishedAt}`}
                                </p>
                              ))}
                            </div>

                            <small>
                              Assessed {assessment.assessedAt}
                            </small>
                          </>
                        ) : (
                          <p>No published assessment available.</p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </section>
        )
      })}

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
