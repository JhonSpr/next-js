'use client'

import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'
import { createContext, useContext, useEffect, useState } from 'react'
import { auth } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useCookies } from 'react-cookie'

export const contextApp = createContext()
export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [cookie, setCookie] = useCookies()
  const { theme } = useTheme()
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (user !== null) {
      setCookie('username', user?.displayName, { path: '/' })
    }
  }, [user])

  const contextValue = { user, theme }
  return (
    <contextApp.Provider value={contextValue}>{children}</contextApp.Provider>
  )
}
export const useAppContext = () => {
  return useContext(contextApp)
}

export function Providers({ children }) {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute='class' defaultTheme='light'>
        <ContextProvider>{children}</ContextProvider>
      </NextThemesProvider>
    </NextUIProvider>
  )
}
