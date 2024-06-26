'use client'
import './app.css'
import './DarkMode.css'
import './desktop.css'
import './filterMenu.css'
import './globals.css'
import './mobile.css'
import './tablet.css'
import './owl.carousel.css'
import Navigation from './components/Navigation'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Providers } from './providers'
import Footer from './components/Footer'
import { Analytics } from '@vercel/analytics/react'
import 'react-toastify/dist/ReactToastify.css'
export default function RootLayout({ children }) {
  return (
    <html lang='es'>
      <head>
        <link
          href='https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.2.1/flowbite.min.css'
          rel='stylesheet'
        />
        <link
          rel='icon'
          href='https://i.postimg.cc/L8gP10cN/animesz-high-resolution-logo-transparent-1.png'
        />
        <script src='https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.2.1/flowbite.min.js'></script>
      </head>
      <body>
        <Providers>
          <Navigation />
          <SpeedInsights />
          <Analytics />
          {children}

          <Footer />
        </Providers>
        <script
          id='dsq-count-scr'
          src='//animesz-1.disqus.com/count.js'
          async></script>
      </body>
    </html>
  )
}
