'use client'
import { useContext, useEffect, useRef, useState } from 'react'

import { useDebouncedCallback } from 'use-debounce'

import { contextApp } from '../providers'
import { useTheme } from 'next-themes'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import Register from './RegisterComponent'
import { Login } from './LoginComponent'
import { FaStar } from 'react-icons/fa6'
import { Loader } from './LoaderSkeleton'
import { BiCloset } from 'react-icons/bi'
import { FaBars } from 'react-icons/fa'
import { IoMdClose } from 'react-icons/io'
const hrefs = [
  { label: 'Inicio', route: '/' },
  { label: 'Animes', route: '/directorio' },
  { label: 'Emisionés', route: '/directorio?estado=en+emision' },
  {
    label: 'Calendario Primavera',
    route: '/calendario',
  },
]

function Navigation() {
  const [search, setSearch] = useState(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])
  const [showMenu, setShowMenu] = useState(false)
  const [loginPage, setLoginPage] = useState(null)
  const [registerPage, setRegisterPage] = useState(null)
  const [open, setOpen] = useState(false)
  const { theme } = useTheme()
  const { user } = useContext(contextApp)
  const inputRef = useRef(null)
  const [settings, setSettings] = useState(null)
  const settingsRef = useRef(null)
  const [history, setHistory] = useState([])
  const [isFocused, setIsFocused] = useState(false)

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }
  useEffect(() => {
    setHistory(JSON.parse(localStorage.getItem('history')) || [])
  }, [])

  const handleSearch = useDebouncedCallback((e) => {
    setSearch(e.target.value)
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
    }, 3000)
  }, 200)

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  if (search === '') {
    setSearch(null)
  }

  useEffect(() => {
    fetch(
      `https://api-rest.up.railway.app/api/v1/animes?name=${search}&page=1&limit=6`
    )
      .then((res) => res.json())
      .then((data) => {
        setResults(data)
      })
      .catch((error) => {
        console.error('Error al buscar animes:', error)
      })
  }, [loading])
  useEffect(() => {
    document.body.classList.remove('light', 'dark')
    document.body.classList.add(theme)
  }, [theme])

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
    setShowMenu(false)
  }

  const handleShowMenu = (id) => {
    setShowMenu(!showMenu)

    if (settings === id) {
      setSettings(null)
    } else {
      setSettings(id)
    }
  }

  const handleAddHistory = (name, image) => {
    let arrayHistory = JSON.parse(localStorage.getItem('history')) || []
    const nameExists = arrayHistory.some((item) => item.name === name)

    if (!nameExists) {
      const newItem = {
        image: image,
        name: name,
        url: `/${name.replace(/ /g, '-').toLowerCase()}`,
      }
      arrayHistory.push(newItem)
      localStorage.setItem('history', JSON.stringify(arrayHistory))
    }
  }

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target) &&
        !event.target.getAttribute('ref')
      ) {
        setSettings(null)
      }
    }

    document.addEventListener('click', handleOutsideClick)

    return () => {
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [settings])
  const toggleMenu = () => {
    setOpen(!open)
  }
  return (
    <nav className='bg-white border-gray-200 dark:bg-gray-900 nav' id='navbar'>
      <div className='max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 '>
        <a href='/' className='flex items-center space-x-3 rtl:space-x-reverse'>
          <img
            src='https://i.postimg.cc/L8gP10cN/animesz-high-resolution-logo-transparent-1.png'
            alt=''
            style={{ width: '50px' }}
          />
        </a>
        <div className='flex md:order-2'>
          <button
            type='button'
            data-collapse-toggle='navbar-search'
            aria-controls='navbar-search'
            aria-expanded='false'
            className='md:hidden text-gray-500 dark:text-gray-400  rounded-lg text-sm p-2.5 me-1'
            onClick={handleClick}>
            <svg
              className='w-5 h-5'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 20 20'>
              <path
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z'
              />
            </svg>
            <span className='sr-only'>Search</span>
          </button>
          <div className='user__botton'>
            {!user ? (
              <div
                className='relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600'
                style={{ marginRight: '10px' }}
                onClick={() => handleShowMenu(1)}>
                <svg
                  className='absolute w-12 h-12 text-gray-400 -left-1'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  xmlns='http://www.w3.org/2000/svg'>
                  <path
                    fillRule='evenodd'
                    d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                    clipRule='evenodd'></path>
                </svg>
              </div>
            ) : (
              <img
                className='w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500'
                src={
                  user?.photoURL ??
                  'https://i.postimg.cc/MGT3117z/avatars-000477344763-dvv5lr-t500x500.jpg'
                }
                alt='Bordered avatar'
                style={{ marginRight: '10px' }}
                onClick={() => handleShowMenu(1)}
              />
            )}

            <div
              className={`container__card__user ${
                settings === 1 ? 'show' : ''
              }`}
              ref={settingsRef}>
              {!user ? (
                <div className='flex flex-col items-center pb-10'>
                  <h5 className='mb-1 text-xl font-medium text-gray-900 dark:text-white'>
                    Ingresar/Registrarse
                  </h5>
                  <span className='text-sm text-gray-500 dark:text-gray-400'>
                    {user?.displayName}
                  </span>
                  <div className='flex mt-4 md:mt-6'>
                    <button
                      className='inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:outline-none  dark:bg-blue-600 dark:hover:bg-blue-700 '
                      onClick={() => (
                        setLoginPage(!loginPage),
                        setRegisterPage(false),
                        setShowMenu(false)
                      )}>
                      Ingresar
                    </button>
                    <button
                      className='inline-flex items-center px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700  ms-3'
                      onClick={() => (
                        setRegisterPage(!registerPage),
                        setLoginPage(false),
                        setShowMenu(false)
                      )}>
                      Registrase
                    </button>
                  </div>
                </div>
              ) : (
                <div className={`flex flex-col items-center pb-10 `}>
                  <img
                    className='w-24 h-24 mb-3 rounded-full shadow-lg'
                    src={
                      user?.photoURL ??
                      'https://i.postimg.cc/MGT3117z/avatars-000477344763-dvv5lr-t500x500.jpg'
                    }
                    alt='Bonnie image'
                  />
                  <h5 className='mb-1 text-xl font-medium text-gray-900 dark:text-white'>
                    usuario
                  </h5>
                  <span className='text-sm text-gray-500 dark:text-gray-400'>
                    {user?.displayName}
                  </span>
                  <div className='flex mt-4 md:mt-6'>
                    <a
                      href={`/user/${user?.uid.slice(0, 10)}`}
                      className='inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 '>
                      Mi lista
                    </a>
                    <button
                      onClick={logout}
                      className='inline-flex items-center px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none  dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700  ms-3'>
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className='relative hidden md:block'>
            <div className='absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none'>
              <svg
                className='w-4 h-4 text-gray-500 dark:text-gray-400'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 20 20'>
                <path
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z'
                />
              </svg>
              <span className='sr-only'>Search icon</span>
            </div>

            <form action='/directorio'>
              <input
                type='text'
                id='search-navbar'
                name='q'
                autoComplete='off'
                className='block w-full p-2 ps-10 text-sm text-gray-900  rounded-lg bg-gray-50 focus:ring-blue-700 focus:border-blue-500 bg-gray-700 border-gray-600 placeholder-gray-700 text-white focus:border-blue-500'
                placeholder='Buscar un anime...'
                ref={inputRef}
                onChange={handleSearch}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <div
                className={`container__results  ${
                  history.length || isFocused || (results && results.item > 0)
                    ? 'show'
                    : 'disable'
                }`}>
                {history.length != 0 && isFocused && search == null ? (
                  <div className='results history'>
                    {history
                      .map((e, index) => (
                        <>
                          <a href={e.url} key={index}>
                            <img src={e.image} alt='' />
                            <span>{e.name}</span>
                          </a>
                        </>
                      ))
                      .slice(0, 4)}
                    {history.length > 4 ? (
                      <button
                        className={!isFocused ? 'disable' : 'btn__results'}>
                        Mostrar Historial
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div
                className={`container__results ${
                  search === null ? 'disable' : ''
                }`}>
                <div className={`results`}>
                  {results?.datos?.map((e, index) => (
                    <div
                      className={`result ${loading ? 'disable' : ''}`}
                      key={index}>
                      <a
                        href={e.name.replace(/ /g, '-')}
                        onClick={() => handleAddHistory(e.name, e.image)}>
                        <div className='image__result'>
                          <img src={e.image} alt={e.image} />
                        </div>
                        <div className='info__result'>
                          <h5>{e.name}</h5>
                          <span>{e.year}</span>
                          <p>
                            <FaStar />
                            {e.rating}
                          </p>
                        </div>
                      </a>
                    </div>
                  ))}

                  {results?.item == 0 && (
                    <span className={loading ? 'disable' : ''}>
                      No hay resultados para {`${search}`}
                    </span>
                  )}

                  {loading && <Loader />}

                  {results?.item > 6 ? (
                    <button className={loading ? 'disable' : 'btn__results'}>
                      Mostrar mas resultados
                    </button>
                  ) : null}
                </div>
              </div>
            </form>
          </div>
          <button
            data-collapse-toggle='navbar-search'
            type='button'
            className='inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden'
            aria-controls='navbar-search'
            aria-expanded={open ? 'true' : 'false'}
            onClick={toggleMenu}>
            <span className='sr-only'>
              {open ? 'Close main menu' : 'Open main menu'}
            </span>
            {open ? (
              <IoMdClose fontSize={'30px'} />
            ) : (
              <FaBars fontSize={'30px'} />
            )}
          </button>
        </div>
        <div
          className='items-center justify-between hidden w-full md:flex md:w-auto md:order-1'
          id='navbar-search'>
          <div className='relative mt-3 md:hidden'>
            <div className='absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none'>
              <svg
                className='w-4 h-4 text-gray-500 dark:text-gray-400'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 20 20'>
                <path
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z'
                />
              </svg>
            </div>
            <form action='/directorio'>
              <input
                type='text'
                id='search-navbar'
                name='q'
                autoComplete='off'
                className='block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 bg-gray-700 border-gray-600 
                bg-gray-700 placeholder-gray-400 text-white'
                placeholder='buscar un anime...'
                ref={inputRef}
              />
            </form>
          </div>
          <ul className='flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-3 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 ul'>
            {hrefs.map(({ route, label, status }) => (
              <li key={route}>
                <a
                  href={
                    status === undefined || typeof location !== undefined
                      ? `${location.origin + route}`
                      : `${location.origin + route}`
                  }
                  className={`block py-2 px-3 md:p-0 nav-link ${
                    status === 'coming soon' ? 'disabled' : ''
                  }`}
                  aria-current='page'>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {loginPage ? (
        <Login
          setLoginPage={setLoginPage}
          setRegisterPage={setRegisterPage}
          setShowMenu={setShowMenu}
        />
      ) : null}
      {registerPage ? (
        <Register
          setLoginPage={setLoginPage}
          setRegisterPage={setRegisterPage}
          setShowMenu={setShowMenu}
        />
      ) : null}
    </nav>
  )
}

export default Navigation
