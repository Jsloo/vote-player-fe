import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'antd-mobile/es/global'
import { bootstrapSession } from '@/app/utils/bootstrap'
import './i18n'
import './index.css'
import App from './App.tsx'
import { AppProviders } from './providers/AppProviders.tsx'

bootstrapSession()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
)
