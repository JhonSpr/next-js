import { Request_Animes } from '@/app/FetchingData/request_animes'
import EpisodePage from './episodePage'

export async function generateMetadata({ params }) {
  const { anime, episode } = params
  let name = anime?.replace(/-/g, ' ')
  const data = await Request_Animes({
    info: name,
  })

  const { descripcion } = data.datos[0]

  return {
    title: `${anime?.replace(
      /-/g,
      ' '
    )} episiodio ${episode} - sub español - audio latino`,
    description: `${descripcion}`,
    siteName: 'animesz',
    locale: 'es',
    type: 'website',
    robots: {
      index: false,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: false,
        noimageindex: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'google',
      yandex: 'yandex',
      yahoo: 'yahoo',
    },
  }
}

async function page({ params }) {
  const episode = Number(params.episode)
  const name = params.anime.replace(/-/g, ' ')
  const data = await Request_Animes({
    info: name,
  })

  const { services } = data.datos[0]

  return (
    <div style={{ minHeight: '80dvh' }}>
      <EpisodePage name={name} episode={episode} services={services} />
    </div>
  )
}

export default page
