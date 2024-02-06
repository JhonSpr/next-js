import { FetchSingleAnime } from './ListAnimes'

export default async function page({ params }) {
  const { anime } = params
  return (
    <section className='container__'>
      <title>{anime.replace(/-/g, ' ')}</title>
      <FetchSingleAnime name={`${anime.replace(/-/g, ' ')}`} />
    </section>
  )
}
