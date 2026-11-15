import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/for-you.css'
import './styles/candidates.css'
import './styles/compare.css'
import './styles/preferences.css'
import './styles/matches.css'
import './App.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)