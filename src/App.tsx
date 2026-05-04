import { SessionEntryBlocked } from '@/app/components/SessionEntryBlocked'
import { HomePage } from '@/app/routes/Home'
import { InitPage } from '@/app/routes/Init'
import { shouldShowMissingEntryGate } from '@/app/utils/bootstrap'
import { Route, Routes } from 'react-router'

export default function App() {
  if (shouldShowMissingEntryGate()) {
    return <SessionEntryBlocked />
  }

  return (
    <Routes>
      <Route path="/init" element={<InitPage />} />
      <Route
        path="*"
        element={
          <main className="page">
            <HomePage />
          </main>
        }
      />
    </Routes>
  )
}
