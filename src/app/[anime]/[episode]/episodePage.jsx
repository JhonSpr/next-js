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

function EpisodePage({ name, episode, services }) {
  const [animes, setAnimes] = useState([])
  const [lastEpisodes, setLastEpisodes] = useState([])
  const [play, setPlay] = useState(false)
  const [loading, setLoading] = useState([])
  const [favoritos, setFavoritos] = useState([])
  const [episodiosGuardados, setEpisodiosGuardados] = useState([])

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
  const { theme, user, agregarFavoritos, message, guardarEpisodio } =
    useContext(contextApp)

  useEffect(() => {
    if (
      (user !== undefined && user !== null) ||
      (!user && animes === undefined && animes === null)
    ) {
      agregarValorAVistosRecientes(name, image)
    }
  }, [animes, user])

  const cargarDataUser = async () => {
    try {
      const db = getDatabase()
      const id = user?.uid

      const voteUsersRef = ref(db, 'usersVotes/' + id)
      const snapshotVote = await get(voteUsersRef)

      const userRef = ref(db, 'users/' + id)
      const snapshot = await get(userRef)
      const userData = snapshot?.val() || {}
      setFavoritos(userData.favoritos || [])
      setEpisodiosGuardados(userData.guardarEpisodio || [])
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error)
    }
  }
  useEffect(() => {
    if ((user !== undefined && user !== null) || !user) {
      cargarDataUser()
    }
  }, [message, animes])

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

      <ScrollSide few__added__data={lastEpisodes} />
    </main>
  ))
}

export default EpisodePage
