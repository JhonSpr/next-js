'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { FaMoon, FaSun } from 'react-icons/fa'
import { MdSunny } from 'react-icons/md'

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <label className='relative inline-flex items-center cursor-pointer'>
      <input
        type='checkbox'
        className='sr-only peer'
        onChange={() => {
          if (theme === 'dark') {
            setTheme('light')
            localStorage.setItem('theme', 'light')
          } else {
            setTheme('dark')
            localStorage.setItem('theme', 'dark')
          }
        }}
        checked={theme === 'dark'}
      />
      <div className={`switch__theme ${theme == 'dark' ? 'dark' : 'light'}`}>
        <div className={`toggle ${theme == 'dark' ? 'active' : ''}`}>
          {theme === 'dark' ? (
            <FaMoon />
          ) : (
            <MdSunny fontSize={'15px'} color='#ccda08' />
          )}
        </div>
      </div>
      <span
        className={`ms-3 text-sm font-medium text-gray-900 dark:text-gray-300 ${
          theme === 'dark' ? 'text-white' : ''
        }`}></span>
    </label>
  )
}
