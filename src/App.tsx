import { useState } from 'react'
import Icon from './components/Icon'
import ForYouPage from './pages/ForYouPage'
import CandidatesPage from './pages/CandidatesPage'
import ComparePage from './pages/ComparePage'

type Page = 'For you' | 'Candidates' | 'Compare'

function App() {
  const [page, setPage] = useState<Page>('For you')
  const [selected, setSelected] = useState<number[]>([0, 1])

  const navigate = (nextPage: Page) => {
    setPage(nextPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const changeCandidate = (column: number, candidateIndex: number) => {
    setSelected(current =>
      current.map((candidate, index) =>
        index === column ? candidateIndex : candidate,
      ),
    )
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        {page === 'For you' ? (
          <div className="brand">
            <span className="brand-mark">
              <Icon name="check" size={22} />
            </span>
            <span>VoteAssist</span>
          </div>
        ) : (
          <div className="header-title">
            <button
              className="icon-button"
              onClick={() =>
                navigate(page === 'Compare' ? 'Candidates' : 'For you')
              }
              aria-label="Go back"
            >
              <Icon name="back" size={20} />
            </button>
            <strong>
              {page === 'Candidates'
                ? 'Your candidates'
                : 'Compare candidates'}
            </strong>
          </div>
        )}

        <div className="account">
          <span>Account</span>
          <span className="avatar">
            {page === 'For you' ? 'RC' : 'MC'}
          </span>
        </div>
      </header>

      <main>
        {page === 'For you' && <ForYouPage />}

        {page === 'Candidates' && (
          <CandidatesPage
            comparison={selected}
            onChangeCandidate={changeCandidate}
            onCompare={() => navigate('Compare')}
            onViewPolicies={index => {
              setSelected(index === 0 ? [0, 1] : [index, 0])
              navigate('Compare')
            }}
          />
        )}

        {page === 'Compare' && (
          <ComparePage
            comparison={selected}
            onChangeCandidate={changeCandidate}
          />
        )}
      </main>

      <nav className="bottom-nav" aria-label="Main navigation">
        {(['For you', 'Candidates', 'Compare'] as Page[]).map(item => (
          <button
            key={item}
            className={page === item ? 'nav-item active' : 'nav-item'}
            onClick={() => navigate(item)}
            disabled={item === 'Compare' && selected.length !== 2}
          >
            <span className="nav-icon">
              <Icon
                name={
                  item === 'For you'
                    ? 'search'
                    : item === 'Candidates'
                      ? 'users'
                      : 'columns'
                }
                size={20}
              />
            </span>
            <span>{item}</span>
          </button>
        ))}

        <div className="home-indicator" />
      </nav>
    </div>
  )
}

export default App