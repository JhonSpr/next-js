'use client'
import EpisodesList from './EpisodesList'
import { useContext, useEffect, useRef, useState } from 'react'
import { contextApp } from '../providers'
import Comments from '../components/comments'
import { child, get, getDatabase, ref, set } from 'firebase/database'
import Alert from '../components/Alert'
import { calcularRating } from '../user/[idUser]/userPage'
import { MdAdd, MdKeyboardArrowDown, MdWatchLater } from 'react-icons/md'
import { BiSolidDislike, BiSolidLike } from 'react-icons/bi'
import Carousel from '../components/Carousel'
import useRecomends from '../Hooks/Recomends'
import moment from 'moment'
import 'moment-timezone'
import { FaCheck } from 'react-icons/fa6'
import useWatchLater from './HooksDB/HookWatchLater'
import { LoaderPage } from '../components/LoaderSkeleton'
import { IoIosAdd, IoMdRemoveCircle } from 'react-icons/io'

export const obtenerMensajeFecha = (fechaAgregado) => {
  const fechaActual = moment()
  const fechaAgregadoMoment = moment(fechaAgregado)

  const diferenciaDias = fechaActual.diff(fechaAgregadoMoment, 'days')

  if (diferenciaDias === 0) {
    return 'hoy'
  } else if (diferenciaDias === 1) {
    return 'ayer'
  } else {
    return `hace ${diferenciaDias} días`
  }
}

