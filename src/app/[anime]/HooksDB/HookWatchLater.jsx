import { child, get, getDatabase, ref, set } from 'firebase/database'

const useWatchLater = ({
  user,
  setIsVisible,
  setFirstClicked,
  setMessage,
  setNoLogged,
  setRemove,
}) => {
  async function updateWatchLater(animeId, userId) {
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
        const userVoteSnapshot = await get(userVotesRef)
        let userVote = userVoteSnapshot.val() || {}

        const enEsperaSnapshot = await get(child(animeRef, 'enEspera'))
        let currentEnEspera = enEsperaSnapshot.val() || 0

        if (userVote.enEspera) {
          // Si ya está en la lista de espera, lo quitamos
          currentEnEspera--
          await Promise.all([
            set(child(animeRef, 'enEspera'), currentEnEspera),
            set(userVotesRef, { ...(userVote || {}), enEspera: false }),
          ])
          setMessage('El anime fue removido de tu lista de espera.')
        } else {
          // Si no está en la lista de espera, lo agregamos
          currentEnEspera++
          await Promise.all([
            set(child(animeRef, 'enEspera'), currentEnEspera),
            set(userVotesRef, { ...(userVote || {}), enEspera: true }),
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
