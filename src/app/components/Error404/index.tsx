import { CenterPopup } from 'antd-mobile'
import { useTranslation } from 'react-i18next'
import { TRANSLATION_KEYS } from '@/constant/translationKeys'
import styles from './index.module.css'

export interface Error404Props {
  visible: boolean
  onBack: () => void
  code?: string
  title?: string
  btnText?: string
  message?: string
}

export function Error404({
  visible,
  onBack,
  code = '404',
  title,
  btnText,
  message = 'Oops! Your session has expired. Please login again',
}: Error404Props) {
  const { t } = useTranslation()

  const resolvedTitle =
    title ??
    t(TRANSLATION_KEYS.ERROR_404_TITLE, {
      defaultValue: 'Page Not Found',
    })

  const resolvedBtnText =
    btnText ??
    t(TRANSLATION_KEYS.COMMON_HOME, {
      defaultValue: 'Home',
    })

  return (
    <CenterPopup visible={visible} bodyStyle={{ borderRadius: 20 }}>
      <div className={styles.popupContainer}>
        <div className={styles.icon} />

        <h1 className={styles.title}>{code}</h1>
        <p className={styles.subtitle}>{resolvedTitle}</p>

        <p className={styles.message}>{message}</p>

        <div className={styles.actions}>
          <button type="button" className={styles.primaryButton} onClick={onBack}>
            {resolvedBtnText}
          </button>
        </div>
      </div>
    </CenterPopup>
  )
}
