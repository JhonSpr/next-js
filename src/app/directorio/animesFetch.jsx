'use client'

import { useContext, useEffect, useState } from 'react'
import { contextApp } from '../providers'
import { FaPlayCircle } from 'react-icons/fa'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

export default function AnimesFetching({ data }) {
  const { theme } = useContext(contextApp)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  const [host, setHost] = useState(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const { origin } = window.location
      setHost(origin ?? null)
    }
  }, [])

  return (
    <>
      {data?.map((e, index) => (
        <>
          <article
            style={{ display: `${loading ? 'none' : 'block'}` }}
            className={`card__anime ${theme === 'dark' ? 'dark' : ''} ${
              loading ? 'loading-card' : ''
            }`}
            key={index}>
            {loading ? (
              <Skeleton />
            ) : (
              <div className='card__content'>
                {typeof window == undefined ? null : (
                  <a
                    href={`${`${host}/${e.name.replace(/ /g, '-')}`}  `}
                    className='column__image'>
                    <img src={e.image} alt='' className='image__anime' />
                    <strong className='name__anime'>{e.name}</strong>
                    <button
                      className='btn__anime'
                      onClick={() => {
                        location.assign(
                          `/${e.name.replace(/ /, '-').toLowerCase()}`
                        )
                      }}>
                      Ver Ahora
                    </button>
                    <div className='overlay'>
                      <FaPlayCircle />
                    </div>
                  </a>
                )}

                <div className='column__description'>
                  <span className='emitido__anime'>
                    {e?.emitido ?? 'desconocido'}
                  </span>
                  <span
                    className={`status__anime ${
                      e.estado !== 'finalizado' ? 'airing' : ''
                    } `}>
                    {e.estado}
                  </span>
                  <span className='type__anime'>{e.tipo}</span>
                  <div className='flex items-center rating__anime'>
                    <svg
                      className='w-3 h-3'
                      aria-hidden='true'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='currentColor'
                      viewBox='0 0 22 20'>
                      <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z' />
                    </svg>
                    <p className='ms-2 text-xlarge font-bold text-gray-900 dark:text-white'>
                      {e.rating} - {e.year}
                    </p>
                  </div>
                  <p className='description__anime'>
                    {e.descripcion ?? 'no hay descripcion disponible'}
                  </p>
                </div>
              </div>
            )}
          </article>
        </>
      ))}
    </>
  )
}
