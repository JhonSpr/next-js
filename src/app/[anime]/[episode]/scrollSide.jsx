'use client'

import { useTheme } from 'next-themes'

const ScrollSide = ({ few__added__data }) => {
  const { theme } = useTheme()
  return (
    <div className={`scrollBarSide ${theme === 'light' ? 'light' : 'dark'}`}>
      <div
        className={`container__few__added ${
          theme === 'light' ? 'light' : 'dark'
        }`}>
        {few__added__data?.recientes?.map((e, index) => (
          <a
            href={`/${e?.nombre.replace(/ /g, '-').toLowerCase()}/${e.episode
              ?.split('Episodio')[1]
              ?.replace(/ /g, '')}`}
            key={index}>
            <img src={e.image} alt='' className='few__added__image' />
            <span
              className={`few__added__episode__number ${
                theme === 'light' ? 'light' : 'dark'
              }`}>
              <span>{e.episode}</span>
            </span>
            <span className='few__added__name'>{e.nombre}</span>
          </a>
        ))}
      </div>
      <div className='container__year__animes'>
        <a href='/directorio?años=2024'>2024</a>
        <a href='/directorio?años=2023'>2023</a>
        <a href='/directorio?años=2022'>2022</a>
        <a href='/directorio?años=2021'>2021</a>
        <a href='/directorio?años=2020'>2020</a>
        <a href='/directorio?años=2019'>2019</a>
        <a href='/directorio?años=2018'>2018</a>
        <a href='/directorio?años=2017'>2017</a>
        <a href='/directorio?años=2016'>2016</a>
        <a href='/directorio?años=2015'>2015</a>
        <a href='/directorio?años=2014'>2014</a>
        <a href='/directorio?años=2013'>2013</a>
      </div>
    </div>
  )
}

export default ScrollSide
