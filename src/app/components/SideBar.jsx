'use client'

import { useContext, useEffect, useState } from 'react'
import { BiSolidRightArrowSquare } from 'react-icons/bi'
import { obtenerMensajeFecha } from '../[anime]/ListAnimes'
import { ThemeSwitcher } from './ThemeSwitcher'
import { contextApp } from '../providers'
import { Loader } from './LoaderSkeleton'

const SideBar = ({ ultimos__episodios, ovas }) => {
  const [op1, setOp1] = useState(true)
  const [op2, setOp2] = useState(false)
  const [documentLoaded, setDocumentLoaded] = useState(false) // Estado
  const { theme } = useContext(contextApp)

  useEffect(() => {
    setDocumentLoaded(true)
    setTimeout(() => {
      setDocumentLoaded(false)
    }, 0)
  }, [])

  if (documentLoaded === true) {
    return <Loader />
  }
  return (
    <div className='sidebar'>
      <div className='ultimos__episodios'>
        <ThemeSwitcher />

        <div className='buttons'>
          <button
            className='buttons__item'
            onClick={() => {
              setOp1(true)
              setOp2(false)
            }}>
            Ultimos Episodios
          </button>
          <button
            className='buttons__item'
            onClick={() => {
              setOp2(true)
              setOp1(false)
            }}>
            Ovas
          </button>
        </div>

        <div
          className={`sidebar__content ${op1 ? 'show' : 'hide'} ${
            theme === 'dark' ? 'dark' : ''
          }`}>
          {ultimos__episodios.recientes?.map((e, index) => (
            <li key={index}>
              <img src={e.image} alt='' />
              <a
                href={`/${e.nombre.replace(/ /g, '-').toLowerCase()}/${
                  e.number
                }`}>
                <h2>{e.nombre}</h2>
                <span>{e.episode}</span>
              </a>
            </li>
          ))}
        </div>

        <div className={`sidebar__content ${op2 ? 'show' : 'hide'}`}>
          {ovas.datos?.map((e, index) => (
            <li key={index}>
              <img src={e.image} alt='' />
              <a
                href='
            '>
                {e.nombre ?? e.name}
              </a>
            </li>
          ))}
        </div>
      </div>
    </div>
  )
}
export const SideBar__2 = ({ list__rews }) => {
  const [fechas, setFechas] = useState({})

  useEffect(() => {
    const nuevasFechas = {}
    list__rews.datos?.forEach((e) => {
      nuevasFechas[e.id] = obtenerMensajeFecha(e?.fechaAgregado)
    })
    setFechas(nuevasFechas)
  }, [list__rews.datos])
  return (
    <div className='sidebar'>
      <div className='list__rew'>
        <span className='title'>Lista Recien agregados</span>
        <div className={`sidebar__content show rews`}>
          {list__rews.datos?.map((e, index) => (
            <li
              key={index}
              className='card'
              onLoadedData={() =>
                setFechas(obtenerMensajeFecha(e?.fechaAgregado))
              }>
              <a
                href='
              '>
                <span className='name'>
                  <BiSolidRightArrowSquare className='icon' /> {e.name}
                </span>
                <span className='tag'>{fechas[e.id]}</span>
              </a>
            </li>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SideBar
