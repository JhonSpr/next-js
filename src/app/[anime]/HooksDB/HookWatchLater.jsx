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

  return { updateWatchLater }
}

export default useWatchLater
