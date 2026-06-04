import { useEffect, useState } from 'react'

const DARK_MODE_QUERY = '(prefers-color-scheme: dark)'

const getPrefersDarkMode = () =>
  typeof window !== 'undefined' && window.matchMedia(DARK_MODE_QUERY).matches

export const usePrefersDarkMode = () => {
  const [prefersDarkMode, setPrefersDarkMode] = useState(getPrefersDarkMode)

  useEffect(() => {
    const mediaQuery = window.matchMedia(DARK_MODE_QUERY)
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersDarkMode(event.matches)
    }

    setPrefersDarkMode(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return prefersDarkMode
}
