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
  const [loaded, setLoaded] = useState(false)

  const handleTranslated = () => {
    setLoaded(true)
  }
  const Responsive = {
    0: { items: 3, margin: 2 },
    768: { items: 4, margin: 0 },
    1024: { items: 5, margin: 0 },
  }

  const setting = {
    items: 5,
    responsive: Responsive,
    autoplay: true,
    autoplayTimeout: 2000,
    lazyLoad: true,
    loop: true,
    nav: true,
    autoplayHoverPause: true,
    dots: true,
    lazyLoadEager: 1,
    animateOut: true,
    animateIn: false,
    onTranslated: handleTranslated,
  }

  const { uniqueArray } = useRecomends(animecurrent, genero1, genero2)
  return (
    <OwlCarousel {...setting}>
      {uniqueArray
        ?.map((e, index) => (
          <div
            className={`carouse__item ${!loaded ? 'loading' : ''}`}
            key={index}>
            <a href={e.name?.replace(/ /g, '-').toLowerCase()}>
              <img
                src={e?.image}
                alt=''
                onLoad={() => {
                  setLoaded(true)
                }}
              />
            </a>
          </div>
        ))
        .slice(0, 12)}
    </OwlCarousel>
  )
}

export default Carousel
