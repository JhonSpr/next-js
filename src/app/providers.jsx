'use client'

import { NextUIProvider } from '@nextui-org/react'
import { onAuthStateChanged } from 'firebase/auth'
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'
import { createContext, useContext, useEffect, useState } from 'react'
import { auth } from './firebase'
import { get, getDatabase, ref, set } from 'firebase/database'
import { calcularRating } from './user/[idUser]/userPage'
import { toast } from 'react-toastify'
export const contextApp = createContext()
export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userProfilePhoto, setUserProfilePhoto] = useState(null)
  const [dataUser, setDataUser] = useState(null)
  const { theme } = useTheme()
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
  const [enEspera, setEnEspera] = useState([])
  const [episodiosGuardados, setEpisodiosGuardados] = useState([])

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
      if (!user) {
        toast.info('debes iniciar sesión para usar esta función')
        setMessage('Debes iniciar sesión para usar esta función')
        setNoLogged(true)
        setTimeout(() => {
          setNoLogged(false)
        }, 2000)
        return
      } else {
        const db = getDatabase()
        const userRef = ref(db, 'users/' + user?.uid)
        const snapshot = await get(userRef)
        const userData = snapshot?.val() || {}
        const vistosRecientes = userData?.vistos_reciente || []
        const favoritos = userData?.favoritos || []
        const episodioGuardados = userData?.guardarEpisodio || []
        const objetoExistenteIndex = favoritos.findIndex(
          (objeto) => objeto?.name === name
        )

        if (objetoExistenteIndex === -1) {
          await set(userRef, {
            nombre: user?.displayName || 'undefined',
            vistos_reciente: [...vistosRecientes],
            guardarEpisodio: [...episodioGuardados],
            favoritos: [...favoritos, { name, image }],
          })
          toast.success('Agregado a favoritos')
          setMessage('Agregado a favoritos')
          setIsVisible(true)
          setTimeout(() => {
            setIsVisible(false)
          }, 3000)
          clearTimeout()
        } else {
          favoritos.splice(objetoExistenteIndex, 1)
          await set(userRef, {
            nombre: user?.displayName || 'undefined',
            vistos_reciente: [...vistosRecientes],
            guardarEpisodio: [...episodioGuardados],
            favoritos: favoritos,
          })
          toast.success('Eliminado de favoritos')
          setMessage('Eliminado de favoritos')
          setIsVisible(true)
          setRemove(true)
          setTimeout(() => {
            setIsVisible(false)
            setRemove(false)
          }, 3000)
          clearTimeout()
        }
      }

      setFirstClicked(false)
    } catch (error) {
      console.error('Error al agregar/eliminar anime de favoritos:', error)
    }
  }
  const guardarEpisodio = async (name, image, url) => {
    try {
      if (!user) {
        setMessage('Debes iniciar sesión para usar esta función')
        setNoLogged(true)
        setTimeout(() => {
          setNoLogged(false)
        }, 2000)
        return
      } else {
        const db = getDatabase()
        const userRef = ref(db, 'users/' + user?.uid)
        const snapshot = await get(userRef)
        const userData = snapshot?.val() || {}
        const vistosRecientes = userData?.vistos_reciente || []
        const favoritos = userData?.favoritos || []
        const episodioGuardados = userData?.guardarEpisodio || []
        const objetoExistenteIndex = episodioGuardados.findIndex(
          (objeto) => objeto?.url === url
        )

        if (objetoExistenteIndex === -1) {
          await set(userRef, {
            nombre: user?.displayName || 'undefined',
            vistos_reciente: [...vistosRecientes],
            favoritos: [...favoritos],
            guardarEpisodio: [...episodioGuardados, { name, image, url }],
          })
          setMessage('Episodio guardado')
          setIsVisible(true)

          setTimeout(() => {
            setIsVisible(false)
          }, 3000)
          clearTimeout()
        } else {
          episodioGuardados.splice(objetoExistenteIndex, 1)
          await set(userRef, {
            nombre: user?.displayName || 'undefined',
            vistos_reciente: [...vistosRecientes],
            favoritos: [...favoritos],
            guardarEpisodio: episodioGuardados,
          })
          setMessage('Episodio eliminado de guardados')
          setIsVisible(true)
          setRemove(true)
          setTimeout(() => {
            setIsVisible(false)
            setRemove(false)
          }, 3000)
          clearTimeout()
        }
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
        setEnEspera(userData.EnEspera || [])
        setEpisodiosGuardados(userData.guardarEpisodio || [])
      } catch (error) {
        console.error('Error al agregar/eliminar anime de favoritos:', error)
      }
    }
    cargarDataUser()
  }, [user, message])
  const contextValue = {
    guardarEpisodio,
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
    enEspera,
    episodiosGuardados,
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
