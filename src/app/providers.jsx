'use client'

import { NextUIProvider } from '@nextui-org/react'
import { onAuthStateChanged } from 'firebase/auth'
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'
import { createContext, useContext, useEffect, useState } from 'react'
import { auth } from './firebase'
import { get, getDatabase, ref, set } from 'firebase/database'
import { calcularRating } from './user/[idUser]/userPage'
import { data } from 'autoprefixer'

export const contextApp = createContext()
export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [ejecuciones, setEjeciones] = useState(0)
  const [userProfilePhoto, setUserProfilePhoto] = useState(null)
  const [dataUser, setDataUser] = useState(null)
  const { theme } = useTheme()
  const [datos, setDatoss] = useState(null)
  const [favoritos, setFavoritos] = useState([])
  const [ultimosVistados, setUltimosVisitados] = useState([])
  const [isVisible, setIsVisible] = useState(null)
  const [message, setMessage] = useState(String)
  const [remove, setRemove] = useState(Boolean)
  const [noLogged, setNoLogged] = useState(Boolean)
  const [firstClicked, setFirstClicked] = useState(true)
  const [like, setLike] = useState(0) || 0
  const [dislike, setDislike] = useState(0) || 0
  const [rate, setRate] = useState(null)
  useEffect(() => {
    setRate(calcularRating(like, dislike))
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })

    return () => unsubscribe()
  }, [user])

  const updateUserProfilePhoto = (photoUrl) => {
    setUserProfilePhoto(photoUrl)
  }

  const agregarFavoritos = async (name, image) => {
    try {
      const db = getDatabase()
      const userRef = ref(db, 'users/' + user?.uid)
      const snapshot = await get(userRef)
      const userData = snapshot?.val() || {}
      const vistosRecientes = userData?.vistos_reciente || []
      const favoritos = userData?.favoritos || []
      const objetoExistenteIndex = favoritos.findIndex(
        (objeto) => objeto?.name === name
      )

      if (objetoExistenteIndex === -1) {
        // Si el anime no está en favoritos, lo agregamos
        await set(userRef, {
          nombre: user?.displayName || 'undefined',
          vistos_reciente: [...vistosRecientes],
          favoritos: [...favoritos, { name, image }],
        })
        setMessage('Agregado a favoritos')
        setIsVisible(true)

        const idTimer = setTimeout(() => {
          setIsVisible(false)
        }, 2000)
      } else {
        // Si el anime ya está en favoritos, lo eliminamos
        favoritos.splice(objetoExistenteIndex, 1)
        await set(userRef, {
          nombre: user?.displayName || 'undefined',
          vistos_reciente: [...vistosRecientes],
          favoritos: favoritos,
        })
        setMessage('Eliminado de favoritos')
        setIsVisible(true)
        setRemove(true)
        const idTimer = setTimeout(() => {
          setIsVisible(false)
          setRemove(false)
        }, 2000)
        // setFavoritos(userData.favoritos || [])
      }
      setFirstClicked(false)
    } catch (error) {
      console.error('Error al agregar/eliminar anime de favoritos:', error)
    }
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
  }, [user, dataUser])
  const contextValue = {
    user,
    dataUser,
    theme,
    updateUserProfilePhoto,
    userProfilePhoto,
    user,
    favoritos,
    ultimosVistados,
    agregarFavoritos,
    isVisible,
    remove,
    noLogged,
    message,
    firstClicked,
    setMessage,
    setIsVisible,
    setNoLogged,
    setRemove,
    setFirstClicked,
    setDislike,
    setLike,
    rate,
    setDatoss,
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
