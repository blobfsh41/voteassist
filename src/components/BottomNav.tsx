import Icon from './Icon'

type Page = 'For you' | 'Candidates' | 'Compare'

interface BottomNavProps {
  page: Page
  onNavigate: (page: Page) => void
  canCompare: boolean
}

function BottomNav({ page, onNavigate, canCompare }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {(['For you', 'Candidates', 'Compare'] as Page[]).map(item => (
        <button
          key={item}
          className={page === item ? 'nav-item active' : 'nav-item'}
          onClick={() => onNavigate(item)}
          disabled={item === 'Compare' && !canCompare}
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
  )
}

export default BottomNav