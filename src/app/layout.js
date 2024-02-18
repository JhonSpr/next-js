'use client'
import './app.css'
import './DarkMode.css'
import './desktop.css'
import './filterMenu.css'
import './globals.css'
import './mobile.css'
import './navbar.css'
import './tablet.css'
import './owl.carousel.css'

import Navigation from './components/Navigation'
import { SpeedInsights } from '@vercel/speed-insights/next'

import { Providers } from './providers'
import Footer from './components/Footer'

export default function RootLayout({ children }) {
  return (
    <html lang='es'>
      <head>
        <link
          href='https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.2.1/flowbite.min.css'
          rel='stylesheet'
        />
        <link rel='stylesheet' href='owlcarousel/owl.carousel.min.css' />
        <link rel='stylesheet' href='owlcarousel/owl.theme.default.min.css' />
        <meta name='theme-color' content='#ffffff'></meta>
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
          {children}

          <Footer />
        </Providers>
        <script
          id='dsq-count-scr'
          src='//animesz-3.disqus.com/count.js'
          async></script>
      </body>
    </html>
  )
}
