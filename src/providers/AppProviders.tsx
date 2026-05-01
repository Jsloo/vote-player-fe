import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider } from 'antd'
import enUS from 'antd/locale/en_US'
import zhCN from 'antd/locale/zh_CN'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

const queryClient = new QueryClient()

function antdLocaleFor(lng: string) {
  return lng.startsWith('zh') ? zhCN : enUS
}

function AntdConfigWithLocale({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation()
  return (
    <ConfigProvider locale={antdLocaleFor(i18n.language)}>
      {children}
    </ConfigProvider>
  )
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AntdConfigWithLocale>{children}</AntdConfigWithLocale>
    </QueryClientProvider>
  )
}
