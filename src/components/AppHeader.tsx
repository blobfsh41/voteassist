import Icon from './Icon'

type Page = 'For you' | 'Candidates' | 'Compare'

interface AppHeaderProps {
  page: Page
  onBack: () => void
}

function AppHeader({ page, onBack }: AppHeaderProps) {
  return (
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
            onClick={onBack}
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
  )
}

export default AppHeader