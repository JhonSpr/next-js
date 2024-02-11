// app/components/ThemeSwitcher.tsx
'use client'

import { useTheme } from 'next-themes'
import { FaMoon, FaSun } from 'react-icons/fa'

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

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
      <div
        className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 ${
          theme === 'light' ? 'black' : ''
        }`}></div>
      <span
        className={`ms-3 text-sm font-medium text-gray-900 dark:text-gray-300 ${
          theme === 'light' ? 'text-white' : ''
        }`}>
        {theme === 'dark' ? (
          <FaMoon fontSize={'20px'} />
        ) : (
          <FaSun fontSize={'20px'} color='#111' />
        )}
      </span>
    </label>
  )
}
