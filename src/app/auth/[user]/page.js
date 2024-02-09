'use client'

import LogoutButton from '@/app/components/logout'
import { contextApp } from '@/app/providers'
import { getAuth, updateProfile } from 'firebase/auth'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { useRouter } from 'next/navigation'
import { useContext, useState } from 'react'
import { useCookies } from 'react-cookie'

const Page = () => {
  const [cookie, setCookie] = useCookies(['username'])
  const { dataUser, theme, updateUserProfilePhoto } = useContext(contextApp)
  const username = cookie?.username?.replace(/-/g, ' ')
  const router = useRouter()
  const [newPhoto, setNewPhoto] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  if (!username) {
    router.push('/')
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    setSelectedFile(file)
    setNewPhoto(file)
  }

  // useEffect(() => {
  //   setTimeout(() => {
  //     setIsLoading(false)
  //     setIsLoading2(false)
  //   }, 2000)
  // }, [])

  const handleUploadPhoto = async () => {
    if (!newPhoto) {
      // setMessage
      alert('Selecciona una imagen antes de subirla.')
      // setActive(true)
      // setTimeout(() => {
      //   setActive(false)
      // }, 2000)
      return
    }

    try {
      const storage = getStorage()
      const storageRef = ref(
        storage,
        `user-photos/${dataUser?.uid}/${newPhoto.name}`
      )
      await uploadBytes(storageRef, newPhoto)
      const photoUrl = await getDownloadURL(storageRef)
      const auth = getAuth()
      await updateProfile(auth.currentUser, { photoURL: photoUrl })
      updateUserProfilePhoto(photoUrl)
      setNewPhoto(null)
      // setMessage('avatar actualizado')
      // setActive(true)
      // setTimeout(() => {
      //   setActive(false)
      // }, 2000)
    } catch (error) {
      console.log(error.message || 'Hubo un error al procesar la solicitud')
      // setActive(true)
      // setTimeout(() => {
      //   setActive(false)
      // }, 2000)
    }

    setSelectedFile(null)
  }
  const handleResendVerificationEmail = async () => {
    try {
      const auth = getAuth()
      await sendEmailVerification(auth.currentUser)
    } catch (error) {
      // setMessage(error.message || 'Hubo un error al procesar la solicitud')
      // setActive(true)
      // setTimeout(() => {
      //   setActive(false)
      // }, 2000)
    }
  }
  const photoURL =
    dataUser?.photoURL || 'https://i.postimg.cc/4xtHm8nz/images.jpg'
  return (
    <div className='container__user__page'>
      <title>perfil de usuario</title>
      <div className={`info__user ${theme == 'dark' ? 'dark' : ''}`}>
        <div className='container__options__user'>
          <span>Mi lista</span>
          <span>Ver mas tarde</span>
          <span>Animes pendientes</span>
          <span>Ultimos capitulos vistos</span>
        </div>
        <div className='information'>
          <img src={photoURL} alt='' />
          <span>{username}</span>
        </div>
        <LogoutButton />
        <div>
          <div className='file-input-container'>
            <input
              type='file'
              className='file-input'
              onChange={handleFileChange}
              accept='image/*'
              style={{ cursor: 'pointer' }}
            />
            <button className='button__profile__page'>Cambiar Avatar</button>
            {selectedFile && (
              <span className='file-name'>{selectedFile.name}</span>
            )}
          </div>
          <button onClick={handleUploadPhoto} className='button__profile__page'>
            Guardar Cambios
          </button>
          {dataUser?.user?.emailVerified ? null : (
            <button
              onClick={handleResendVerificationEmail}
              className='btn__verify__account'>
              verificar cuenta
            </button>
          )}
        </div>
      </div>

      <div className='cards'>
        <h4>Mi lista</h4>
      </div>
    </div>
  )
}

export function calcularRating(likes, dislikes) {
  const totalVotos = likes + dislikes

  if (totalVotos === 0) {
    return 0
  }

  const rating = (likes + 1) / (totalVotos + 2)
  const ratingEnEscalaDe10 = rating * 10

  return ratingEnEscalaDe10?.toFixed(2)
}
export default Page
