
import { useState } from 'react'
import Icon from './Icon'

export type Page =
  | 'For you'
  | 'Candidates'
  | 'Compare'
  | 'Preferences'
  | 'Matches'

interface AppHeaderProps {
  page: Page
  onNavigate: (page: Page) => void
  canCompare: boolean
}

function AppHeader({ page, onNavigate, canCompare }: AppHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const menuItems: Page[] = [
    'For you',
    'Candidates',
    'Compare',
    'Preferences',
    'Matches',
  ]

  return (
    <header className="app-header">
      <div className="brand">
        <span className="brand-mark">
          <Icon name="check" size={22} />
        </span>
        <span>VoteAssist</span>
      </div>

      <div className="header-menu">
        <button
          className="icon-button menu-button"
          aria-label="Open navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(open => !open)}
        >
          <Icon name="menu" size={23} />
        </button>

        {menuOpen && (
          <nav className="header-dropdown" aria-label="Main navigation">
            {menuItems.map(item => (
              <button
                key={item}
                className={page === item ? 'active' : ''}
                disabled={item === 'Compare' && !canCompare}
                onClick={() => {
                  onNavigate(item)
                  setMenuOpen(false)
                }}
              >
                {item}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}

export default AppHeader
