import { useState } from 'react'
import storyImage from './assets/story.png'
import mayaImage from './assets/maya.png'
import danielImage from './assets/daniel.png'
import aishaImage from './assets/aisha.png'
import './App.css'

type Page = 'For you' | 'Candidates' | 'Compare'
type IconName = 'pin' | 'arrow' | 'back' | 'search' | 'users' | 'columns' | 'info' | 'home' | 'tram' | 'scale' | 'check' | 'chevron'

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    arrow: <><path d="M4 12h15M14 7l5 5-5 5"/></>, back: <><path d="M20 12H5M10 7l-5 5 5 5"/></>,
    search: <><circle cx="10.5" cy="10.5" r="7"/><path d="m16 16 4 4"/></>,
    users: <><circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6M17 14a5 5 0 0 1 4 5v1"/></>,
    columns: <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 3v18"/></>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></>,
    home: <><path d="m3 11 9-8 9 8M5 10v10h14V10M9 20v-6h6v6"/></>,
    tram: <><rect x="5" y="3" width="14" height="16" rx="3"/><path d="M5 11h14M9 3v8M8 19l-2 2M16 19l2 2M8 15h.01M16 15h.01"/></>,
    scale: <><path d="M12 3v17M7 21h10M4 7h16M6 7l-3 6h6L6 7Zm12 0-3 6h6l-3-6Z"/></>,
    check: <path d="m5 12 4 4L19 6"/>, chevron: <path d="m7 10 5 5 5-5"/>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

const candidates = [
  { name: 'Maya Chen', party: 'Community Voice', image: mayaImage, policies: [{ title: 'More local homes', text: 'Support more affordable homes near tram routes and services, with a focus on renters.' }, { title: 'Frequent services', text: 'Advocate for more frequent trams and step-free stops along Sydney Road.' }] },
  { name: 'Daniel Brooks', party: 'Independent', image: danielImage, policies: [{ title: 'Planning & supply', text: 'Support faster approvals for smaller homes and publish local housing targets.' }, { title: 'Better connections', text: 'Advocate for better bus connections to train stations and safer walks to stops.' }] },
  { name: 'Aisha Patel', party: 'Local Tomorrow', image: aishaImage, policies: [{ title: 'Homes for everyone', text: 'Support affordable housing and community input into local planning.' }, { title: 'Connected communities', text: 'Support accessible public transport and safer routes to local stops.' }] },
]

const stories = [
  { source: 'AusPol - Transport', date: 'Today', title: 'Tram upgrades could reshape Sydney Road travel times', text: 'A proposed upgrade would improve tram frequency and step-free access, with candidates debating how the changes should be funded and phased.' },
  { source: 'News2U - Housing', date: 'Yesterday', title: 'Renters call for stronger protections in new housing plan', text: 'Community groups are asking for clearer renter safeguards and more local consultation before the proposal moves forward.' },
  { source: 'KnewsFeed - Local Spaces', date: '2 days ago', title: 'Community garden upgrade wins local support', text: 'A proposed upgrade to the local garden would add more seating and better lighting, with candidates promising to protect community-led spaces.' },
]

function Notice({ news = false }: { news?: boolean }) {
  return <div className="notice"><Icon name="info" size={16}/><p>{news ? 'Illustrative news only. Not real reporting or endorsements. For you pages are designed to show how local context and issue-based updates could appear in VoteAssist.' : 'Illustrative candidates and policies only. Not an official ballot or voting advice.'}</p></div>
}

