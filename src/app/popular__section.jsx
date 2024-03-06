'use client'
import { FaStar } from 'react-icons/fa6'
import { FcRating } from 'react-icons/fc'

const PopularSection = ({ MasVotados }) => {
  return (
    <section className='section__popular'>
      <div>
        <span className='title' style={{ color: '#fff' }}>
          <FcRating />
          CON MAS CALIFICACIÓN
        </span>
        {MasVotados.datos
          .map((e, index) => (
            <div className='card__pupular' key={index}>
              <div
                className='background__image'
                style={{ backgroundImage: `url(${e.banner})` }}></div>
              <div className='title-1'>{e.name}</div>
              <div className='content'>{e.descripcion}</div>
              <div className='rating'>
                <FaStar />
                {e.rating}
              </div>
              <button
                className='btn'
                onClick={() => {
                  location.replace(`/${e.name.replace(/ /g, '-')}`)
                }}>
                Ver Ahora
              </button>
              <div className='bar'>
                <div className='filledbar'></div>
              </div>
            </div>
          ))
          .slice(0, 10)}
      </div>
    </section>
  )
}

export default PopularSection
