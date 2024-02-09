'use client'

import { NextUIProvider } from '@nextui-org/react'
import { onAuthStateChanged } from 'firebase/auth'
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'
import { createContext, useContext, useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { auth } from './firebase'

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
    if (ejecuciones < 3) {
      setEjeciones((prevEjecuciones) => prevEjecuciones + 1)
    }
  }, [ejecuciones])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })

    return () => unsubscribe()
  }, [ejecuciones])

  // useEffect(() => {
  //   if (user !== null) {
  //     setCookie('username', user?.displayName, { path: '/' })
  //   }
  //   setDataUser(
  //     JSON.parse(
  //       localStorage.getItem(
  //         `firebase:authUser:AIzaSyDHfPcbbo2zg-Hqc-rDp3qgHJ9kj9EtaT8:[DEFAULT]`
  //       )
  //     )
  //   )
  // }, [ejecuciones])
  const updateUserProfilePhoto = (photoUrl) => {
    setUserProfilePhoto(photoUrl)
  }

  const contextValue = {
    user,
    dataUser,
    theme,
    updateUserProfilePhoto,
    userProfilePhoto,
    user,
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
