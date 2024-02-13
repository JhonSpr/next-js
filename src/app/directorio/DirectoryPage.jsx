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
        <AnimesFectching data={data.datos} />

        {data?.item == 0 ? <span>No hay resultados</span> : null}
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
