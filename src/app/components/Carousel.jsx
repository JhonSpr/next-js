'use client'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { FaChevronRight } from 'react-icons/fa6'
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from 'react-icons/fa'

const $ = dynamic(() => import('jquery'), {
  ssr: false,
})

const OwlCarousel = dynamic(() => import('react-owl-carousel'), {
  ssr: false,
})

if (typeof window !== 'undefined') {
  window.$ = window.jQuery = require('jquery')
}
const Carousel = ({ itemsShow, ArrayList, solo }) => {
  const [loaded, setLoaded] = useState(false)
  const [setting, setSetting] = useState(null)

  useEffect(() => {
    // Configuración del carrusel
    const Responsive = {
      0: { items: 3, margin: 2 },
      768: { items: 4, margin: 0 },
      1024: { items: itemsShow, margin: 0 },
    }

    const carouselSetting = {
      items: itemsShow,
      responsive: Responsive,
      autoplay: true,
      autoplayTimeout: 3000,
      lazyLoad: true,
      loop: true,
      nav: true,
      autoplayHoverPause: true,
      dots: true,
      animateOut: 'fadeOut',
      animateIn: 'fadeOut',
      onTranslated: () => {
        setLoaded(true)
      },
    }

    setSetting(carouselSetting)
  }, [itemsShow])

  return (
    <OwlCarousel {...setting}>
      {ArrayList?.map((e, index) => (
        <div className={`carouse__item`} key={index}>
          <a href={e.name?.replace(/ /g, '-').toLowerCase()}>
            <img src={e?.image} alt='' />
          </a>
        </div>
      )).slice(0, 12)}
    </OwlCarousel>
  )
}

export const CarouselSoloItem = ({ itemsShow, ArrayList, solo }) => {
  const [setting, setSetting] = useState(null)

  useEffect(() => {
    const Responsive = {
      0: { items: 1, margin: 2 },
      768: { items: 1, margin: 2 },
      1024: { items: 1, margin: 2 },
    }

    const carouselSetting = {
      items: itemsShow,
      responsive: Responsive,
      autoplay: true,
      autoplayTimeout: 7000,
      lazyLoad: true,
      loop: true,
      nav: true,
      autoplayHoverPause: true,
      dots: true,
      animateOut: 'fadeOut',
    }

    setSetting(carouselSetting)
  }, [itemsShow])

  return (
    <OwlCarousel {...setting} className='hero__slider'>
      {ArrayList?.map((e, index) => (
        <div className='item' key={index}>
          <img src={e.banner ?? e.image} alt='' />

          <div className='hero__text'>
            <h2>{e.name}</h2>
            <a href={`/${e.name.replace(/ /g, '-')}`}>
              <span>
                <strong>Ver Ahora</strong> <FaChevronRight />
              </span>
            </a>
          </div>
        </div>
      ))}
    </OwlCarousel>
  )
}
export default Carousel
