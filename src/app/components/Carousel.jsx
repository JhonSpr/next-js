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
const Carousel = ({ animecurrent, genero1, genero2 }) => {
  useEffect(() => {
    // Verifica si OwlCarousel está disponible en el navegador
    if (typeof window !== 'undefined') {
      // Agrega la clase de animación de desvanecimiento al salir del carrusel
      document.querySelectorAll('.owl-item').forEach((item) => {
        item.classList.add('fadeOut')
      })
    }
  }, [])
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
    animateOut: true,
    animateIn: false,
  }

  const { uniqueArray } = useRecomends(animecurrent, genero1, genero2)
  return (
    <OwlCarousel {...setting}>
      {uniqueArray
        ?.map((e, index) => (
          <div className='carouse__item' key={index}>
            <a href={e.name?.replace(/ /g, '-').toLowerCase()}>
              <img src={e?.image} alt='' />
            </a>
          </div>
        ))
        .slice(0, 12)}
    </OwlCarousel>
  )
}

export default Carousel
