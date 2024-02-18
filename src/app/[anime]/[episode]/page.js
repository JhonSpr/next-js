import EpisodePage from './episodePage'

export async function generateMetadata({ params }) {
  const { anime, episode } = params

  return {
    title: `${anime?.replace(
      /-/g,
      ' '
    )} episiodio ${episode} - sub español - audio latino`,
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

function page({ params }) {
  const episode = Number(params.episode)
  const name = params.anime.replace(/-/g, ' ')

  return (
    <div style={{ minHeight: '80dvh' }}>
      <EpisodePage name={name} episode={episode} />
    </div>
  )
}

export default page
