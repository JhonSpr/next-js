'use client'
import { FaStar } from 'react-icons/fa6'
import EpisodesList from './EpisodesList'
import { useContext, useEffect, useState } from 'react'
import { contextApp } from '../providers'
import Comments from '../components/comments'

export function FetchSingleAnime({ data }) {
  const name = data?.map((e) => e.name?.replace(/ /g, '-'))
  const [loading, setLoading] = useState([])

  const { theme } = useContext(contextApp)
  useEffect(() => {
    setLoading(true)
    setLoading(false)
  }, [loading])

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
        <div className='rating__anime'>
          <FaStar color='#ffc507' /> {e.rating}
        </div>
      </section>

      <section className={`container__information`}>
        <div className='info__anime'>
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
    </main>
  ))
}
