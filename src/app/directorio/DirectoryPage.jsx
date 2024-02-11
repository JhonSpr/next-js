import React, { Suspense } from 'react'
import AnimesFectching from './animesFetch'
import Search from './Search'
import { FilterMenu } from '../components/Filters'
import Pagination from '../components/Pagination'

const DirectoryPage = ({
  años,
  generos,
  query,
  current_page,
  data,
  estados,
}) => {
  return (
    <div className='container__'>
      <Search />
      <FilterMenu queryAños={años} queryGeneros={generos} />
      <section className='list__animes' style={{ minHeight: '80dvh' }}>
        <title>Directorio | animesz</title>
        <Suspense key={query + current_page + años + generos + data + estados}>
          <AnimesFectching data={data.datos} />

          {data?.item == 0 ? <span>No hay resultados</span> : null}
        </Suspense>
      </section>
      <Pagination
        current_page={Number(current_page)}
        results={data?.item}
        genre={generos}
        año={años}
        search={query}
        estado={estados}
      />
    </div>
  )
}

export default DirectoryPage
