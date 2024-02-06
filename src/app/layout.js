'use client'

import Navigation from './components/Navigation'
import './styles/globals.css'
import './styles/navbar.css'
import './styles/app.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/filterMenu.css'
import './Styles/desktop.css'
import './Styles/mobile.css'
import './Styles/tablet.css'
import './Styles/DarkMode.css'
import { Providers } from './providers'

export default function RootLayout({ children }) {
  return (
    <html lang='es'>
      <head>
        <script
          src='https://code.jquery.com/jquery-3.2.1.slim.min.js'
          integrity='sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN'
          crossOrigin='anonymous'></script>
        <script
          src='https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js'
          integrity='sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q'
          crossOrigin='anonymous'></script>
        <script
          src='https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js'
          integrity='sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl'
          crossOrigin='anonymous'></script>

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
