import { useState, useEffect } from 'react'

export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false
    const saved = localStorage.getItem('savdo_theme')
    if (saved) return saved === 'dark'
    return true // default: dark mode
  })

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
      localStorage.setItem('savdo_theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('savdo_theme', 'light')
    }
  }, [isDark])

  return { isDark, toggle: () => setIsDark(d => !d) }
}
