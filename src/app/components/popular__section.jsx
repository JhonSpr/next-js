'use client'
import { useContext, useEffect, useState } from 'react'
import { FaStar } from 'react-icons/fa6'
import { FcRating } from 'react-icons/fc'
import { contextApp } from '../providers'

const PopularSection = ({ MasVotados }) => {
  const { theme } = useContext(contextApp)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 10)
  }, [])

  if (loading) {
    return <div></div>
  }
  return (
    <section
      className={`section__popular ${theme === 'dark' ? 'dark' : 'light'}`}>
      <div>
        <span className='title' style={{ color: '#fff' }}>
          <FcRating />
          CON MAS CALIFICACIÓN
        </span>
        {MasVotados.datos
          .map((e, index) => (
            <div className='card__pupular' key={index}>
              <div
                className='background__image'
                style={{ backgroundImage: `url(${e.banner})` }}></div>
              <div className='title-1'>{e.name}</div>
              <div className='content'>{e.descripcion}</div>
              <div className='rating'>
                <FaStar />
                {e.rating}
              </div>
              <button
                className='btn'
                onClick={() => {
                  location.replace(`/${e.name.replace(/ /g, '-')}`)
                }}>
                Ver Ahora
              </button>
              <div className='bar'>
                <div className='filledbar'></div>
              </div>
            </div>
          ))
          .slice(0, 10)}
      </div>
    </section>
  )
}

export default PopularSection
