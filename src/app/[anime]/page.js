import { Request_Animes } from '../FetchingData/request_animes'
import { FetchSingleAnime } from './ListAnimes'

let animeDataCache = {}

export async function generateMetadata({ params }) {
  const { anime } = params
  const data = await Request_Animes({ info: anime?.replace(/-/g, ' ') })

  const { name, descripcion, image, genero1 } = data.datos[0]

  return {
    title: `${name?.replace(/:/g, ' ')} - Animesz`,
    description: descripcion,
    ogimage: { image },
    siteName: 'animesz',
    keywords: [
      `${genero1}`,
      'Animes gratis online',
      'Ver anime gratis',
      'Animesz',
      `${anime?.replace(/-/g, ' ')}`,
    ],
    openGraph: {
      title: `${anime?.replace(/-/g, ' ')} - Animesz`,
      description: descripcion,
      images: [
        {
          url: image,
          width: 800,
          height: 600,
          alt: `${anime?.replace(/-/g, ' ')} - Animesz`,
        },
      ],
    },
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

export default async function page({ params }) {
  const { anime } = params
  let datos = animeDataCache[anime]

  const name = anime?.replace(/-/g, ' ')

  if (!datos) {
    datos = await Request_Animes({
      page: 1,
      search: false,
      estado: [],
      años: [],
      tipo: [],
      sortBy: [],
      rate: [],
      genero: [],
      info: name,
    })
    animeDataCache[anime] = datos
  }

  return (
    <>
      <FetchSingleAnime
        data={datos?.datos || []}
        animeName={anime.replace(/-/g, ' ')}
      />
    </>
  )
}
