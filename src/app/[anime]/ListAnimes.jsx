'use client'
import EpisodesList from './EpisodesList'
import { useContext, useEffect, useState } from 'react'
import { contextApp } from '../providers'
import Comments from '../components/comments'
import {
  TransactionResult,
  child,
  get,
  getDatabase,
  onValue,
  ref,
  set,
} from 'firebase/database'
import Alert from '../components/Alert'
import { calcularRating } from '../user/[idUser]/userPage'
import { MdAdd } from 'react-icons/md'
import { BiSolidDislike, BiSolidLike } from 'react-icons/bi'
import Carousel from '../components/Carousel'
import useRecomends from '../Hooks/Recomends'

export function FetchSingleAnime({ data }) {
  const { name, genero1, genero2, id } = data[0]
  let animeId = data?.map((e) => e?.id)
  const [loading, setLoading] = useState([])
  const [favoritos, setFavoritos] = useState([])
  const [likes, setLikes] = useState(0) ?? 0
  const [dislikes, setDislikes] = useState(0)
  const [rating, setRating] = useState(0)
  const [datos, setDatos] = useState(null)
  const [votos, setVotos] = useState(Number) ?? 0
  const [isMobile, setIsMobile] = useState(false)
  const [visitas, setVisitas] = useState(Number)

  useEffect(() => {
    // Función para verificar si la pantalla es de un dispositivo móvil
    const checkIsMobile = () => {
      // Verificar el ancho de la ventana para determinar si es un dispositivo móvil
      setIsMobile(window.innerWidth <= 768) // Puedes ajustar el ancho máximo para considerar como móvil
    }

    // Llamar a la función al cargar la página
    checkIsMobile()

    // Agregar un event listener para el evento de cambio de tamaño de la ventana
    window.addEventListener('resize', checkIsMobile)

    // Limpiar el event listener en el cleanup de useEffect
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])
  const {
    theme,
    user,
    agregarFavoritos,
    remove,
    message,
    isVisible,
    noLogged,
    firstClicked,
    setIsVisible,
    setMessage,
    setNoLogged,
    setRemove,
    setFirstClicked,
    setLike,
    setDislike,
  } = useContext(contextApp)
  const [votosList, setVotosList] = useState({})
  const nameID = data?.map((e) => e.anime?.replace(/ /g, ' '))[0].toLowerCase()
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 600)
  }, [])

  useEffect(() => {
    const db = getDatabase()
    const incrementAnimeVisits = async () => {
      const animeRef = ref(db, `animes/${name.toLowerCase()}`)
      await set(child(animeRef, 'visitas'), visitas + 1)
    }
    incrementAnimeVisits()
  }, [loading])

  async function updateLikes(animeId, userId) {
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
        const animeRef = ref(db, `animes/${animeId}`)
        const userVotesRef = ref(db, `usersVotes/${userId}/${animeId}`)
        const userVoteSnapshot = await get(userVotesRef)
        const userVote = userVoteSnapshot.val()
        const snapshot = await get(child(animeRef, 'likes'))
        const currentLikes = snapshot.val()
        if (userVote !== null) {
          if (userVote.like && !userVote.dislike) {
            // Si el usuario ya había dado like y no dislike, se cambia a false
            await set(child(animeRef, 'likes'), currentLikes - 1)
            setMessage('El usuario eliminó su voto.')
            await set(userVotesRef, { like: false, dislike: false })

            setIsVisible(true)
            setRemove(true)
            setTimeout(() => {
              setIsVisible(false)
            }, 2000)
          } else if (!userVote.like && !userVote.dislike) {
            // Si el usuario no ha votado, se registra el like
            await set(child(animeRef, 'likes'), currentLikes + 1)
            setIsVisible(true)
            setRemove(false)
            setTimeout(() => {
              setIsVisible(false)
              setRemove(false)
            }, 2000)
            setMessage('El voto fue registrado')
            await set(userVotesRef, { like: true, dislike: false })
          } else {
            // Si ya tiene un voto contrario, muestra un mensaje de alerta
            setMessage('Ya tienes un voto!')
            setIsVisible(true)
            setRemove(true)
            setTimeout(() => {
              setIsVisible(false)
              setRemove(false)
            }, 2000)
          }
        } else {
          // Si el usuario no había votado antes, registra su voto como like
          await set(userVotesRef, { like: true, dislike: false })
          await set(child(animeRef, 'likes'), currentLikes + 1)
          setIsVisible(true)
          setTimeout(() => {
            setIsVisible(false)
            setRemove(false)
          }, 2000)
          setMessage('El voto fue registrado')
        }
        setFirstClicked(false)
      }
    } catch (error) {
      console.error('Error al actualizar los likes del anime:', error)
    }
  }

  async function updateDislikes(animeId, userId) {
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
        const animeRef = ref(db, `animes/${animeId}`)
        const userVotesRef = ref(db, `usersVotes/${userId}/${animeId}`)
        const userVoteSnapshot = await get(userVotesRef)
        const userVote = userVoteSnapshot.val()
        const dislikesSnapshot = await get(child(animeRef, 'dislikes'))
        const currentDislikes = dislikesSnapshot.val()

        if (userVote !== null) {
          if (userVote.dislike && !userVote.like) {
            // Si el usuario ya había dado dislike y no like, se cambia a false
            await set(child(animeRef, 'dislikes'), currentDislikes - 1)
            setMessage('El usuario eliminó su voto.')
            await set(userVotesRef, { like: false, dislike: false })
            setIsVisible(true)
            setRemove(true)
            setTimeout(() => {
              setIsVisible(false)
              setRemove(false)
            }, 2000)
          } else if (!userVote.dislike && !userVote.like) {
            // Si el usuario no ha votado, se registra el dislike
            await set(child(animeRef, 'dislikes'), currentDislikes + 1)
            setIsVisible(true)
            setRemove(false)
            setTimeout(() => {
              setIsVisible(false)
              setRemove(false)
            }, 2000)
            setMessage('El voto fue registrado')
            await set(userVotesRef, { like: false, dislike: true })
          } else {
            setMessage('Ya tienes un voto!')
            setIsVisible(true)
            setRemove(false)
            setTimeout(() => {
              setIsVisible(false)
              setRemove(false)
            }, 2000)
          }
        } else {
          await set(userVotesRef, { like: false, dislike: true })
          await set(child(animeRef, 'dislikes'), currentDislikes + 1)
          setIsVisible(true)
          setTimeout(() => {
            setIsVisible(false)
            setRemove(false)
          }, 2000)
          setMessage('El voto fue registrado')
        }
        setFirstClicked(false)
      }
    } catch (error) {
      console.error('Error al actualizar los dislikes del anime:', error)
    }
  }

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://animesz-f90c0-default-rtdb.firebaseio.com/animes/${nameID}.json`
      )
      if (!response.ok) {
        throw new Error('Error al recuperar los datos')
      }
      const data = await response.json()
      setDatos(data)
      setDislikes(data?.dislikes || 0)
      setLikes(data?.likes || 0)
      setDislike(data?.dislikes || 0)
      setLike(data?.likes || 0)
      setVotos(data?.likes + data?.dislikes || data?.likes || data?.dislikes)

      return data
    } catch (error) {
      console.error('Error al leer datos:', error)
      return null
    }
  }
  const fetchVisitas = async () => {
    try {
      const response = await fetch(
        `https://animesz-f90c0-default-rtdb.firebaseio.com/animes/${nameID}.json`
      )
      if (!response.ok) {
        throw new Error('Error al recuperar los datos')
      }
      const data = await response.json()
      setVisitas(data.visitas)
      return data
    } catch (error) {
      console.error('Error al leer datos:', error)
      return null
    }
  }

  const cargarDataUser = async () => {
    try {
      const db = getDatabase()
      const id = user?.uid

      const voteUsersRef = ref(db, 'usersVotes/' + id)
      const snapshotVote = await get(voteUsersRef)
      const votesData = snapshotVote?.val() || {}

      // Aquí recorremos cada anime en votesData para obtener sus votos
      const likesDislikes = {}
      for (const anime in votesData) {
        const animeVotes = votesData[anime]
        const { like, dislike } = animeVotes
        likesDislikes[anime] = { like, dislike }
      }

      // Ahora likesDislikes contendrá un objeto con los votos de cada anime

      const userRef = ref(db, 'users/' + id)
      const snapshot = await get(userRef)
      const userData = snapshot?.val() || {}

      setFavoritos(userData.favoritos || [])
      setVotosList(likesDislikes[`${nameID}`]) // Establecer el estado con los votos
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error)
    }
  }

  useEffect(() => {
    const newRating = calcularRating(likes, dislikes)
    setRating(newRating)

    const updateRatingInDatabase = async () => {
      try {
        const db = getDatabase()

        const animeRef = ref(db, `animes/${name.toLowerCase()}`)
        await set(child(animeRef, 'rating'), newRating)
      } catch (error) {
        console.error(
          'Error al actualizar el rating en la base de datos:',
          error
        )
      }
    }

    if (animeId) {
      updateRatingInDatabase(animeId)
    }
  }, [likes, dislikes])

  const handleRatingSubmit = async () => {
    try {
      // Validar si animeId tiene un valor válido
      if (!animeId && data?.length) {
        animeId = data[0].id
      }

      if (animeId) {
        // Parsear el rating a un número decimal
        const parsedRating = parseFloat(rating)
        if (isNaN(parsedRating)) {
          throw new Error('El rating no es un número válido')
        }

        const response = await fetch(
          `https://api-rest.up.railway.app/api/v1/animes/${animeId}/rating`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              rating: parsedRating,
            }),
          }
        )

        // Manejo de respuesta
        if (!response.ok) {
          throw new Error('Error al actualizar la calificación del anime')
        }

        // La solicitud PUT se completó exitosamente
        // Puedes realizar acciones adicionales si es necesario
      }
    } catch (error) {
      // Manejo de errores
      console.error('Error al enviar la solicitud PUT:', error.message)
      // Puedes mostrar un mensaje de error al usuario o registrar el error para su posterior análisis
    }
  }

  useEffect(() => {
    if ((user !== undefined && user !== null) || !user) {
      fetchData()
      cargarDataUser()
    }
  }, [data, user, message, likes, dislikes])

  useEffect(() => {
    setRating(calcularRating(likes, dislikes)) // Actualiza el rating basado en los nuevos valores de likes y dislikes
  }, [likes, dislikes, message])

  useEffect(() => {
    handleRatingSubmit()
  }, [rating, user])

  const handleClose = () => {
    setIsVisible(false)
    setNoLogged(false)
  }

  useEffect(() => {
    fetchVisitas()
  }, [loading])

  const { uniqueArray } = useRecomends(name, genero1, genero2)
  if (loading) {
    return <div></div>
  }

  return data?.map((e, index) => (
    <main
      className={`information__page ${theme === 'dark' ? 'dark ' : ''}`}
      key={index}>
      <section className='container__image'>
        <div className='image__anime'>
          <img src={e.image} alt='' />
        </div>
        <div className='footer__image__anime'>
          <button
            onClick={() => updateLikes(nameID, user?.uid, true)}
            className={`btn__voto ${theme === 'dark' ? 'dark' : ''} ${
              votosList?.like ? 'active' : ''
            }`}>
            <BiSolidLike />
          </button>
          <button
            onClick={() => updateDislikes(nameID, user?.uid, true)}
            className={`btn__voto ${theme === 'dark' ? 'dark' : ''} ${
              votosList?.dislike ? 'active' : ''
            }`}>
            <BiSolidDislike />
          </button>
        </div>
      </section>

      <section className={`container__information`}>
        <div className='info__anime'>
          <button
            className={`btn__favorite ${theme === 'dark' ? 'dark' : ''} ${
              favoritos.some((objeto) => objeto?.name === e.name)
                ? 'active'
                : ''
            }`}
            onClick={() => agregarFavoritos(e.name, e.image)}>
            <span>
              <span className={`menssage`}>
                {favoritos.some((objeto) => objeto?.name === e.name)
                  ? 'Eliminar favoritos'
                  : 'Agregar a favoritos'}
              </span>
              <MdAdd />
            </span>
          </button>
          <div className='flex items-center rating'>
            <svg
              className='w-4 h-4 text-yellow-300 me-1'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='currentColor'
              viewBox='0 0 22 20'>
              <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z' />
            </svg>
            <p className='ms-2 text-xlarge font-bold text-gray-900 dark:text-white'>
              {rating} / 10
            </p>
            <span className='w-1 h-1 mx-1.5 bg-gray-500 rounded-full dark:bg-gray-400'></span>
            <a className='text-sm font-medium text-gray-900 underline hover:no-underline dark:text-white'>
              {votos} votos
            </a>
          </div>

          <strong className='title__anime'>{e.name}</strong>
          <p className='sypnosis'>{e.descripcion}</p>

          <div className={`wrapp__anime`}>
            <span>
              fecha de emisión: <strong>{e.emitido}</strong>
            </span>
            <span>
              estado actual: <strong>{e.estado}</strong>
            </span>
            <span>
              Episiodios: <strong>{e.episodios}</strong>
            </span>
            <span>
              Numero de tempodaras: <strong>{e.temporadas}</strong>
            </span>
            <span>
              Duración x capitulo: <strong>{e.duration}</strong>
            </span>
            <span>
              Años de emisión: <strong>{e.year}</strong>
            </span>
            <span>
              Estudio: <strong>{e.studio}</strong>
            </span>
            <div className={`generos__anime ${theme === 'dark' ? 'dark' : ''}`}>
              {e.generos?.map((e, index) => (
                <a
                  href={`/directorio?generos=${e.genero?.replace(/ /g, '+')}`}
                  key={index}>
                  {e.genero}
                </a>
              ))}
            </div>
            <span>
              Visitas: <strong>{visitas}</strong>
            </span>
            <div className='trailer__anime'>
              <iframe
                src={`https://www.youtube.com/embed/${e.trailer}`}></iframe>
            </div>
          </div>
          <EpisodesList data={data} name={name?.replace(/ /g, '-')} />
        </div>
        <div className='carousel__container'>
          <Carousel ArrayList={uniqueArray} itemsShow={5} />
        </div>
        <Comments noButton={true} showCommentarios={true} />
      </section>
      <Alert
        isVisible={isVisible && !firstClicked}
        message={message}
        remove={remove}
        handleClose={handleClose}
      />
      <div
        style={{
          visibility: `${noLogged ? 'visible' : 'hidden'}`,
          position: 'fixed',
          bottom: '30px',
        }}
        id='alert-2'
        className='flex items-center p-4 mb-4 text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400'
        role='alert'>
        <svg
          className='flex-shrink-0 w-4 h-4'
          aria-hidden='true'
          xmlns='http://www.w3.org/2000/svg'
          fill='currentColor'
          viewBox='0 0 20 20'>
          <path d='M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z' />
        </svg>
        <span className='sr-only'>Info</span>
        <div className='ms-3 text-sm font-medium'>{message}</div>
        <button
          type='button'
          className='ms-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700'
          data-dismiss-target='#alert-2'
          aria-label='Close'
          onClick={handleClose}>
          <span className='sr-only'>Close</span>
          <svg
            className='w-3 h-3'
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 14 14'>
            <path
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
            />
          </svg>
        </button>
      </div>
    </main>
  ))
}
