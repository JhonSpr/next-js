'use client'
import './app.css'
import './DarkMode.css'
import './desktop.css'
import './filterMenu.css'
import './globals.css'
import './mobile.css'
import './navbar.css'
import './tablet.css'

import Navigation from './components/Navigation'

import { Providers } from './providers'

export default function RootLayout({ children }) {
  return (
    <html lang='es'>
      <head>
        <link
          rel='stylesheet'
          href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css'
        />
        <meta name='theme-color' content='#ffffff'></meta>
        <link
          rel='icon'
          href='https://i.postimg.cc/L8gP10cN/animesz-high-resolution-logo-transparent-1.png'
        />
      </head>

      <body>
        <Providers>
          <Navigation />
          {children}
          <footer>
            <span>Animesz | animes gratis HD sub español y doblaje latino</span>
          </footer>
        </Providers>
        <script
          id='dsq-count-scr'
          src='//animesz-3.disqus.com/count.js'
          async></script>
      </body>
    </html>
  )
}
