
import { useState } from 'react'
import ForYouPage from './pages/ForYouPage'
import CandidatesPage from './pages/CandidatesPage'
import ComparePage from './pages/ComparePage'
import AppHeader from './components/AppHeader'
import BottomNav from './components/BottomNav'
import { candidates } from './data/candidates'
import { changeCandidateSelection } from './lib/candidateSelection'
import type { UserProfile } from './data/profileTypes'
import { loadProfile, saveProfile } from './lib/profileStorage'

type Page = 'For you' | 'Candidates' | 'Compare'

function App() {
  const [page, setPage] = useState<Page>('For you')
  const [profile, setProfile] = useState<UserProfile>(loadProfile)

  const [selectedCandidates, setSelectedCandidates] = useState<string[]>(
    () => profile.preferences.followedCandidates,
  )

  const navigate = (nextPage: Page) => {
    setPage(nextPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const updateCandidateSelection = (nextSelection: string[]) => {
    setSelectedCandidates(nextSelection)

    const updatedProfile: UserProfile = {
      ...profile,
      preferences: {
        ...profile.preferences,
        followedCandidates: nextSelection,
      },
    }

    setProfile(updatedProfile)
    saveProfile(updatedProfile)
  }

  const changeCandidate = (column: number, candidateId: string) => {
    const nextSelection = changeCandidateSelection(
      selectedCandidates,
      column,
      candidateId,
    )

    updateCandidateSelection(nextSelection)
  }

  const viewPolicies = (candidateId: string) => {
    const otherCandidate = candidates.find(
      candidate => candidate.id !== candidateId,
    )

    if (!otherCandidate) return

    updateCandidateSelection([candidateId, otherCandidate.id])
    navigate('Compare')
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
            comparison={selectedCandidates}
            onChangeCandidate={changeCandidate}
            onCompare={() => navigate('Compare')}
            onViewPolicies={viewPolicies}
          />
        )}

        {page === 'Compare' && (
          <ComparePage
            comparison={selectedCandidates}
            onChangeCandidate={changeCandidate}
          />
        )}
      </div>

      <BottomNav
        page={page}
        onNavigate={navigate}
        canCompare={selectedCandidates.length === 2}
      />
    </div>
  )
}

export default App
