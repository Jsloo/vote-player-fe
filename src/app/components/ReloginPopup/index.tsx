import { useState } from 'react'
import { Error404 } from '@/app/components/Error404'
import { exitApps } from '@/app/utils/sessionTools'
import { useAuth } from '@/providers/AuthProvider'

export function ReloginPopup() {
  const { authError, clearAuthError } = useAuth()
  const [msg, setMsg] = useState<string>()

  const handleBack = () => {
    clearAuthError()
    if (window.parent && window.parent !== window) {
      exitApps()
    } else {
      setMsg('Please close this tab')
    }
  }

  return <Error404 message={msg} visible={!!authError} onBack={handleBack} />
}
