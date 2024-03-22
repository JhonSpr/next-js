'use client'
import { useContext, useEffect, useState } from 'react'
import { contextApp } from '../providers'

export default function Comments({
  shortname = 'animesz-1',
  marginTop,
  noButton,
  showCommentarios,
}) {
  const { theme } = useContext(contextApp)
  const [showComments, setShowComments] = useState(false)

  const handleShowComments = () => {
    setShowComments(!showComments)
  }

  useEffect(() => {
    const loadDisqus = () => {
      const disqusScript = document.createElement('script')
      disqusScript.src = `https://${shortname}.disqus.com/embed.js`
      disqusScript.async = true
      disqusScript.setAttribute('data-timestamp', +new Date())
      document.body.appendChild(disqusScript)
    }

    loadDisqus()

    const styleLink = document.createElement('link')
    styleLink.rel = 'stylesheet'
    styleLink.href = '../app.css' // Ruta a tu archivo de estilos personalizados para Disqus
    document.head.appendChild(styleLink)
  }, [theme])

  return (
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
        <div>
          <div
            id='disqus_thread'
            className={`${theme === 'dark' ? 'dark' : ''}`}></div>
        </div>
        <div
          id={`disqus-recommendations`}
          className={`${theme === 'dark' ? 'dark' : 'light'}`}></div>
      </div>
    </div>
  )
}
