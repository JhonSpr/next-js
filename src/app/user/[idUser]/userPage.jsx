'use client'
import { contextApp } from '@/app/providers'
import { getAuth, signOut, updateProfile } from 'firebase/auth'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { useRouter } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'
import { MdOutlineSettings } from 'react-icons/md'
import { CiLogout } from 'react-icons/ci'
import { auth } from '@/app/firebase'
import Alert from '@/app/components/Alert'
import { FaPlayCircle } from 'react-icons/fa'

const UserPage = () => {
  const {
    dataUser,
    theme,
    updateUserProfilePhoto,
    user,
    favoritos,
    ultimosVistados,
    enEspera,
    episodiosGuardados,
  } = useContext(contextApp)

  const router = useRouter()
  const [newPhoto, setNewPhoto] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [settings, setSettings] = useState(4)
  const [message, setMessage] = useState(false)

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    setSelectedFile(file)
    setNewPhoto(file)
  }

  const handleUploadPhoto = async () => {
    if (!newPhoto) {
      alert('Selecciona una imagen antes de subirla.')

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
      setMessage(true)

      setTimeout(() => {
        setMessage(false)
      }, 2000)
      updateUserProfilePhoto(photoUrl)
      setNewPhoto(null)
    } catch (error) {
      console.log(error.message || 'Hubo un error al procesar la solicitud')
    }

    setSelectedFile(null)
  }
  const handleResendVerificationEmail = async () => {
    try {
      const auth = getAuth()
      await sendEmailVerification(auth.currentUser)
    } catch (error) {}
  }
  const photoURL =
    dataUser?.photoURL || 'https://i.postimg.cc/4xtHm8nz/images.jpg'

  const logout = async () => {
    try {
      await signOut(auth)

      router.push('/')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  const [esDispositivoMovil, setEsDispositivoMovil] = useState(false)

  useEffect(() => {
    function handleResize() {
      // Verificar si el ancho de la ventana es menor que cierto valor (por ejemplo, 768 para tabletas)
      setEsDispositivoMovil(window.innerWidth < 768)
    }

    window.addEventListener('resize', handleResize)

    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleOpen = (id) => {
    if (settings === id) {
      setSettings(4)
    } else {
      setSettings(id)
    }
  }
  return (
    <>
      <title>Panel de control</title>
      <button
        data-drawer-target='sidebar-multi-level-sidebar'
        data-drawer-toggle='sidebar-multi-level-sidebar'
        aria-controls='sidebar-multi-level-sidebar'
        type='button'
        className='inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600'>
        <span className='sr-only'>Open sidebar</span>
        <svg
          className='w-6 h-6'
          aria-hidden='true'
          fill='currentColor'
          viewBox='0 0 20 20'
          xmlns='http://www.w3.org/2000/svg'>
          <path
            clipRule='evenodd'
            fillRule='evenodd'
            d='M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z'></path>
        </svg>
      </button>

      <aside
        id='sidebar-multi-level-sidebar'
        className='fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0'
        aria-label='Sidebar'>
        <div className='h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800'>
          {message && (
            <Alert
              isVisible={message}
              message={'Avatar cambiado correctamente'}
            />
          )}
          <ul className='space-y-2 font-medium'>
            <li>
              <button
                onClick={() => handleOpen(4)}
                className={`flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group dark:text-white dark:hover:bg-gray-700 ${
                  settings === 4 && 'bg-gray-700 text-white'
                }`}>
                Panel de usuario
              </button>
            </li>
            <li>
              <button
                type='button'
                className='flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group  dark:text-white dark:hover:bg-gray-700'
                aria-controls='dropdown-example'
                data-collapse-toggle='dropdown-example'>
                <MdOutlineSettings />

                <span className='flex-1 ms-3 text-left rtl:text-right whitespace-nowrap'>
                  Opciones de usuario
                </span>
                <svg
                  className='w-3 h-3'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 10 6'>
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='m1 1 4 4 4-4'
                  />
                </svg>
              </button>
              <ul id='dropdown-example' className='hidden py-2 space-y-2'>
                <li>
                  <button
                    onClick={() => handleOpen(1)}
                    className={`flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ${
                      settings === 1 && 'bg-gray-700 text-white'
                    }`}>
                    Mi lista de Favoritos
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleOpen(5)}
                    className='flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group  dark:text-white dark:hover:bg-gray-700'>
                    Episodios en espera
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleOpen(2)}
                    className={`flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group  dark:text-white dark:hover:bg-gray-700 ${
                      settings == 2 && 'bg-gray-700 text-white'
                    }`}>
                    Animes Para ver luego
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleOpen(3)}
                    className={`flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group  dark:text-white dark:hover:bg-gray-700
                    ${settings == 3 && 'bg-gray-700 text-white'}`}>
                    Ultimos episodios visitados
                  </button>
                </li>
              </ul>
            </li>
            <li>
              <a
                href='#'
                className='flex items-center p-2 text-gray-900 rounded-lg dark:text-white dark:hover:bg-gray-700 group'>
                <svg
                  className='flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='currentColor'
                  viewBox='0 0 18 18'>
                  <path d='M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z' />
                </svg>
                <span className='flex-1 ms-3 whitespace-nowrap'>
                  Proximamente ...
                </span>
              </a>
            </li>
            <li>
              <button
                onClick={logout}
                className='flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'>
                <CiLogout />

                <span className='flex-1 ms-3 whitespace-nowrap'>
                  Cerrar Sesión
                </span>
              </button>
            </li>
          </ul>
        </div>
      </aside>

      <div className='p-4 sm:ml-64'>
        <div
          className={`     
        p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 
        `}
          style={{ minHeight: '80dvh' }}>
          {settings === 1 && (
            <div
              style={{ minHeight: '80dvh' }}
              className={`grid gap-4 mb-4 ${
                esDispositivoMovil ? 'grid-cols-2' : 'grid-cols-7'
              }`}>
              {favoritos?.map((e, index) => (
                <article key={index} className='favorite__panel__user'>
                  <a href={`/${e.name?.replace(/ /g, '-')}`}>
                    <img src={e.image} alt='' />
                    <div className='overlay'>
                      <FaPlayCircle />
                    </div>
                  </a>
                </article>
              ))}
            </div>
          )}

          {settings === 2 && (
            <div
              style={{ minHeight: '80dvh' }}
              className={`grid gap-4 mb-4 ${
                esDispositivoMovil ? 'grid-cols-2' : 'grid-cols-7'
              }`}>
              {enEspera?.map((e, index) => (
                <article key={index} className='EnEspera__panel__user'>
                  <a href={`/${e.name?.replace(/ /g, '-')}`}>
                    <img src={e.image} alt='' />
                    <div className='overlay'>
                      <FaPlayCircle />
                    </div>
                  </a>
                </article>
              ))}
            </div>
          )}
          {settings === 3 && (
            <div
              className={`grid gap-5 mb-4 ${
                esDispositivoMovil ? 'grid-cols-2' : 'grid-cols-7'
              }`}>
              {ultimosVistados?.map((e, index) => (
                <article key={index} className='ultimosVistos__panel__user'>
                  <a href={`/${e.name?.replace(/ /g, '-')}/${e.episode}`}>
                    <span className='tag'>{e.episode}</span>
                    <img src={e.image} alt='' />
                    <div className='overlay'>
                      <FaPlayCircle />
                    </div>
                  </a>
                </article>
              ))}
            </div>
          )}

          {settings === 4 && (
            <div style={{ minHeight: '80dvh' }} className={`user__panel`}>
              <section>
                <img src={user?.photoURL} alt='' />
                <span>usuario: {user?.displayName}</span>
                <p>
                  Mi lista de Animes
                  {favoritos.map((e) => (
                    <>
                      <br />
                      <span>{e.name}</span>
                    </>
                  ))}
                </p>

                <div>
                  <div className='file-input-container'>
                    <label
                      className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                      htmlFor='file_input'>
                      sube una imagen
                    </label>
                    <input
                      className='block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400'
                      aria-describedby='file_input_help'
                      id='file_input'
                      type='file'
                      onChange={handleFileChange}
                      accept='image/*'
                      style={{ cursor: 'pointer' }}
                    />
                    <p
                      className='mt-1 text-sm text-gray-500 dark:text-gray-300'
                      id='file_input_help'>
                      SVG, PNG, JPG or GIF (MAX. 800x400px).
                    </p>

                    {selectedFile && (
                      <span className='file-name'>{selectedFile.name}</span>
                    )}
                  </div>
                  <button
                    onClick={handleUploadPhoto}
                    className='button__profile__page'>
                    Guardar Cambios
                  </button>
                </div>
              </section>
            </div>
          )}
          {settings === 5 && (
            <div
              style={{ minHeight: '80dvh' }}
              className={`grid gap-4 mb-4 ${
                esDispositivoMovil ? 'grid-cols-2' : 'grid-cols-7'
              }`}>
              {episodiosGuardados?.map((e, index) => (
                <article
                  key={index}
                  className='episodiosGuardados__panel__user'>
                  <a href={e.url}>
                    <img src={e.image} alt='' />
                    <div className='overlay'>
                      <FaPlayCircle />
                    </div>
                  </a>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
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
export default UserPage
