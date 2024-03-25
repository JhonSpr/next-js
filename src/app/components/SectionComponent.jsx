'use client'

import { useContext, useEffect, useState } from 'react'
import { FaCrown } from 'react-icons/fa6'
import { contextApp } from '../providers'

const SectionComponent = ({ MasVisitas }) => {
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
    <div className={`section__midle ${theme === 'dark' ? 'dark' : ''}`}>
      <div>
        <span className='title' style={{ color: '#fff' }}>
          <FaCrown /> TOP MAS POPULARES
        </span>
        {MasVisitas.datos
          .map((e, index) => (
            <article key={index} className={`card__midle item${index + 1}`}>
              <a href={e.name?.replace(/ /g, '-')}>
                <div className='visitas__overlay'>Visitas {e.visitas}</div>
                <img src={e.banner ?? e.image} alt='' />
                <span className='tag'>{index + 1}</span>
              </a>{' '}
              <strong className='name'>{e.name}</strong>
            </article>
          ))
          .slice(0, 10)}
      </div>
    </div>
  )
}

export default SectionComponent
