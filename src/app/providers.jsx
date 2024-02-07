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
  const [ejecuciones, setEjeciones] = useState(0)
  const [timeout, setTimeout] = useState(2000)
  const [cookie, setCookie] = useCookies()
  const [userProfilePhoto, setUserProfilePhoto] = useState(null)
  const [dataUser, setDataUser] = useState(null)
  const { theme } = useTheme()

  useEffect(() => {
    setTimeout(() => {
      setEjeciones(ejecuciones + 1)
    }, timeout)
    if (ejecuciones) {
      setTimeout(0)
    }
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })

    return () => unsubscribe()
  }, [ejecuciones])

  useEffect(() => {
    if (user !== null) {
      setCookie('username', user?.displayName, { path: '/' })
    }
    setDataUser(
      JSON.parse(
        localStorage.getItem(
          `firebase:authUser:AIzaSyDHfPcbbo2zg-Hqc-rDp3qgHJ9kj9EtaT8:[DEFAULT]`
        )
      )
    )
  }, [ejecuciones])
  const updateUserProfilePhoto = (photoUrl) => {
    setUserProfilePhoto(photoUrl)
  }

  const contextValue = {
    user,
    dataUser,
    theme,
    updateUserProfilePhoto,
    userProfilePhoto,
  }
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
