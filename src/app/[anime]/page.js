import { Request_Animes } from '../FetchingData/request_animes'
import { FetchSingleAnime } from './ListAnimes'

let animeDataCache = {}

const fecthAnimes = async (name) => {
  try {
    const res = await fetch(
      `https://api-rest.up.railway.app/api/v1/animes?info=${name}`,
      {
        next: { revalidate: 50 },
      },
      { caches: 'no-store' }
    )
    return res.json()
  } catch (error) {
    console.error('Error fetching anime data:', error)
    return null
  }
}

export async function generateMetadata({ params }) {
  const { anime } = params
  const data = await Request_Animes({ info: anime?.replace(/-/g, ' ') })

  const { name, descripcion } = data.datos[0]

  return {
    title: `${name} - Animesz`,
    description: descripcion,
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

export default async function page({ params }) {
  const { anime } = params
  let datos = animeDataCache[anime]

  const name = anime?.replace(/-/g, ' ')

  // Si los datos no están en la caché, obtenerlos de la API
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
    <section className='container__anime'>
      <FetchSingleAnime
        data={datos?.datos || []}
        animeName={anime.replace(/-/g, ' ')}
      />
    </section>
  )
}