function App() {
  const [page, setPage] = useState<Page>('For you')
  const [selected, setSelected] = useState<number[]>([0, 1])
  const [filter, setFilter] = useState('')
  const [openStory, setOpenStory] = useState<string | null>(null)
  const [changeColumn, setChangeColumn] = useState<number | null>(null)
  const go = (next: Page) => { setPage(next); setChangeColumn(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const toggleCandidate = (index: number) => setSelected(current => current.includes(index) ? current.filter(item => item !== index) : current.length < 2 ? [...current, index] : current)
  const comparison = selected.length === 2 ? selected : [0, 1]
  const visibleStories = filter ? stories.filter(story => story.source.toLowerCase().includes(filter.toLowerCase())) : stories

  return <div className="app-shell">
    <div className="status-bar"><span>9:41</span><span className="status-icons"><span className="signal">▂▄▆█</span><span>◕</span><span className="battery" /></span></div>
    <header className="app-header">
      {page === 'For you' ? <div className="brand"><span className="brand-mark"><Icon name="check" size={22}/></span><span>VoteAssist</span></div> : <div className="header-title"><button className="icon-button" onClick={() => go(page === 'Compare' ? 'Candidates' : 'For you')} aria-label="Go back"><Icon name="back" size={20}/></button><strong>{page === 'Candidates' ? 'Your candidates' : 'Compare candidates'}</strong></div>}
      <div className="account"><span>Account</span><span className="avatar">{page === 'For you' ? 'RC' : 'MC'}</span></div>
    </header>

    {page === 'For you' && <main className="content" data-node-id="5:704">
      <section className="intro"><div className="eyebrow"><Icon name="pin" size={14}/> BRUNSWICK ELECTORATE</div><h1>News for you.<br/>Brunswick electorate.</h1><p>Local reporting and policy updates tailored to your electorate and the issues you care about. No endorsements, just clear context.</p><div className="chips">{['Housing', 'Transport', 'Local spaces'].map(issue => <button key={issue} className={filter === issue ? 'chip active' : 'chip'} onClick={() => setFilter(filter === issue ? '' : issue)}>{issue}</button>)}</div></section>
      {(!filter || filter === 'Housing') && <article className="card featured" data-node-id="5:725"><div className="card-meta"><span>Lorem Daily - Housing</span><span>Today</span></div><img className="story-image" src={storyImage} alt="A tree-lined Brunswick street with a tram"/><h2>New housing plan proposed for Brunswick precinct</h2><p>A draft proposal would add more affordable homes near tram routes while keeping community spaces intact. Candidates are already responding with different ideas on density and resident input.</p><div className="story-footer"><span>4 min read</span><button className="text-link muted-link" onClick={() => setOpenStory(openStory === 'featured' ? null : 'featured')}>Read story <Icon name="arrow" size={14}/></button></div>{openStory === 'featured' && <p className="expanded">This is an illustrative story created to show how local reporting could appear in VoteAssist.</p>}</article>}
      <section className="updates" data-node-id="5:737"><div className="section-heading"><h2>Latest updates</h2><span>Illustrative news</span></div>{visibleStories.map(story => <article className="card news-card" key={story.title}><div className="card-meta"><span>{story.source}</span><span>{story.date}</span></div><h3>{story.title}</h3><p>{story.text}</p><button className="text-link muted-link" onClick={() => setOpenStory(openStory === story.title ? null : story.title)}>Open article <Icon name="arrow" size={14}/></button>{openStory === story.title && <p className="expanded">This is an illustrative update, not a real news article.</p>}</article>)}</section>
      <Notice news />
    </main>}

    {page === 'Candidates' && <main className="content" data-node-id="5:764"><section className="results-intro"><div className="location"><Icon name="pin" size={15}/> <span>3056 · Brunswick, VIC</span></div><h1>Meet your local choices.</h1><p>Explore the example ballot, then select two candidates to compare their policies.</p></section><section className="candidate-list"><div className="list-meta"><strong>3 illustrative candidates</strong><span>Demo order · not ranked</span></div>{candidates.map((candidate, index) => <article className={`card candidate-card ${selected.includes(index) ? 'selected' : ''}`} key={candidate.name}><div className="candidate-details"><img src={candidate.image} alt=""/><div><h2>{candidate.name}</h2><p>{candidate.party}</p><span>ILLUSTRATIVE CANDIDATE</span></div></div><div className="candidate-actions"><button className="text-link" onClick={() => { setSelected(index === 0 ? [0, 1] : [index, 0]); go('Compare') }}>View policies <Icon name="arrow" size={14}/></button><button className="select-button" onClick={() => toggleCandidate(index)} aria-pressed={selected.includes(index)}><span className={`checkbox ${selected.includes(index) ? 'checked' : ''}`}>{selected.includes(index) && <Icon name="check" size={15}/>}</span>{selected.includes(index) ? 'Selected' : 'Compare'}</button></div></article>)}</section><section className="card selection-card"><div><span>{selected.length ? selected.map(i => candidates[i].name).join(' + ') : 'Choose two candidates'}</span><strong>{selected.length} of 2 selected</strong></div><button className="primary-button" disabled={selected.length !== 2} onClick={() => go('Compare')}>Compare candidates <Icon name="columns" size={18}/></button></section><Notice /></main>}

    {page === 'Compare' && <main className="content" data-node-id="5:861"><section className="compare-intro"><div className="eyebrow"><Icon name="pin" size={14}/> BRUNSWICK ELECTORATE</div><h1>The issues, side by side.</h1><p>Two perspectives on your neighbourhood. Compare policies, not personalities.</p></section><div className="compare-headings">{comparison.map((candidateIndex, column) => { const candidate = candidates[candidateIndex]; return <div className="card compare-person" key={column}><img src={candidate.image} alt=""/><h2>{candidate.name}</h2><p>{candidate.party}</p><button className="text-link" onClick={() => setChangeColumn(changeColumn === column ? null : column)}>Change <Icon name="chevron" size={13}/></button>{changeColumn === column && <div className="candidate-menu">{candidates.map((option, index) => <button key={option.name} disabled={comparison[1 - column] === index} onClick={() => { const next = [...comparison]; next[column] = index; setSelected(next); setChangeColumn(null) }}>{option.name}</button>)}</div>}</div> })}</div>{['Housing', 'Public transport'].map((issue, issueIndex) => <section className="card issue-card" key={issue}><div className="issue-heading"><Icon name={issueIndex === 0 ? 'home' : 'tram'} size={19}/><h2>{issue}</h2></div><div className="policy-grid">{comparison.map(index => <div className="policy" key={index}><h3>{candidates[index].policies[issueIndex].title}</h3><p>{candidates[index].policies[issueIndex].text}</p><span>Example policy</span></div>)}</div></section>)}<div className="guidance"><div><Icon name="scale" size={17}/><strong>Same issues. No scores or rankings.</strong></div><Notice /></div></main>}

    <nav className="bottom-nav" aria-label="Main navigation">{(['For you', 'Candidates', 'Compare'] as Page[]).map(item => <button key={item} className={page === item ? 'nav-item active' : 'nav-item'} onClick={() => go(item)} disabled={item === 'Compare' && selected.length !== 2}><span className="nav-icon"><Icon name={item === 'For you' ? 'search' : item === 'Candidates' ? 'users' : 'columns'} size={20}/></span><span>{item}</span></button>)}<div className="home-indicator"/></nav>
  </div>
}
export default App
