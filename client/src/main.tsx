import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'

import './index.css'
import './shared/styles/SiteTrack.css'

import App from './App.js'
import AuthProvider from './session-navigation/context/AuthProvider.js'

createRoot(
  document.getElementById('root')!
).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)