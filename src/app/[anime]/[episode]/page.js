import React from 'react'
import EpisodePage from './episodePage'

function page({ params }) {
  const episode = Number(params.episode)
  const name = params.anime.replace(/-/g, ' ')

  return (
    <div style={{ minHeight: '80dvh' }}>
      <EpisodePage name={name} episode={episode} />
    </div>
  )
}

export default page
