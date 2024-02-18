import { Request_Animes } from '../FetchingData/request_animes'
import DirectoryPage from './DirectoryPage'

export async function generateMetadata({ params }) {
  {
    return {
      title: 'Directorio | Animesz',
      description: 'Directorio de animes | animesz',
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
}

export default async function page({ searchParams }) {
  const años = Array.isArray(searchParams?.años)
    ? searchParams?.años
    : searchParams?.años
    ? [searchParams?.años]
    : []
  const generos = Array.isArray(searchParams?.generos)
    ? searchParams?.generos
    : searchParams?.generos
    ? [searchParams.generos]
    : []
  const estados = Array.isArray(searchParams?.estado)
    ? searchParams?.estado
    : searchParams?.estado
    ? [searchParams.estado]
    : []
  const current_page = Number(searchParams?.page || 1)
  const querySearch = searchParams?.q
  const tipos = searchParams?.tipos
  const sortBy = searchParams?.sortBy
  const rate = searchParams?.rate
  const letra = Array.isArray(searchParams?.letra)
    ? searchParams?.letra
    : searchParams?.letra
    ? [searchParams.letra]
    : []
  const requestParams = {
    page: current_page,
    search: querySearch,
    estado: estados,
    años: años,
    tipo: tipos,
    sortBy: sortBy,
    rate: rate,
    genero: generos,
    letra: letra,
  }
  const data = await Request_Animes(requestParams)

  const query = searchParams?.q || ''
  return (
    <DirectoryPage
      letra={letra}
      data={data}
      query={query}
      estados={estados}
      años={años}
      current_page={current_page}
      generos={generos}
    />
  )
}
