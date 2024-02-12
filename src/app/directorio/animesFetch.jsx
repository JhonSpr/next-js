'use client'

import { useContext, useEffect, useState } from 'react'
import { contextApp } from '../providers'

export default function AnimesFectching({ data }) {
  const { theme } = useContext(contextApp)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 600)
  }, [])

  return [
    data?.map((e, index) => (
      <article
        className={`card__anime ${theme === 'dark' ? 'dark' : ''} ${
          loading || theme == undefined ? 'skeleton-loader' : ''
        }`}
        key={index}>
        <a href={`/${e.name.replace(/ /g, '-')}`}>
          <img src={e.image} alt='' className='image__anime' />
          <span className='name__anime'>{e.name}</span>
          <span className='year__anime'>{e.year}</span>
          <span className='status__anime'>{e.estado}</span>
          <span className='type__anime'>{e.tipo}</span>
        </a>
      </article>
    )),
  ]
}
