'use client'
import { Request_episode } from '@/app/FetchingData/request_episode'
import Comments from '@/app/components/comments'
import ScrollSide from './scrollSide'
import { useContext, useEffect, useState } from 'react'
import { FaArrowRight, FaClockRotateLeft, FaList } from 'react-icons/fa6'
import { FaArrowLeft, FaHome, FaPlayCircle } from 'react-icons/fa'
import { contextApp } from '@/app/providers'
import { get, getDatabase, ref, set } from 'firebase/database'
import { Request_Animes } from '@/app/FetchingData/request_animes'
import { LoaderPage } from '@/app/components/LoaderSkeleton'
import { MdFavorite } from 'react-icons/md'
import Alert from '@/app/components/Alert'

function EpisodePage({ name, episode, services }) {
  const [animes, setAnimes] = useState([])
  const [lastEpisodes, setLastEpisodes] = useState([])
  const [play, setPlay] = useState(false)
  const [loading, setLoading] = useState([])

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 800)
  }, [])
  useEffect(() => {
    Request_episode(name).then((res) => setAnimes(res))
    Request_Animes({ recien: true }).then((res) => setLastEpisodes(res))
  }, [])
  const dynamicCapKey = `cap${episode}`

  const servicesList = services.filter((e) => e?.[dynamicCapKey])

  const { image } = servicesList[0]?.[dynamicCapKey][0] ?? ''

  const agregarValorAVistosRecientes = async (name, image) => {
    try {
      const db = getDatabase()
      const object = {
        url: `${location?.pathname}`,
        name: name,
        image: image,
        episode: episode,
      }

      if (name && image && episode) {
        const userRef = ref(db, 'users/' + user?.uid)
        const snapshot = await get(userRef)
        const userData = snapshot?.val() || {}
        const vistosRecientes = userData?.vistos_reciente || []
        const favoritos = userData?.favoritos || []

        const objetoExistente = vistosRecientes.find(
          (objeto) => objeto?.name === name && objeto?.episode === episode
        )

        if (!objetoExistente) {
          await set(ref(db, 'users/' + user?.uid), {
            nombre: user?.displayName || 'undefined',
            favoritos: [...favoritos],
            vistos_reciente: [...vistosRecientes, object],
          })
        } else {
        }
      } else {
      }
    } catch (error) {
      console.error('Error al agregar el objeto a vistosRecientes:', error)
    }
  }
  const {
    theme,
    user,
    agregarFavoritos,
    guardarEpisodio,
    favoritos,
    episodiosGuardados,
    isVisible,
    remove,
    noLogged,
    message,
    firstClicked,
  } = useContext(contextApp)

  useEffect(() => {
    if (
      (user !== undefined && user !== null) ||
      (!user && animes === undefined && animes === null)
    ) {
      agregarValorAVistosRecientes(name, image)
    }
  }, [animes, user])

  const handleClose = () => {
    return null
  }

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

  return animes?.datos?.map((e) => (
    <main className='container__episode__page' key={e.id}>
      <div className='container__iframe'>
        {isVisible && (
          <Alert
            isVisible={isVisible && !firstClicked}
            message={message}
            remove={remove}
            handleClose={handleClose}
          />
        )}
        <div>
          <p className='nav__episode'>
            <a href='/' className='fr'>
              <FaHome /> <span>Inicio</span>
            </a>{' '}
            - <a href='/directorio'>Directorio</a> -{' '}
            <a href={`/${name.replace(/ /g, '-').toLowerCase()}`}>{name}</a> -{' '}
            <a href={`/${name.replace(/ /g, '-').toLowerCase()}/${episode}`}>
              {episode}
            </a>
          </p>
          <div className='iframe__div'>
            <iframe
              src={servicesList[0]?.[dynamicCapKey].map((e) => e.url)}
              allowFullScreen></iframe>
            <div
              className={play ? 'overlay__episode hide' : 'overlay__episode'}>
              <img src={e.banner ?? e.image} alt='' />
              <FaPlayCircle onClick={() => setPlay(!play)} />
            </div>
          </div>
          <div className={`controls ${theme === 'dark' ? 'dark' : ''}`}>
            <a
              href={
                episode === 1
                  ? null
                  : `/${name.replace(/ /g, '-')}/${episode - 1}`
              }
              className={episode === 1 ? 'disabled' : ''}>
              <FaArrowLeft />
            </a>
            <a href={`/${name.replace(/ /g, '-')}`}>
              <FaList />
            </a>
            <a
              href={
                episode === e.episodios
                  ? null
                  : `/${name.replace(/ /g, '-')}/${episode + 1}`
              }
              className={episode === e.episodios ? 'disabled' : ''}>
              <FaArrowRight />
            </a>

            <button
              onClick={() => agregarFavoritos(e.name.toLowerCase(), e.image)}>
              <MdFavorite
                color={favoritos.some((e) => e.name == name) ? '1283d8' : 'fff'}
              />
            </button>
            <button
              onClick={() =>
                guardarEpisodio(
                  e.name.toLowerCase(),
                  e.image,
                  location.pathname
                )
              }>
              <FaClockRotateLeft
                color={
                  episodiosGuardados.some((e) => e.url == location.pathname)
                    ? '1283d8'
                    : 'fff'
                }
              />
            </button>
          </div>
          <span className='title'>
            {`${name}`} {episode}
          </span>
          <div className='episodes__list'>
            {e.episodes__overlay.map((e, index) => (
              <a
                href={
                  episode === e.episode
                    ? null
                    : `/${name.replace(/ /g, '-').toLowerCase()}/${e.episode}`
                }
                key={index}
                className={episode === e.episode ? 'disabled' : 'enabled'}>
                <img src={e.image} alt='' />
                <p>1 - {e.episode}</p>
                <span>Episodio {e.episode}</span>
              </a>
            ))}
          </div>
        </div>
        <Comments noButton={true} showCommentarios={true} />
      </div>
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

      <ScrollSide few__added__data={lastEpisodes} />
    </main>
  ))
}

export default EpisodePage
