import { Request_Animes } from '../FetchingData/request_animes'
import Calendario from './Calendario'

export async function generateMetadata() {
  return {
    title: `Calendario - animesz 2024`,
    description: 'calendario de animes primavera 2024',
    ogimage: null,
    siteName: 'animesz',
    keywords: [
      `primavera 2024`,
      'Animes gratis online',
      'Ver anime gratis',
      'Animes de primavera',
      ,
    ],
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

export default async function page() {
  const calendario = await Request_Animes({ calendario: true })

  return <Calendario data={calendario.calendario} />
}
