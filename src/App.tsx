import { useState } from 'react'
import Icon from './components/Icon'
import ForYouPage from './pages/ForYouPage'
import CandidatesPage from './pages/CandidatesPage'
import ComparePage from './pages/ComparePage'
import AppHeader from './components/AppHeader'
import BottomNav from './components/BottomNav'

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
      <AppHeader
        page={page}
        onBack={() => navigate(page === 'Compare' ? 'Candidates' : 'For you')}
      />

      <div>
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
      </div>

      <BottomNav
        page={page}
        onNavigate={navigate}
        canCompare={selected.length === 2}
      />
    </div>
  )
}

export default App