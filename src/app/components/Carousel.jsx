'use client'
import { useEffect, useState } from 'react'
import useRecomends from '../Hooks/Recomends'
import dynamic from 'next/dynamic'

// Importa jQuery de manera dinámica para evitar problemas con SSR
const $ = dynamic(() => import('jquery'), {
  ssr: false,
})

const OwlCarousel = dynamic(() => import('react-owl-carousel'), {
  ssr: false,
})

if (typeof window !== 'undefined') {
  window.$ = window.jQuery = require('jquery')
}
const Carousel = ({ data }) => {
  const [esDispositivoMovil, setEsDispositivoMovil] = useState(false)

  const Responsive = {
    0: { items: 3, margin: 2 },
    768: { items: 4, margin: 10 },
    1024: { items: 5, margin: 20 },
  }

  const setting = {
    items: 5,
    responsive: Responsive,
    autoplay: true,
    autoplayTimeout: 2000,
    lazyContent: true,
    lazyLoad: true,
    loop: true,
    nav: true,
    autoplayHoverPause: true,
    dots: true,
  }

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
  return (
    <OwlCarousel {...setting}>
      {uniqueArray
        ?.map((e, index) => (
          <div className='carouse__item' key={index}>
            <a href={e.name.replace(/ /g, '-').toLowerCase()}>
              <img src={e.image} alt='' />
            </a>
          </div>
        ))
        .slice(0, 12)}
    </OwlCarousel>
  )
}

export default Carousel
