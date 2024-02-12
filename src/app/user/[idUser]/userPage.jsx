'use client'
import { contextApp } from '@/app/providers'
import { getAuth, signOut, updateProfile } from 'firebase/auth'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { useRouter } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { MdOutlineSettings } from 'react-icons/md'
import { FaUserCog } from 'react-icons/fa'
import { CiLogout } from 'react-icons/ci'
import { auth } from '@/app/firebase'

const UserPage = () => {
  const [cookie, setCookie] = useCookies(['username'])
  const {
    dataUser,
    theme,
    updateUserProfilePhoto,
    user,
    favoritos,
    ultimosVistados,
  } = useContext(contextApp)
  const [MiList, setMilist] = useState(true)
  const [AnimesPending, setAnimesPending] = useState(false)
  const [ultimosVistadosT, setultimosVistadosT] = useState(false)
  const router = useRouter()
  const [newPhoto, setNewPhoto] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)

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

  const logout = async () => {
    try {
      await signOut(auth)
      // Usa la función para quitar todas las cookies
      // removeCookie(`token`)
      // removeCookie(`username`)
      // removeCookie(`like${animeName}`)
      // removeCookie(`dislike${animeName}`)
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

    // Agregar un event listener para el evento de cambio de tamaño de la ventana
    window.addEventListener('resize', handleResize)

    // Llamar a handleResize una vez al inicio para establecer el estado inicial
    handleResize()

    // Limpiar el event listener en el cleanup de useEffect
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  return (
    // <div className='container__user__page'>
    //   <title>perfil de usuario</title>
    //   <div className={`info__user ${theme == 'dark' ? 'dark' : ''}`}>
    //     <div className='container__options__user'>
    //       <span>Mi lista</span>
    //       <span>Ver mas tarde</span>
    //       <span>Animes pendientes</span>
    //       <span>Ultimos capitulos vistos</span>
    //     </div>
    //     <div className='information'>
    //       <img src={photoURL} alt='' />
    //       <span>{user?.displayName}</span>
    //     </div>
    //     {/* <LogoutButton /> */}
    //     <div>
    //       <div className='file-input-container'>
    //         <label
    //           class='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
    //           for='file_input'>
    //           Upload file
    //         </label>
    //         <input
    //           class='block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400'
    //           aria-describedby='file_input_help'
    //           id='file_input'
    //           type='file'
    //           onChange={handleFileChange}
    //           accept='image/*'
    //           style={{ cursor: 'pointer' }}
    //         />
    //         <p
    //           class='mt-1 text-sm text-gray-500 dark:text-gray-300'
    //           id='file_input_help'>
    //           SVG, PNG, JPG or GIF (MAX. 800x400px).
    //         </p>

    //         <button className='button__profile__page'>Cambiar Avatar</button>
    //         {selectedFile && (
    //           <span className='file-name'>{selectedFile.name}</span>
    //         )}
    //       </div>
    //       <button onClick={handleUploadPhoto} className='button__profile__page'>
    //         Guardar Cambios
    //       </button>
    //       {dataUser?.user?.emailVerified ? null : (
    //         <button
    //           onClick={handleResendVerificationEmail}
    //           className='btn__verify__account'>
    //           verificar cuenta
    //         </button>
    //       )}
    //     </div>
    //   </div>

    //   <div className='cards'>
    //     <h4>Mi lista</h4>
    //   </div>
    // </div>
    <>
      <title>Panel de control</title>
      <button
        data-drawer-target='sidebar-multi-level-sidebar'
        data-drawer-toggle='sidebar-multi-level-sidebar'
        aria-controls='sidebar-multi-level-sidebar'
        type='button'
        class='inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600'>
        <span class='sr-only'>Open sidebar</span>
        <svg
          class='w-6 h-6'
          aria-hidden='true'
          fill='currentColor'
          viewBox='0 0 20 20'
          xmlns='http://www.w3.org/2000/svg'>
          <path
            clip-rule='evenodd'
            fill-rule='evenodd'
            d='M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z'></path>
        </svg>
      </button>

      <aside
        id='sidebar-multi-level-sidebar'
        class='fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0'
        aria-label='Sidebar'>
        <div class='h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800'>
          <ul class='space-y-2 font-medium'>
            <li>
              <a
                href='#'
                class='flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'>
                <FaUserCog />

                <span class='ms-3'>Panel de usuario</span>
              </a>
            </li>
            <li>
              <button
                type='button'
                class='flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
                aria-controls='dropdown-example'
                data-collapse-toggle='dropdown-example'>
                <MdOutlineSettings />

                <span class='flex-1 ms-3 text-left rtl:text-right whitespace-nowrap'>
                  Opciones de usuario
                </span>
                <svg
                  class='w-3 h-3'
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
              <ul id='dropdown-example' class='hidden py-2 space-y-2'>
                <li>
                  <button
                    onClick={() => (
                      setMilist(!MiList),
                      setAnimesPending(false),
                      setultimosVistadosT(false)
                    )}
                    class={`flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ${
                      MiList && 'bg-gray-700'
                    }`}>
                    Mi lista de Favoritos
                  </button>
                </li>
                <li>
                  <a
                    href='#'
                    class='flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'>
                    Episodios en espera
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => (
                      setAnimesPending(!AnimesPending),
                      setMilist(false),
                      setultimosVistadosT(false)
                    )}
                    class={`flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ${
                      AnimesPending && 'bg-gray-700'
                    }`}>
                    Animes Para ver luego
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setultimosVistadosT(!ultimosVistadosT)
                      setAnimesPending(false)
                      setMilist(false)
                    }}
                    class='flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'>
                    Ultimos episodios visitados
                  </button>
                </li>
              </ul>
            </li>
            <li>
              <a
                href='#'
                class='flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'>
                <svg
                  class='flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='currentColor'
                  viewBox='0 0 18 18'>
                  <path d='M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z' />
                </svg>
                <span class='flex-1 ms-3 whitespace-nowrap'>
                  Proximamente ...
                </span>
                {/* <span class='inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300'>
                  Pro
                </span> */}
              </a>
            </li>
            <li>
              <button
                onClick={logout}
                class='flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'>
                <CiLogout />

                <span class='flex-1 ms-3 whitespace-nowrap'>Cerrar Sesión</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>

      <div class='p-4 sm:ml-64'>
        <div
          class={`     
        p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 
        `}>
          {MiList && (
            <div
              style={{ minHeight: '80dvh' }}
              class={`grid gap-4 mb-4 ${
                esDispositivoMovil ? 'grid-cols-2' : 'grid-cols-7'
              }`}>
              {favoritos?.map((e, index) => (
                <article key={index} className='favorite__panel__user'>
                  <a href={`/${e.name?.replace(/ /g, '-')}`}>
                    <img src={e.image} alt='' />
                  </a>
                </article>
              ))}
            </div>
          )}
          {AnimesPending && (
            <div
              style={{ minHeight: '80dvh' }}
              class={`grid gap-4 mb-4 ${
                esDispositivoMovil ? 'grid-cols-2' : 'grid-cols-7'
              }`}>
              <img
                src='https://i.postimg.cc/rscm9xcy/undead-unluck.webp'
                alt=''
              />
              <img
                src='https://i.postimg.cc/rscm9xcy/undead-unluck.webp'
                alt=''
              />
              <img
                src='https://i.postimg.cc/XY8nF4GW/sekai-saikou-no-ansatsusha-isekai-kizoku-ni-tensei-suru.webp'
                alt=''
              />
              <img
                src='https://i.postimg.cc/XY8nF4GW/sekai-saikou-no-ansatsusha-isekai-kizoku-ni-tensei-suru.webp'
                alt=''
              />
              <img
                src='https://i.postimg.cc/XY8nF4GW/sekai-saikou-no-ansatsusha-isekai-kizoku-ni-tensei-suru.webp'
                alt=''
              />
            </div>
          )}
          {ultimosVistadosT && (
            <div
              style={{ minHeight: '80dvh' }}
              class={`grid gap-5 mb-4 ${
                esDispositivoMovil ? 'grid-cols-2' : 'grid-cols-7'
              }`}>
              {ultimosVistados?.map((e, index) => (
                <article key={index} className='ultimosVistos__panel__user'>
                  <a href={`/${e.name?.replace(/ /g, '-')}`}>
                    <span className='tag'>{e.episode}</span>
                    <img src={e.image} alt='' />
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
