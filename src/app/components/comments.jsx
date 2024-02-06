'use client'
import { useContext, useEffect, useState } from 'react'
import { FaComments } from 'react-icons/fa6'
import { contextApp } from '../providers'
import { useTheme } from 'next-themes'

export default function Comments({
  classParam,
  shortname = 'animesz-3',
  url = 'https://animesz.vercel.app',
  title = 'animesz',
  identifier = 'animesz-3',
  marginTop,
  noButton,
}) {
  const { theme } = useTheme()
  const [showComments, setshowComments] = useState(false)
  const handleShowComments = () => {
    setshowComments(!showComments)
  }
  useEffect(() => {
    if (window.DISQUS) {
      window.DISQUS.reset({
        reload: true,
        config: function () {
          this.page.identifier = identifier
          this.page.title = title
          this.page.url = url
        },
      })
    } else {
      const script = document.createElement('script')
      script.src = `https://${shortname}.disqus.com/embed.js`
      script.async = true
      script.setAttribute('data-timestamp', +new Date())
      document.body.appendChild(script)
    }

    return () => {
      const disqusThread = document.getElementById('disqus_thread')
      if (disqusThread) {
        while (disqusThread.firstChild) {
          disqusThread.removeChild(disqusThread.firstChild)
        }
      }
    }
  }, [theme, showComments])

  return (
    <div className={`comments `} style={{ marginTop: marginTop }}>
      <a
        className={`btn_comments ${noButton ? 'disable' : ''}`}
        onClick={handleShowComments}>
        {showComments ? 'Ocultar Comentarios' : 'Mostrar Comentarios'}
      </a>

      <div
        className={`comments_container ${showComments ? 'show' : ''} ${
          theme === 'dark' ? 'dark' : ''
        }`}>
        <h3 className={`title ${theme === 'dark' ? 'dark' : ''}`}>
          <FaComments /> Comentarios
        </h3>
        <div id={`disqus_thread`}></div>

        <div id='disqus-recommendations'></div>
      </div>
    </div>
  )
}