export function FetchSingleAnime({ data }) {
  const { name, genero1, genero2, id, year, fechaAgregado } = data[0]
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
  const [settings, setSettings] = useState(null)
  const settingsRef = useRef(null)
  const [isWaiting, setIsWaiting] = useState(null)

  const [votosList, setVotosList] = useState({})

  const handleClick = (settingId) => {
    if (settings === settingId) {
      setSettings(null)
    } else {
      setSettings(settingId)
    }
  }

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setSettings(null)
      }
    }

    document.addEventListener('click', handleOutsideClick)

    return () => {
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [settings])
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768) // Puedes ajustar el ancho máximo para considerar como móvil
    }

    checkIsMobile()

    window.addEventListener('resize', checkIsMobile)

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
  const { updateWatchLater, updateDislikes, updateLikes } = useWatchLater({
    user: user,
    setFirstClicked: setFirstClicked,
    setIsVisible: setIsVisible,
    setMessage: setMessage,
    setRemove: setRemove,
    setNoLogged: setNoLogged,
  })
  const nameID = id
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 800)
  }, [])

  useEffect(() => {
    const db = getDatabase()
    const incrementAnimeVisits = async () => {
      const animeRef = ref(db, `animes/${id}`)
      const snapshot = await get(animeRef)
      if (snapshot.exists()) {
        const currentVisits = snapshot.val().visitas || 0
        await set(child(animeRef, 'visitas'), currentVisits + 1)
        setVisitas((prevVisitas) => prevVisitas + 1)
      } else {
        console.error('El anime no existe en la base de datos.')
      }
    }

    incrementAnimeVisits()
  }, [loading])
  const fecha = obtenerMensajeFecha(fechaAgregado)

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://animesz-f90c0-default-rtdb.firebaseio.com/animes/${id}.json`
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
        `https://animesz-f90c0-default-rtdb.firebaseio.com/animes/${id}.json`
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

      const likesDislikes = {}
      for (const anime in votesData) {
        const animeVotes = votesData[anime]
        const { like, dislike } = animeVotes
        likesDislikes[anime] = { like, dislike }
      }

      const animesEnEspera = {}
      for (const anime in votesData) {
        const animeVotes = votesData[anime]
        const { enEspera } = animeVotes
        animesEnEspera[anime] = { enEspera }
      }

      const userRef = ref(db, 'users/' + id)
      const snapshot = await get(userRef)
      const userData = snapshot?.val() || {}
      setIsWaiting(animesEnEspera[`${nameID}`])
      setFavoritos(userData.favoritos || [])
      setVotosList(likesDislikes[`${nameID}`]) //
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

        const animeRef = ref(db, `animes/${id}`)
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
      if (!id && data?.length) {
        id
      }

      if (id) {
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

        if (!response.ok) {
          throw new Error('Error al actualizar la calificación del anime')
        }
      }
    } catch (error) {
      // Manejo de errores
      console.error('Error al enviar la solicitud PUT:', error.message)
    }
  }

  const handleVisitasSubmit = async () => {
    try {
      if (!id && data?.length) {
        id
      }

      if (animeId) {
        const visitaSubmit = visitas
        if (isNaN(visitaSubmit)) {
          throw new Error('Las visitas no son un número válido')
        }

        const response = await fetch(
          `https://api-rest.up.railway.app/api/v1/animes/${nameID}/visitas`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              visitas: visitaSubmit,
            }),
          }
        )

        if (!response.ok) {
          throw new Error('Error al actualizar las Visitas del anime')
        }
      }
    } catch (error) {
      console.error('Error al enviar la solicitud PUT:', error.message)
    }
  }

  useEffect(() => {
    if ((user !== undefined && user !== null) || !user) {
      fetchData()
      cargarDataUser()
    }
  }, [data, user, message, likes, dislikes])

  useEffect(() => {
    setRating(calcularRating(likes, dislikes)) //
  }, [likes, dislikes, message])

  useEffect(() => {
    handleRatingSubmit()
  }, [rating, user])
  useEffect(() => {
    handleVisitasSubmit()
  }, [visitas, user])

  const handleClose = () => {
    setIsVisible(false)
    setNoLogged(false)
    clearTimeout()
  }

  useEffect(() => {
    fetchVisitas()
  }, [loading])

  const { uniqueArray } = useRecomends(name, genero1, genero2, year)
  const { image, banner } = data[0]
  if (loading) {
    return (
      <div
        style={{
          minHeight: '70dvh',
          width: '100%',
          alignContent: 'center',
          alignItems: 'center',
          display: 'grid',
          placeItems: 'center',
          placeContent: 'center',
        }}>
        <LoaderPage />
      </div>
    )
  }

  return data?.map((e, index) => (
    <>
      <div
        className='background__page__info'
        style={{
          backgroundImage: `url(${banner ?? image})`,
        }}></div>
      <section className='container__anime' style={{ minHeight: '70dvh' }}>
        <main
          className={`information__page ${theme === 'dark' ? 'dark ' : ''}`}
          key={index}>
          <section className='container__image'>
            <div className='image__anime'>
              <img src={e.image} alt='' />
            </div>
            <div className='footer__image__anime'>
              <button
                onClick={() => updateLikes(id, user?.uid, true)}
                className={`btn__voto ${theme === 'dark' ? 'dark' : ''} ${
                  votosList?.like ? 'active' : ''
                }`}>
                <span>{likes}</span>
                <BiSolidLike />
              </button>
              <button
                onClick={() => updateDislikes(id, user?.uid, true)}
                className={`btn__voto ${theme === 'dark' ? 'dark' : ''} ${
                  votosList?.dislike ? 'active' : ''
                }`}>
                <span>{dislikes}</span>
                <BiSolidDislike />
              </button>
            </div>
            <div className='setting__anime'>
              <button
                className={`btn__favorite ${theme == 'dark' ? 'dark' : ''} ${
                  favoritos.some(
                    (objeto) => objeto?.name.toLowerCase() == e.name
                  )
                    ? 'active'
                    : ''
                }`}>
                <span onClick={() => agregarFavoritos(e.id, e.image)}>
                  {favoritos.some(
                    (objeto) => objeto?.name.toLowerCase() == e.name
                  ) ? (
                    <IoMdRemoveCircle />
                  ) : (
                    <IoIosAdd />
                  )}
                  {favoritos.some(
                    (objeto) => objeto?.name.toLowerCase() == e.name
                  )
                    ? 'Mi lista'
                    : 'Mi lista'}
                </span>
                <MdKeyboardArrowDown
                  className='icon__settings__anime'
                  onClick={() => handleClick(1)}
                />

                <div
                  ref={settingsRef}
                  className={`settings ${settings === 1 ? 'show' : ''}`}>
                  <span>
                    <FaCheck /> Marcar como completado
                  </span>
                  <span
                    onClick={() =>
                      updateWatchLater(id, user?.uid, e.name, e.image)
                    }
                    className={isWaiting?.enEspera ? 'active' : ''}>
                    <MdWatchLater
                      color={isWaiting?.enEspera ? '#03fcd2ea' : 'fff'}
                    />
                    Marcar pendiente
                  </span>
                </div>
              </button>
            </div>
          </section>

          <section className={`container__information`}>
            <div className='info__anime'>
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
                  tempodaras: <strong>{e.temporadas}</strong>
                </span>
                <span>
                  Duración x capitulo: <strong>{e.duration}</strong>
                </span>
                <span>
                  Años de emisión: <strong>{e.year}</strong>
                </span>
                <span>
                  Categoria: <strong>{e.tipo}</strong>
                </span>
                <span>
                  Estudio:{' '}
                  <strong>
                    <a
                      href={`/directorio?studio=${e.studio
                        ?.toLowerCase()
                        ?.replace(/ /g, '+')}`}>
                      {e.studio}
                    </a>
                  </strong>
                </span>
                <span>
                  Agreado: <strong>{fecha}</strong>
                </span>
                <span>
                  Visitas: <strong>{visitas}</strong>
                </span>
                <div
                  className={`generos__anime ${
                    theme === 'dark' ? 'dark' : ''
                  }`}>
                  {e.generos?.map((e, index) => (
                    <a
                      href={`/directorio?generos=${e.genero?.replace(
                        / /g,
                        '+'
                      )}`}
                      key={index}>
                      {e.genero}
                    </a>
                  ))}
                </div>
                <div
                  className={
                    theme === 'dark' ? 'trailer__anime dark' : 'trailer__anime'
                  }>
                  <iframe
                    src={`https://www.youtube.com/embed/${e.trailer}`}></iframe>
                </div>
              </div>

              <EpisodesList data={data} name={name?.replace(/ /g, '-')} />
            </div>
            <div
              className={
                theme === 'dark'
                  ? 'carousel__container dark'
                  : 'carousel__container'
              }>
              <Carousel ArrayList={uniqueArray} itemsShow={5} />
            </div>
            <Comments noButton={true} showCommentarios={true} />
          </section>
          {isVisible && (
            <Alert
              isVisible={isVisible && !firstClicked}
              message={message}
              remove={remove}
              handleClose={handleClose}
            />
          )}
          {noLogged && (
            <div
              style={{
                visibility: `${noLogged ? 'visible' : 'hidden'}`,
                position: 'fixed',
                bottom: '30px',
              }}
              id='alert-2'
              className='flex items-center p-4 mb-4 text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 alert'
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
          )}
        </main>
      </section>
    </>
  ))
}
