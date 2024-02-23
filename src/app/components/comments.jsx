'use client'
import { useContext, useEffect, useState } from 'react'
import { FaComments } from 'react-icons/fa6'
import { contextApp } from '../providers'
import { useTheme } from 'next-themes'

export default function Comments({
  shortname = 'animesz-3',
  url = 'https://animesz.vercel.app',
  title = 'animesz',
  identifier = 'animesz-3',
  marginTop,
  noButton,
  showCommentarios,
}) {
  const { theme } = useTheme()
  const [showComments, setshowComments] = useState(false)
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
          // Agrega el color de fondo según el tema
          backgroundColor: theme === 'dark' ? '#111' : '#111',
        }
        window.DISQUSWIDGETS.override(disqusConfig)
      }
    }

    if (!window.DISQUS) {
      // Si Disqus no está cargado, cargar el script asincrónicamente
      loadDisqus()
    } else {
      // Si Disqus ya está cargado, simplemente resetear la configuración
      window.DISQUS.reset({
        reload: true,
        config: function () {
          this.page.identifier = identifier
          this.page.title = title
          this.page.url = url
        },
      })
      // Establecer el tema de Disqus cuando el componente se monta
      setDisqusTheme()
    }

    // Función de limpieza
    return () => {
      const disqusThread = document.getElementById('disqus_thread')
      if (disqusThread) {
        while (disqusThread.firstChild) {
          disqusThread.removeChild(disqusThread.firstChild)
        }
      }
    }

    async function getDisqusRecommendations(threadId) {
      try {
        const API_KEY =
          'KmCWY1eT1dbwXPfr54T9i8llx7qdtcC9NnSe9QBfPgCCSjJDHHGjlVWxi3DV2jA1'
        const FORUM_ID = 'tu-ID-de-foro'
        const response = await axios.get(
          `https://disqus.com/api/3.0/threads/listRelated.json?api_key=${API_KEY}&forum=${FORUM_ID}&thread=${threadId}`
        )
        return response.data.response
      } catch (error) {
        console.error('Error al obtener recomendaciones de Disqus:', error)
        return null
      }
    }

    // Ejemplo de uso: Obtener las recomendaciones para un hilo específico
    const threadId = 'tu-ID-de-hilo'
    getDisqusRecommendations(threadId).then((recommendations) => {
      console.log('Recomendaciones de Disqus:', recommendations)
    })
  }, [theme, showComments])

  useEffect(() => {
    setshowComments(false)
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
        <div
          id={`disqus_thread`}
          className={`${theme === 'dark' ? 'dark' : ''}`}></div>
        <div
          id={`disqus_recommendations`}
          className={`${theme === 'dark' ? 'dark' : ''}`}></div>
      </div>
    </div>
  )
}
