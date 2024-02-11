import { Request_Animes } from '../FetchingData/request_animes'
import DirectoryPage from './DirectoryPage'
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
  const data = await Request_Animes(
    searchParams?.page,
    searchParams?.q,
    estados,
    años,
    searchParams?.tipos,
    searchParams?.sortBy,
    searchParams?.rate,
    generos
  )

  const query = searchParams?.q || ''
  const current_page = searchParams?.page || 1
  return (
    <DirectoryPage
      data={data}
      query={query}
      estados={estados}
      años={años}
      current_page={current_page}
      generos={generos}
    />
  )
}
