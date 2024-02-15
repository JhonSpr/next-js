'use client'

import { useEffect, useState } from 'react'
import useRecomends from '../Hooks/Recomends'

const Carousel = ({ data }) => {
  const [esDispositivoMovil, setEsDispositivoMovil] = useState(false)

  useEffect(() => {
    function handleResize() {
      // Verificar si el ancho de la ventana es menor que cierto valor (por ejemplo, 768 para tabletas)
      setEsDispositivoMovil(window.innerWidth < 768)
    }

    // Agregar un event listener para el evento de cambio de tamaño de la ventana
    window.addEventListener('resize', handleResize)

    // Llamar a handleResize una vez al inicio para establecer el estado inicial
    handleResize()

    // Limpiar el event listener en el cleanup de useEffect
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  const { uniqueArray } = useRecomends()
  const end = Number(esDispositivoMovil ? 6 : 5)
  return uniqueArray
    ?.map((e, index) => (
      <div className='carouse__item' key={index}>
        <a href={e.name.replace(/ /g, '-').toLowerCase()}>
          <img src={e.image} alt='' />
        </a>
      </div>
    ))
    .slice(0, end)
}

export default Carousel