'use client'
import { useEffect, useState } from 'react'

import { useTheme } from 'next-themes'

export default function Comments({
  shortname = 'animesz-3',
  marginTop,
  noButton,
  showCommentarios,
}) {
  const { theme } = useTheme()
  const [showComments, setshowComments] = useState(false)
  const [identifier, setIdentifier] = useState('')
  const [url, setUrl] = useState('')

  const handleShowComments = () => {
    setshowComments(!showComments)
  }

  useEffect(() => {
    const loadDisqus = () => {
      const disqusScript = document.createElement('script')
      disqusScript.src = `https://${shortname}.disqus.com/embed.js`
      disqusScript.async = true
      disqusScript.setAttribute('data-timestamp', +new Date())
      document.body.appendChild(disqusScript)
    }

    const setDisqusTheme = () => {
      if (
        window.DISQUSWIDGETS &&
        typeof window.DISQUSWIDGETS.override === 'function'
      ) {
        const disqusConfig = {
          theme: theme === 'dark' ? 'dark' : 'light',
          backgroundColor: theme === 'dark' ? '#111' : '#111',
        }
        window.DISQUSWIDGETS.override(disqusConfig)
      }
    }

    if (!window.DISQUS) {
      loadDisqus()
    } else {
      window.DISQUS.reset({
        reload: true,
        config: function () {
          this.page.identifier = identifier
          this.page.title = 'animesz'
          this.page.url = url
        },
      })
      setDisqusTheme()
    }
  }, [identifier, url, theme])

  useEffect(() => {
    setshowComments(false)
    setIdentifier(window.location.pathname)
    setUrl(window.location.href)
  }, [theme])

  return (
    <>
      <div className={`comments `} style={{ marginTop: marginTop }}>
        <a
          className={`btn_comments ${noButton ? 'disable' : ''} ${
            theme === 'dark' ? 'dark' : ''
          }`}
          onClick={handleShowComments}>
          {showComments || showCommentarios
            ? 'Ocultar Comentarios'
            : 'Mostrar Comentarios'}
        </a>

        <div
          className={`comments_container ${
            showComments || showCommentarios ? 'show' : ''
          } ${theme === 'dark' ? 'dark' : ''}`}>
          <div
            id={`disqus_thread`}
            className={`${theme === 'dark' ? 'dark' : ''}`}></div>
          <div
            id={`disqus-recommendations`}
            className={`${theme === 'dark' ? 'dark' : ''}`}></div>
        </div>
      </div>
    </>
  )
}
