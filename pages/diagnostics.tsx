import type { NextPage } from 'next'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDevMode } from '../contexts/DevModeContext'
import { DiagnosticsComponent } from '../components/Diagnostics'

const DiagnosticsPage: NextPage = () => {
  const router = useRouter()
  const { isDevMode } = useDevMode()

  // Debug logging
  useEffect(() => {
    console.log('Dev Mode Status:', isDevMode)
  }, [isDevMode])

  // Redirect to dashboard if not in dev mode
  useEffect(() => {
    if (!isDevMode) {
      console.log('Redirecting to dashboard - Dev Mode is off')
      router.replace('/dashboard')
    }
  }, [isDevMode, router])

  if (!isDevMode) {
    console.log('Not rendering - Dev Mode is off')
    return null
  }

  console.log('Rendering Diagnostics page')
  return <DiagnosticsComponent />
}

// Make sure to export the page component as default
export default DiagnosticsPage 