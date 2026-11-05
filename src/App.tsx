import { useState } from 'react'
import { candidates } from './data/candidates'
import Icon from './components/Icon'
import Notice from './components/Notice'
import ForYouPage from './pages/ForYouPage'
import CandidatesPage from './pages/CandidatesPage'


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
    {page === 'Compare' && <main className="content" data-node-id="5:861"><section className="compare-intro"><div className="eyebrow"><Icon name="pin" size={14}/> BRUNSWICK ELECTORATE</div><h1>The issues, side by side.</h1><p>Two perspectives on your neighbourhood. Compare policies, not personalities.</p></section><div className="compare-headings">{comparison.map((candidateIndex, column) => { const candidate = candidates[candidateIndex]; return <div className="card compare-person" key={column}><img src={candidate.image} alt=""/><h2>{candidate.name}</h2><p>{candidate.party}</p><button className="text-link" onClick={() => setChangeColumn(changeColumn === column ? null : column)}>Change <Icon name="chevron" size={13}/></button>{changeColumn === column && <div className="candidate-menu">{candidates.map((option, index) => <button key={option.name} disabled={comparison[1 - column] === index} onClick={() => { const next = [...comparison]; next[column] = index; setSelected(next); setChangeColumn(null) }}>{option.name}</button>)}</div>}</div> })}</div>{['Housing', 'Public transport'].map((issue, issueIndex) => <section className="card issue-card" key={issue}><div className="issue-heading"><Icon name={issueIndex === 0 ? 'home' : 'tram'} size={19}/><h2>{issue}</h2></div><div className="policy-grid">{comparison.map(index => <div className="policy" key={index}><h3>{candidates[index].policies[issueIndex].title}</h3><p>{candidates[index].policies[issueIndex].text}</p><span>Example policy</span></div>)}</div></section>)}<div className="guidance"><div><Icon name="scale" size={17}/><strong>Same issues. No scores or rankings.</strong></div><Notice /></div></main>}

    <nav className="bottom-nav" aria-label="Main navigation">{(['For you', 'Candidates', 'Compare'] as Page[]).map(item => <button key={item} className={page === item ? 'nav-item active' : 'nav-item'} onClick={() => go(item)} disabled={item === 'Compare' && selected.length !== 2}><span className="nav-icon"><Icon name={item === 'For you' ? 'search' : item === 'Candidates' ? 'users' : 'columns'} size={20}/></span><span>{item}</span></button>)}<div className="home-indicator"/></nav>
  </div>
}
export default App
