import { useState } from 'react'
import Icon from './components/Icon'
import ForYouPage from './pages/ForYouPage'
import CandidatesPage from './pages/CandidatesPage'
import ComparePage from './pages/ComparePage'


type Page = 'For you' | 'Candidates' | 'Compare'

function App() {
  const [page, setPage] = useState<Page>('For you')
  const [selected, setSelected] = useState<number[]>([0, 1])
  const [filter, setFilter] = useState('')
  const [openStory, setOpenStory] = useState<string | null>(null)
  const [changeColumn, setChangeColumn] = useState<number | null>(null)
  const go = (next: Page) => { setPage(next); setChangeColumn(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const toggleCandidate = (index: number) => setSelected(current => current.includes(index) ? current.filter(item => item !== index) : current.length < 2 ? [...current, index] : current)
  const comparison = selected.length === 2 ? selected : [0, 1]

  return <div className="app-shell">
    <header className="app-header">
      {page === 'For you' ? <div className="brand"><span className="brand-mark"><Icon name="check" size={22}/></span><span>VoteAssist</span></div> : <div className="header-title"><button className="icon-button" onClick={() => go(page === 'Compare' ? 'Candidates' : 'For you')} aria-label="Go back"><Icon name="back" size={20}/></button><strong>{page === 'Candidates' ? 'Your candidates' : 'Compare candidates'}</strong></div>}
      <div className="account"><span>Account</span><span className="avatar">{page === 'For you' ? 'RC' : 'MC'}</span></div>
    </header>

    {page === 'For you' && (
      <ForYouPage
        filter={filter}
        setFilter={setFilter}
        openStory={openStory}
        setOpenStory={setOpenStory}
      />
    )}

    {page === 'Candidates' && (
      <CandidatesPage
        selected={selected}
        toggleCandidate={toggleCandidate}
        onCompare={() => go('Compare')}
        onViewPolicies={index => {
          setSelected(index === 0 ? [0, 1] : [index, 0])
          go('Compare')
        }}
      />
    )}
    {page === 'Compare' && (
      <ComparePage
        comparison={comparison}
        changeColumn={changeColumn}
        setChangeColumn={setChangeColumn}
        onChangeCandidate={(column, candidateIndex) => {
          const next = [...comparison]
          next[column] = candidateIndex
          setSelected(next)
          setChangeColumn(null)
        }}
      />
    )}

    <nav className="bottom-nav" aria-label="Main navigation">{(['For you', 'Candidates', 'Compare'] as Page[]).map(item => <button key={item} className={page === item ? 'nav-item active' : 'nav-item'} onClick={() => go(item)} disabled={item === 'Compare' && selected.length !== 2}><span className="nav-icon"><Icon name={item === 'For you' ? 'search' : item === 'Candidates' ? 'users' : 'columns'} size={20}/></span><span>{item}</span></button>)}<div className="home-indicator"/></nav>
  </div>
}
export default App
