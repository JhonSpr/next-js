'use client'
import { use, useContext, useEffect, useState } from 'react'
import { FaBars } from 'react-icons/fa6'
import { useDebouncedCallback } from 'use-debounce'
import { IoMdClose } from 'react-icons/io'
import { FaSearch, FaUserCircle } from 'react-icons/fa'
import { Button } from '@nextui-org/react'
import { ThemeSwitcher } from './ThemeSwitcher'
import { contextApp } from '../providers'
import LogoutButton from './logout'
import { useCookies, withCookies } from 'react-cookie'
import { useTheme } from 'next-themes'
const hrefs = [
  { label: 'Inicio', route: '/' },
  { label: 'Animes', route: '/directorio' },
  { label: 'Emisionés', route: '/directorio?estado=en+emision' },
]

function Navigation() {
  const [collapse, setCollapse] = useState(false)
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const { theme } = useTheme()
  const { user } = useContext(contextApp)
  const openX = () => {
    setCollapse(!collapse)
  }

  const handleSearch = useDebouncedCallback((e) => {
    setSearch(e.target.value)
  }, 600)

  const handleOpen = () => {
    setIsOpen(!isOpen)
  }
  useEffect(() => {
    // Aplica las clases al body o a algún contenedor específico
    document.body.classList.remove('light', 'dark')
    document.body.classList.add(theme)
  }, [theme])

  return (
    <header>
      <nav className={`navbar navbar-expand-lg`}>
        <div className='container'>
          <a className='navbar-brand' href='/'>
            <img
              src='https://i.postimg.cc/L8gP10cN/animesz-high-resolution-logo-transparent-1.png'
              alt=''
            />
          </a>
          <button
            className='position-absolute z-2 btn__close__navbar'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target='#navbarSupportedContent'
            aria-controls='navbarSupportedContent'
            aria-expanded='false'
            aria-label='Toggle navigation'
            onClick={openX}>
            <FaBars />
          </button>
          <div
            className={`${
              collapse
                ? 'collapse navbar-collapse show'
                : 'collapse navbar-collapse'
            }`}
            id='navbarSupportedContent'>
            <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
              {hrefs.map(({ route, label }) => (
                <li className='nav-item' key={route}>
                  <a className='nav-link' aria-current='page' href={route}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
            <div style={{ minWidth: '40px' }}>
              <ThemeSwitcher />
            </div>
            <form className='d-flex' role='search' action={'/directorio'}>
              <input
                className='form-control me-2'
                type='text'
                name='q'
                autoComplete='off'
                placeholder='busca anime ...'
                aria-label='q'
                onChange={handleSearch}
              />
              <button className='btn' type='submit'>
                <FaSearch />
              </button>
            </form>
            <div className={`container__user ${!user ? 'disable' : ''}`}>
              <div className='menu__navbar__user' style={{ minWidth: '40px' }}>
                <FaUserCircle
                  fontSize={'30px'}
                  color='c1c1c1'
                  cursor={'pointer'}
                  onClick={handleOpen}
                />
              </div>

              <div className={`user ${isOpen ? 'show' : ''}`}>
                <a
                  href={`/auth/${user?.displayName
                    ?.replace(/ /g, '-')
                    ?.toLowerCase()}`}>
                  Mi lista
                </a>
                <LogoutButton />
              </div>
            </div>
            <a
              href='/auth/login'
              className={user ? 'disable' : ''}
              style={{ minWidth: '40px' }}>
              Ingresar
            </a>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default withCookies(Navigation)
