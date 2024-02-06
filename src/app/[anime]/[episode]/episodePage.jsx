'use client'
import { Few__added } from '@/app/FetchingData/few_added'
import { Request_episode } from '@/app/FetchingData/request_episode'
import Comments from '@/app/components/comments'
import ScrollSide from './scrollSide'
import { useEffect, useState } from 'react'
import { FaArrowRight, FaList } from 'react-icons/fa6'
import { FaArrowLeft } from 'react-icons/fa'

function EpisodePage({ name, episode }) {
  const [animes, setAnimes] = useState([])
  const [lastEpisodes, setLastEpisodes] = useState([])
  useEffect(() => {
    Request_episode(name).then((res) => setAnimes(res))
    Few__added().then((res) => setLastEpisodes(res))
  }, [])
  const dynamicCapKey = `cap${episode}`
  const services = animes?.datos?.map((i) => i.services[0]) || []
  const services2 = services?.map((i) => i?.[dynamicCapKey])
  const servicesList = services2[0]?.map((i) => i)

  return animes?.datos?.map((e) => (
    <main className='container__episode__page' key={e.id}>
      <title>{name + ' | sub español - audio latino'}</title>
      <div className='container__iframe'>
        <h4>
          {name} {episode}
        </h4>
        <div className='container__iframe'>
          <iframe src={servicesList?.map((i) => i.url)}></iframe>
          <div className='controls'>
            <a
              href={`/${name.replace(/ /g, '-')}/${episode - 1}`}
              className={episode === 1 ? 'disable' : ''}>
              <FaArrowLeft /> Anterior
            </a>
            <a href={`/${name.replace(/ /g, '-')}`}>
              Capitulos <FaList />
            </a>
            <a
              href={`/${name.replace(/ /g, '-')}/${episode + 1}`}
              className={episode === e.episodios ? 'disable' : ''}>
              Siguiente <FaArrowRight />
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
