'use client'

import { useContext, useEffect, useState } from 'react'
import { contextApp } from '../providers'

export default function AnimesFectching({ data }) {
  const { theme, setDatoss, rate } = useContext(contextApp)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setDatoss(data)
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
          <div className='flex items-center rating__anime'>
            <svg
              className='w-3 h-3 text-yellow-300'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='currentColor'
              viewBox='0 0 22 20'>
              <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z' />
            </svg>
            <p className='ms-2 text-xlarge font-bold text-gray-900 dark:text-white'>
              {e.rating || 5.2}
            </p>
          </div>
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
