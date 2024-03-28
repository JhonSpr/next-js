import { FaCirclePlay } from 'react-icons/fa6'
import { Request_Animes } from './FetchingData/request_animes'
import { CarouselSoloItem } from './components/Carousel'
import SideBar, { SideBar__2 } from './components/SideBar'
import { BsBookmarkStarFill } from 'react-icons/bs'
import PopularSection from './components/popular__section'
import SectionComponent from './components/SectionComponent'

export async function generateMetadata() {
  {
    return {
      title: 'Animesz',
      description: 'animes gratis sub español - audio latino | animesz',
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

export default async function Home() {
  const Emisiones = await Request_Animes({ estado: ['en emision'] })
  const ultimos__episodios = await Request_Animes({ recien: true })
  const recientAgregados = await Request_Animes({
    page: 1,
    limit: '30',
    ova: false,
  })
  const ovas = await Request_Animes({ page: 1, ova: true })
  const MasVisitas = await Request_Animes({ page: 1, visitas: 'masVisitas' })
  const MasVotados = await Request_Animes({ page: 1, rate: 'mayor' })
  return (
    <main>
      <div className='container__ section'>
        <section>
          <CarouselSoloItem
            ArrayList={Emisiones.datos}
            itemsShow={1}
            solo={true}
          />
          <span className='title'>
            <BsBookmarkStarFill />
            ovas agregados
          </span>
          <section className='recientes'>
            {ovas.datos
              .map((e, index) => (
                <article className='anime__card ova' key={index}>
                  <a href={`/${e.name.replace(/ /g, '-')}`}>
                    <div className='container__image__card ova'>
                      <div className='overlay'>
                        <FaCirclePlay />
                      </div>
                      <img src={e.image} alt='' />
                    </div>
                  </a>
                  <div className='ds'>
                    <span
                      className={
                        e.estado === 'finalizado' ? 'status end' : 'status'
                      }>
                      {e.estado}
                    </span>
                    <span className='type'>{e.tipo}</span>
                  </div>
                  <span className='anime__name'>{e.name}</span>
                </article>
              ))
              .slice(0, 8)}
          </section>
        </section>
        <SideBar ultimos__episodios={ultimos__episodios} ovas={ovas} />
      </div>
      <PopularSection MasVotados={MasVotados} />
      <SectionComponent MasVisitas={MasVisitas} />

      <div className='container__ section'>
        <section>
          <span className='title'>
            <BsBookmarkStarFill />
            Recien Agregados
          </span>
          <section className='recientes'>
            {recientAgregados.datos
              .map((e, index) => (
                <article className='anime__card' key={index}>
                  <a href={`/${e.name.replace(/ /g, '-')}`}>
                    <div className='container__image__card'>
                      <div className='overlay'>
                        <FaCirclePlay />
                      </div>
                      <img src={e.image} alt='' />
                    </div>
                  </a>
                  <div className='ds'>
                    <span
                      className={
                        e.estado === 'finalizado' ? 'status end' : 'status'
                      }>
                      {e.estado}
                    </span>
                    <span className='type'>{e.tipo}</span>
                  </div>
                  <span className='anime__name'>{e.name}</span>
                </article>
              ))
              .slice(0, 20)}
          </section>
        </section>
        <SideBar__2 list__rews={recientAgregados} />
      </div>
    </main>
  )
}
