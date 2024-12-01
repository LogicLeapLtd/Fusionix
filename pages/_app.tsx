import type { AppProps } from 'next/app'
import ThemeProvider from '../components/ThemeProvider'
import { DevModeProvider } from '../contexts/DevModeContext'
import Layout from '../components/Layout'
import ErrorBoundary from '../components/ErrorBoundary'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <DevModeProvider>
        <ErrorBoundary>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ErrorBoundary>
      </DevModeProvider>
    </ThemeProvider>
  )
} 