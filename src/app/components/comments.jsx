'use client'
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import Disqus from 'disqus-react'

export default function Comments({
  shortname = 'animesz-3',
  marginTop,
  noButton,
  showCommentarios,
  title,
  identifier,
  url,
}) {
  const { theme } = useTheme()
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

    if (!window.DISQUS) {
      loadDisqus()
    }
  }, [])

  const disqusConfig = {
    url,
    identifier,
    title,
  }

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
          <Disqus.DiscussionEmbed shortname={shortname} config={disqusConfig} />
        </div>
        <div
          id={`disqus-recommendations`}
          className={`${theme === 'dark' ? 'dark' : 'light'}`}></div>
      </div>
    </div>
  )
}
