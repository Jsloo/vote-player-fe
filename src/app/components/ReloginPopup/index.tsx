import { useEffect, useState } from 'react'
import { Error404 } from '@/app/components/Error404'
import { registerAuthErrorHandler } from '@/app/utils/sessionHandler'
import { exitApps } from '@/app/utils/sessionTools'
import { useAuth } from '@/providers/AuthProvider'

export function ReloginPopup() {
  const { authError, clearAuthError, triggerAuthError } = useAuth()
  const [msg, setMsg] = useState<string>()

  useEffect(() => {
    registerAuthErrorHandler(triggerAuthError)
  }, [triggerAuthError])

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
