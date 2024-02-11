'use client'

import { useContext } from 'react'
import { contextApp } from '../providers'

export default async function AnimesFectching({ data }) {
  const { theme } = useContext(contextApp)

  return [
    data?.map((e, index) => (
      <article
        className={`card__anime ${theme === 'dark' ? 'dark' : ''} ${
          theme === undefined ? 'skeleton-loader' : ''
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
