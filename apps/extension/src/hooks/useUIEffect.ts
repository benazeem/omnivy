import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'

export const useUIEffect = () => {
  const uiState = useSelector((state: RootState) => state.ui)

  useEffect(() => {
    const root = window.document.documentElement
 
    root.classList.remove('light', 'dark', 'amoled')
    if (uiState.theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      root.classList.add(systemTheme)
    } else {
      root.classList.add(uiState.theme)
    }
 
    root.classList.remove('font-sans', 'font-serif', 'font-mono')
    if (uiState.fontFamily) {
        root.classList.add(`font-${uiState.fontFamily}`)
    }
 
    root.classList.remove('text-sm', 'text-base', 'text-lg', 'text-xl')
    if (uiState.fontSize) {
      root.classList.add(uiState.fontSize)
    }
 
    root.setAttribute('data-density', uiState.uiDensity || 'comfortable')
 
    root.setAttribute('data-accent', uiState.accentColor || 'indigo')
 
    if (uiState.reduceMotion) {
      root.classList.add('reduce-motion')
    } else {
      root.classList.remove('reduce-motion')
    }

    if (uiState.glassmorphism) {
      root.classList.add('glassmorphism')
    } else {
      root.classList.remove('glassmorphism')
    }

    if (uiState.smoothScrolling) {
      root.classList.add('smooth-scroll')
    } else {
      root.classList.remove('smooth-scroll')
    }
 
    let customStyleTag = document.getElementById('omnivy-custom-css')
    if (uiState.customCSS) {
      if (!customStyleTag) {
        customStyleTag = document.createElement('style')
        customStyleTag.id = 'omnivy-custom-css'
        document.head.appendChild(customStyleTag)
      }
      customStyleTag.innerHTML = uiState.customCSS
    } else if (customStyleTag) {
      customStyleTag.remove()
    }

  }, [uiState])

  return uiState
}
