'use client'
import { Request_episode } from '@/app/FetchingData/request_episode'
import Comments from '@/app/components/comments'
import ScrollSide from './scrollSide'
import { useContext, useEffect, useState } from 'react'
import { FaArrowRight, FaList } from 'react-icons/fa6'
import { FaArrowLeft } from 'react-icons/fa'
import { contextApp } from '@/app/providers'
import { get, getDatabase, ref, set } from 'firebase/database'
import { Request_Animes } from '@/app/FetchingData/request_animes'

function EpisodePage({ name, episode }) {
  const { user } = useContext(contextApp)
  const [animes, setAnimes] = useState([])
  const [lastEpisodes, setLastEpisodes] = useState([])
  useEffect(() => {
    Request_episode(name).then((res) => setAnimes(res))
    Request_Animes({ recien: true }).then((res) => setLastEpisodes(res))
  }, [])
  const dynamicCapKey = `cap${episode}`
  const services = animes?.datos?.map((i) => i.services[0]) || []
  const services2 = services?.map((i) => i?.[dynamicCapKey])
  const servicesList = services2[0]?.map((i) => i)
  const { theme } = useContext(contextApp)
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

        // Verificar si el objeto ya existe en vistosRecientes
        const objetoExistente = vistosRecientes.find(
          (objeto) => objeto?.name === name && objeto?.episode === episode
        )

        if (!objetoExistente) {
          // Si el objeto no existe, agregarlo
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

  useEffect(() => {
    if (
      (user !== undefined && user !== null) ||
      (!user && animes === undefined && animes === null)
    ) {
      agregarValorAVistosRecientes(name, image)
    }
  }, [animes, user])

  return animes?.datos?.map((e) => (
    <main className='container__episode__page' key={e.id}>
      <title>{name + ' | sub español - audio latino'}</title>
      <div className='container__iframe'>
        <h4>
          {name} {episode}
        </h4>
        <div className='container__iframe'>
          <iframe
            src={servicesList?.map((i) => i.url)}
            allowFullScreen></iframe>
          <div className={`controls ${theme === 'dark' ? 'dark' : ''}`}>
            <a
              href={`/${name.replace(/ /g, '-')}/${episode - 1}`}
              className={episode === 1 ? 'disable' : ''}>
              <FaArrowLeft />
            </a>
            <a href={`/${name.replace(/ /g, '-')}`}>
              <FaList />
            </a>
            <a
              href={`/${name.replace(/ /g, '-')}/${episode + 1}`}
              className={episode === e.episodios ? 'disable' : ''}>
              <FaArrowRight />
            </a>
          </div>
        </div>
        <Comments noButton={false} />
      </div>
      <ScrollSide few__added__data={lastEpisodes} />
    </main>
  ))
}

export default EpisodePage
