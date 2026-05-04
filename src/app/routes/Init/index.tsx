import queryString from 'query-string'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router'
import { Error404 } from '@/app/components/Error404'
import { SESSION_ID_KEY } from '@/app/constant/storageKeys'
import { GET_SESSION_ID } from '@/app/constant/url'
import {
  announceLoad,
  exitApps,
  notifySessionChanged,
  postSessionIdToParent,
} from '@/app/utils/sessionTools'
import { TRANSLATION_KEYS } from '@/constant/translationKeys'
import { initI18n } from '@/i18n/reload'
import styles from './index.module.css'

const PENDING_STATE = 'PENDING'
const MAX_ATTEMPT = 7

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function InitPage() {
  const { search } = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [dots, setDots] = useState('')
  const [expired, setExpired] = useState(false)
  const [progress, setProgress] = useState(0)
  const [missingToken, setMissingToken] = useState(false)

  useEffect(() => {
    const id = window.setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : `${prev}.`))
    }, 500)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    let cancelled = false

    const getSessionId = async () => {
      const { accessToken: rawToken } = queryString.parse(search) as {
        accessToken?: string | string[]
      }
      const accessToken = Array.isArray(rawToken) ? rawToken[0] : rawToken
      const token = accessToken?.trim()

      if (!token) {
        setMissingToken(true)
        announceLoad()
        return
      }

      const url = `${GET_SESSION_ID}?accessToken=${encodeURIComponent(token)}`

      for (let i = 0; i <= MAX_ATTEMPT; i++) {
        if (cancelled) return
        try {
          const res = await fetch(url)
          const data: { success?: boolean; data?: unknown } = await res.json()

          if (data?.success && data?.data !== PENDING_STATE) {
            const sid = typeof data.data === 'string' ? data.data : String(data.data ?? '')
            // Session chain step 1: persist → notify → parent → i18n → navigate (poll uses plain `fetch`).
            sessionStorage.setItem(SESSION_ID_KEY, JSON.stringify(sid))
            notifySessionChanged()
            postSessionIdToParent(sid)
            await initI18n()
            window.setTimeout(() => {
              if (!cancelled) navigate('/', { replace: true })
            }, 0)
            break
          }

          if (i < MAX_ATTEMPT - 1) {
            await sleep(1000)
          } else {
            setExpired(true)
          }
        } catch (e) {
          console.error(e)
        } finally {
          setProgress((i / MAX_ATTEMPT) * 100)
        }
      }

      announceLoad()
    }

    void getSessionId()

    return () => {
      cancelled = true
    }
  }, [search, navigate])

  const showBlocking = expired || missingToken

  return (
    <div className={styles.loadingScreen}>
      <Error404
        visible={showBlocking}
        onBack={exitApps}
        code=""
        title={
          missingToken
            ? t(TRANSLATION_KEYS.ERROR_404_TITLE, { defaultValue: 'Page Not Found' })
            : t(TRANSLATION_KEYS.ERROR_CREATE_ACCOUNT_TITLE, {
                defaultValue: 'Unable to create account',
              })
        }
        message={
          missingToken
            ? t(TRANSLATION_KEYS.ERROR_INIT_MISSING_TOKEN, {
                defaultValue: 'Missing access token. Open this page from the lobby link.',
              })
            : t(TRANSLATION_KEYS.ERROR_CREATE_ACCOUNT_MESSAGE, {
                defaultValue:
                  'Please try again. If the issue continues, contact support.',
              })
        }
        btnText={t(TRANSLATION_KEYS.COMMON_RETRY, { defaultValue: 'Retry' })}
      />

      {!showBlocking ? (
        <div className={styles.content}>
          <h1 className={styles.title}>
            {t(TRANSLATION_KEYS.INIT_TITLE, { defaultValue: 'Vote Player' })}
          </h1>

          <p className={styles.loadingText}>
            {t(TRANSLATION_KEYS.INIT_LOADING_TEXT, {
              defaultValue: 'Setting up player data',
            })}
            {dots}
          </p>

          <div className={styles.progressContainer}>
            <div className={styles.progressBar} style={{ width: `${progress}%` }} />
          </div>

          <p className={styles.note}>
            {t(TRANSLATION_KEYS.INIT_NOTE, {
              defaultValue: 'Please wait while we prepare everything...',
            })}
          </p>
        </div>
      ) : null}
    </div>
  )
}
