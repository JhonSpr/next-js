import React from 'react'

export default function Card({ e, index }) {
  return (
    <article key={index} className='card__calendario'>
      <div className='image'>
        <img src={e.image} alt={e.name} />
      </div>
      <div className='description'>
        <a href=''>{e.name}</a>
        <p>{e.nextEpisode}</p>
      </div>
    </article>
  )
}
