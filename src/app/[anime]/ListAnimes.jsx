'use client'
import EpisodesList from './EpisodesList'
import { useContext, useEffect, useState } from 'react'
import { contextApp } from '../providers'
import Comments from '../components/comments'
import { child, get, getDatabase, onValue, ref, set } from 'firebase/database'
import { AiTwotoneLike, AiTwotoneDislike } from 'react-icons/ai'
import Alert from '../components/Alert'
import { calcularRating } from '../user/[idUser]/userPage'
import { IoMdAdd } from 'react-icons/io'
import { MdAdd } from 'react-icons/md'

export function FetchSingleAnime({ data }) {
  const name = data?.map((e) => e.name?.replace(/ /g, '-'))
  const animeId = data?.map((e) => e.id?.toLowerCase())
  const [loading, setLoading] = useState([])
  const [favoritos, setFavoritos] = useState([])
  const [likes, setLikes] = useState(null) || 0
  const [dislikes, setDislikes] = useState(null) || 0
  const [rating, setRating] = useState(null)
  const [datos, setDatos] = useState(null)
  const [isVisible, setIsVisible] = useState(null)
  const [message, setMessage] = useState(String)
  const [remove, setRemove] = useState(Boolean)
  const [noLogged, setNoLogged] = useState(Boolean)
  const [votos, setVotos] = useState(Number)
  const { theme, user } = useContext(contextApp)
  const [firstClick, setFirstClick] = useState(true)
  const [votosList, setVotosList] = useState({})
  const nameID = data?.map((e) => e.anime?.replace(/ /g, ' '))[0]

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 600)
  }, [])

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
            }, 4000)
          } else if (!userVote.like && !userVote.dislike) {
            // Si el usuario no ha votado, se registra el like
            await set(child(animeRef, 'likes'), currentLikes + 1)
            setIsVisible(true)
            setRemove(false)
            setTimeout(() => {
              setIsVisible(false)
              setRemove(false)
            }, 4000)
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
            }, 4000)
          }
        } else {
          // Si el usuario no había votado antes, registra su voto como like
          await set(userVotesRef, { like: true, dislike: false })
          await set(child(animeRef, 'likes'), currentLikes + 1)
          setIsVisible(true)
          setTimeout(() => {
            setIsVisible(false)
            setRemove(false)
          }, 4000)
          setMessage('El voto fue registrado')
        }
        setFirstClick(false)
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
            }, 4000)
          } else if (!userVote.dislike && !userVote.like) {
            // Si el usuario no ha votado, se registra el dislike
            await set(child(animeRef, 'dislikes'), currentDislikes + 1)
            setIsVisible(true)
            setTimeout(() => {
              setIsVisible(false)
              setRemove(false)
            }, 4000)

            setMessage('El voto fue registrado')
            await set(userVotesRef, { like: false, dislike: true })
          } else {
            setMessage('Ya tienes un voto!')
            setIsVisible(true)
            setTimeout(() => {
              setIsVisible(false)
              setRemove(true)
            }, 4000)
          }
        } else {
          await set(userVotesRef, { like: false, dislike: true })
          await set(child(animeRef, 'dislikes'), currentDislikes + 1)
          setIsVisible(true)
          setTimeout(() => {
            setIsVisible(false)
            setRemove(false)
          }, 4000)
          setMessage('El voto fue registrado')
        }
        setFirstClick(false)
      }
    } catch (error) {
      console.error('Error al actualizar los dislikes del anime:', error)
    }
  }

  // async function writeAnimesData(animeId, name) {
  //   try {
  //     const db = getDatabase()
  //     const animeRef = ref(db, `animes/${animeId}`)

  //     const snapshot = await get(child(animeRef, 'anime'))
  //     const existingAnime = snapshot.val()

  //     if (!existingAnime) {
  //       await set(animeRef, {
  //         anime: name,
  //         likes: 0,
  //         dislikes: 0,
  //         visitas: 0,
  //       })
  //     } else {
  //     }
  //   } catch (error) {
  //     console.error('Error al escribir los datos:', error)
  //   }
  // }

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
      setDislikes(data.dislikes)
      setLikes(data.likes)
      setVotos(data.likes + data.dislikes)

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

        setFavoritos(userData.favoritos || [])
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
        setFavoritos(userData.favoritos || [])
      }
      setFirstClick(false)
    } catch (error) {
      console.error('Error al agregar/eliminar anime de favoritos:', error)
    }
  }

  useEffect(() => {
    if ((user !== undefined && user !== null) || !user) {
      fetchData()
      // writeAnimesData(animeId, data[0].name)
      cargarDataUser()
    }
  }, [data, user, message, likes, dislikes])

  useEffect(() => {
    setRating(calcularRating(likes, dislikes))
  }, [datos, message])

  const handleClose = () => {
    setIsVisible(false)
    setNoLogged(false)
  }

  if (loading) {
    return (
      <div
        className='container'
        style={{
          display: 'flex',
          placeContent: 'center',
          placeItems: 'center',
          color: '#458c9e',
          minHeight: '80dvh',
        }}>
        Cargando...
      </div>
    )
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
            <AiTwotoneLike />
          </button>
          <button
            onClick={() => updateDislikes(nameID, user?.uid, true)}
            className={`btn__voto ${theme === 'dark' ? 'dark' : ''} ${
              votosList?.dislike ? 'active' : ''
            }`}>
            <AiTwotoneDislike />
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
          <p>{e.descripcion}</p>
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
            <iframe
              src={`https://www.youtube.com/embed/${e.trailer}`}
              className='trailer__anime'></iframe>
          </div>
          <EpisodesList data={data} name={name} />
        </div>
        <Comments noButton={false} />
      </section>
      <Alert
        isVisible={isVisible && !firstClick}
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
        class='flex items-center p-4 mb-4 text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400'
        role='alert'>
        <svg
          class='flex-shrink-0 w-4 h-4'
          aria-hidden='true'
          xmlns='http://www.w3.org/2000/svg'
          fill='currentColor'
          viewBox='0 0 20 20'>
          <path d='M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z' />
        </svg>
        <span class='sr-only'>Info</span>
        <div class='ms-3 text-sm font-medium'>{message}</div>
        <button
          type='button'
          class='ms-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700'
          data-dismiss-target='#alert-2'
          aria-label='Close'
          onClick={handleClose}>
          <span class='sr-only'>Close</span>
          <svg
            class='w-3 h-3'
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
