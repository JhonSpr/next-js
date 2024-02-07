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
  const data = await fecthAnimes(anime?.replace(/-/g, ' '))

  if (!data || !data.datos || !data.datos.length) {
    return {
      title: 'Animesz',
      description: '',
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

  // Extraer datos directamente del primer elemento de datos.datos
  const { name, image, descripcion } = data.datos[0]

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

  // Si los datos no están en la caché, obtenerlos de la API
  if (!datos) {
    datos = await fecthAnimes(anime?.replace(/-/g, ' '))
    animeDataCache[anime] = datos
  }

  return (
    <section className='container__'>
      <FetchSingleAnime data={datos?.datos || []} />
    </section>
  )
}
