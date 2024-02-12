'use client'

import { NextUIProvider } from '@nextui-org/react'
import { onAuthStateChanged } from 'firebase/auth'
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'
import { createContext, useContext, useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { auth } from './firebase'
import { get, getDatabase, ref } from 'firebase/database'

export const contextApp = createContext()
export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [ejecuciones, setEjeciones] = useState(0)
  const [timeout, setTimeout] = useState(2000)
  const [cookie, setCookie] = useCookies()
  const [userProfilePhoto, setUserProfilePhoto] = useState(null)
  const [dataUser, setDataUser] = useState(null)
  const { theme } = useTheme()
  const [favoritos, setFavoritos] = useState([])

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

  const updateUserProfilePhoto = (photoUrl) => {
    setUserProfilePhoto(photoUrl)
  }

  useEffect(() => {
    const cargarDataUser = async () => {
      try {
        const db = getDatabase()
        const userRef = ref(db, 'users/' + user?.uid)
        const snapshot = await get(userRef)
        const userData = snapshot?.val() || {}
        setFavoritos(userData.favoritos || [])
      } catch (error) {
        console.error('Error al agregar/eliminar anime de favoritos:', error)
      }
    }
    cargarDataUser()
  }, [user])

  const contextValue = {
    user,
    dataUser,
    theme,
    updateUserProfilePhoto,
    userProfilePhoto,
    user,
    favoritos,
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
