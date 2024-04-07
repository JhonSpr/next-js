import { child, get, getDatabase, ref, set } from 'firebase/database'
import { ToastContainer, toast } from 'react-toastify'
const useWatchLater = ({
  user,
  setIsVisible,
  setFirstClicked,
  setMessage,
  setNoLogged,
  setRemove,
}) => {
  async function updateWatchLater(animeId, userId, animeName, animeImage) {
    try {
      if (!user) {
        setMessage('Debes iniciar sesión para usar esta función')
        setNoLogged(true)
        setTimeout(() => {
          setNoLogged(false)
        }, 2000)
        return
      } else {
        const db = getDatabase()
        const animeRef = ref(db, `animes/${animeId}`)
        const userVotesRef = ref(db, `usersVotes/${userId}/${animeId}`)
        const userRef = ref(db, `users/${userId}`)

        const userVoteSnapshot = await get(userVotesRef)
        let userVote = userVoteSnapshot.val() || {}

        const snapshot = await get(userRef)
        const userData = snapshot?.val() || {}

        const enEsperaSnapshot = await get(child(userRef, 'EnEspera'))
        let currentEnEspera = enEsperaSnapshot.val() || []

        const existingAnimeIndex = currentEnEspera.findIndex(
          (item) => item.name === animeName
        )

        if (existingAnimeIndex !== -1) {
          // Si ya está en la lista de espera, lo quitamos
          currentEnEspera.splice(existingAnimeIndex, 1)
          await Promise.all([
            set(child(animeRef, 'enEspera'), 0),
            set(userVotesRef, { ...(userVote || {}), enEspera: false }),
            set(child(userRef, 'EnEspera'), currentEnEspera),
          ])
          setMessage('El anime fue removido de tu lista de espera.')
        } else {
          // Si no está en la lista de espera, lo agregamos
          currentEnEspera.push({ name: animeName, image: animeImage })
          await Promise.all([
            set(child(animeRef, 'enEspera'), 1),
            set(userVotesRef, { ...(userVote || {}), enEspera: true }),
            set(child(userRef, 'EnEspera'), currentEnEspera),
          ])
          setMessage('El anime fue agregado a tu lista de espera.')
        }

        setIsVisible(true)
        setRemove(false)
        setTimeout(() => {
          setIsVisible(false)
          setRemove(false)
        }, 2000)

        setFirstClicked(false)
      }
    } catch (error) {
      console.error('Error al actualizar la lista de espera del anime:', error)
      setMessage(
        'Error al actualizar la lista de espera del anime. Por favor, inténtalo de nuevo más tarde.'
      )
    }
  }

  async function updateLikes(animeId, userId) {
    try {
      if (!user) {
        toast.info('debes iniciar sesión para usar esta función')
        setMessage('Debes iniciar sesión para usar esta función')
        setNoLogged(true)
        setTimeout(() => {
          setNoLogged(false)
        }, 2000)
        return
      } else {
        const db = getDatabase()
        const animeRef = ref(db, `animes/${animeId}`)
        const userVotesRef = ref(db, `usersVotes/${userId}/${animeId}`)
        const userVoteSnapshot = await get(userVotesRef)
        const userVote = userVoteSnapshot.val() || {}

        const likesSnapshot = await get(child(animeRef, 'likes'))
        let currentLikes = likesSnapshot.val() || 0

        if (userVote.dislike) {
          toast.error('ya haz votado!')
          setMessage('Ya has dado dislike a este anime.')
          setIsVisible(true)
          setRemove(false)
          setTimeout(() => {
            setIsVisible(false)
            setRemove(false)
          }, 2000)
        } else if (userVote.like) {
          currentLikes--
          await Promise.all([
            set(child(animeRef, 'likes'), currentLikes),
            set(userVotesRef, { ...userVote, like: false }),
          ])
          toast.success('se elimino tu voto')
          setMessage('Like eliminado.')
          setIsVisible(true)
          setRemove(false)
          setTimeout(() => {
            setIsVisible(false)
            setRemove(false)
          }, 2000)
        } else {
          currentLikes++
          await Promise.all([
            set(child(animeRef, 'likes'), currentLikes),
            set(userVotesRef, { ...userVote, like: true }),
          ])
          toast.success('voto registrado')
          setMessage('Like registrado.')
          setIsVisible(true)
          setRemove(false)
          setTimeout(() => {
            setIsVisible(false)
            setRemove(false)
          }, 2000)
        }
        setFirstClicked(false)
      }
    } catch (error) {
      console.error('Error al actualizar los likes del anime:', error)
      setMessage(
        'Error al actualizar los likes del anime. Por favor, inténtalo de nuevo más tarde.'
      )
    }
  }

  async function updateDislikes(animeId, userId) {
    try {
      if (!user) {
        toast.info('debes iniciar sesión para usar esta función')
        setMessage('Debes iniciar sesión para usar esta función')
        setNoLogged(true)
        setTimeout(() => {
          setNoLogged(false)
        }, 2000)
        return
      } else {
        const db = getDatabase()
        const animeRef = ref(db, `animes/${animeId}`)
        const userVotesRef = ref(db, `usersVotes/${userId}/${animeId}`)
        const userVoteSnapshot = await get(userVotesRef)
        const userVote = userVoteSnapshot.val() || {}

        const dislikesSnapshot = await get(child(animeRef, 'dislikes'))
        let currentDislikes = dislikesSnapshot.val() || 0

        if (userVote.like) {
          toast.error('ya haz votado!')
          setMessage('Ya has dado like a este anime.')
          setIsVisible(true)
          setRemove(false)
          setTimeout(() => {
            setIsVisible(false)
            setRemove(false)
          }, 2000)
        } else if (userVote.dislike) {
          currentDislikes--
          await Promise.all([
            set(child(animeRef, 'dislikes'), currentDislikes),
            set(userVotesRef, { ...userVote, dislike: false }),
          ])
          toast.success('se elimino tu voto')
          setMessage('Dislike eliminado.')
          setIsVisible(true)
          setRemove(false)
          setTimeout(() => {
            setIsVisible(false)
            setRemove(false)
          }, 2000)
        } else {
          currentDislikes++
          await Promise.all([
            set(child(animeRef, 'dislikes'), currentDislikes),
            set(userVotesRef, { ...userVote, dislike: true }),
          ])
          toast.success('voto registrado')
          setMessage('Dislike registrado.')
          setIsVisible(true)
          setRemove(false)
          setTimeout(() => {
            setIsVisible(false)
            setRemove(false)
          }, 2000)
        }
        setFirstClicked(false)
      }
    } catch (error) {
      console.error('Error al actualizar los dislikes del anime:', error)
      setMessage(
        'Error al actualizar los dislikes del anime. Por favor, inténtalo de nuevo más tarde.'
      )
    }
  }

  return { updateWatchLater, updateDislikes, updateLikes }
}

export default useWatchLater
