'use client'
import { Request_episode } from '@/app/FetchingData/request_episode'
import Comments from '@/app/components/comments'
import ScrollSide from './scrollSide'
import { use, useContext, useEffect, useState } from 'react'
import { FaArrowRight, FaList } from 'react-icons/fa6'
import { FaArrowLeft } from 'react-icons/fa'
import { contextApp } from '@/app/providers'
import { get, getDatabase, ref, set } from 'firebase/database'
import { Request_Animes } from '@/app/FetchingData/request_animes'

function EpisodePage({ name, episode, services }) {
  const [animes, setAnimes] = useState([])
  const [lastEpisodes, setLastEpisodes] = useState([])
  useEffect(() => {
    Request_episode(name).then((res) => setAnimes(res))
    Request_Animes({ recien: true }).then((res) => setLastEpisodes(res))
  }, [])
  const dynamicCapKey = `cap${episode}`

  const servicesList = services.filter((e) => e?.[dynamicCapKey])
  const image = animes?.datos?.map((e) => e.image)
  const agregarValorAVistosRecientes = async (name, image) => {
    try {
      const db = getDatabase()
      const object = {
        url: `${location?.pathname}`,
        name: name,
        image: image[0],
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
  const { theme, user } = useContext(contextApp)

  useEffect(() => {
    if (
      (user !== undefined && user !== null) ||
      (!user && animes === undefined && animes === null)
    ) {
      agregarValorAVistosRecientes(name, image)
    }
  }, [animes, user])

  const shortname = 'animesz-3'
  const url = `/${name.replace(/ /g, '-')}/${episode}` // URL de la página actual
  const identifier = `/${name.replace(/ /g, '-')}/${episode}` // Identificador único para la página
  const title = { name } // Título del artículo
  return animes?.datos?.map((e) => (
    <main className='container__episode__page' key={e.id}>
      <div className='container__iframe'>
        <div>
          <iframe
            src={servicesList[0]?.[dynamicCapKey]?.map((i) => i?.url)}
            allowFullScreen></iframe>
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
          </div>
          <span className='title'>
            {`${name}`} {episode}
          </span>
        </div>
        <Comments
          noButton={true}
          showCommentarios={true}
          shortname={shortname}
          url={url}
          identifier={identifier}
          title={title}
        />
      </div>

      <ScrollSide few__added__data={lastEpisodes} />
    </main>
  ))
}

export default EpisodePage
