'use client'

import { NextUIProvider } from '@nextui-org/react'
import { onAuthStateChanged } from 'firebase/auth'
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'
import { createContext, useContext, useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { auth } from './firebase'
import { get, getDatabase, ref } from 'firebase/database'
import { useRouter } from 'next/navigation'

export const contextApp = createContext()
export const ContextProvider = ({ children }) => {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [ejecuciones, setEjeciones] = useState(0)
  const [votos, setVotos] = useState(null)
  const [userProfilePhoto, setUserProfilePhoto] = useState(null)
  const [dataUser, setDataUser] = useState(null)
  const { theme } = useTheme()
  const [favoritos, setFavoritos] = useState([])
  const [ultimosVistados, setUltimosVisitados] = useState([])

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
        const userData = snapshot?.val() || []
        setFavoritos(userData.favoritos || [])
        setUltimosVisitados(userData.vistos_reciente || [])
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
    ultimosVistados,
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
