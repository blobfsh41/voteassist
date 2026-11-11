
import { useState } from 'react'
import ForYouPage from './pages/ForYouPage'
import CandidatesPage from './pages/CandidatesPage'
import ComparePage from './pages/ComparePage'
import AppHeader, { type Page } from './components/AppHeader'
import { candidates } from './data/candidates'
import { changeCandidateSelection } from './lib/candidateSelection'
import type { UserProfile } from './data/profileTypes'
import { loadProfile, saveProfile } from './lib/profileStorage'
import PreferencesPage from './pages/PreferencesPage'
import { updatePolicyPreference } from './lib/policyPreferences'
import type { PolicyQuestionId } from './data/policies'
import type { PolicyPreference } from './data/profileTypes'
import MatchesPage from './pages/MatchesPage'
import { electorates } from './data/electorates'

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

  const updateElectorate = (electorateId: string) => {
    if (!electorates.some(electorate => electorate.id === electorateId)) {
      return
    }

    const updatedProfile: UserProfile = {
      ...profile,
      electorateId,
      preferences: {
        ...profile.preferences,
        followedCandidates: [],
      },
    }

    setSelectedCandidates([])
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

  const updatePreference = (
    policyId: PolicyQuestionId,
    update: Partial<PolicyPreference>,
  ) => {
    const updatedProfile = updatePolicyPreference(profile, policyId, update)

    setProfile(updatedProfile)
    saveProfile(updatedProfile)
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
        onNavigate={navigate}
        canCompare={selectedCandidates.length === 2}
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

        {page === 'Preferences' && (
          <PreferencesPage
            profile={profile}
            onUpdatePreference={updatePreference}
            onUpdateElectorate={updateElectorate}
          />
        )}

        {page === 'Matches' && (
          <MatchesPage profile={profile} />
        )}
      </div>
    </div>
  )
}

export default App
