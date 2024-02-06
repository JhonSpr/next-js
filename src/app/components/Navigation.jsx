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
      <nav class='navbar navbar-expand-lg bg-body-tertiary'>
        <div class='container-fluid'>
          <button
            class='navbar-toggler'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target='#navbarTogglerDemo03'
            aria-controls='navbarTogglerDemo03'
            aria-expanded='false'
            aria-label='Toggle navigation'>
            <span class='navbar-toggler-icon'></span>
          </button>
          <a class='navbar-brand' href='#'>
            Navbar
          </a>
          <div class='collapse navbar-collapse' id='navbarTogglerDemo03'>
            <ul class='navbar-nav me-auto mb-2 mb-lg-0'>
              <li class='nav-item'>
                <a class='nav-link active' aria-current='page' href='#'>
                  Home
                </a>
              </li>
              <li class='nav-item'>
                <a class='nav-link' href='#'>
                  Link
                </a>
              </li>
              <li class='nav-item'>
                <a class='nav-link disabled' aria-disabled='true'>
                  Disabled
                </a>
              </li>
            </ul>
            <form class='d-flex' role='search'>
              <input
                class='form-control me-2'
                type='text'
                placeholder='Search'
                aria-label='Search'
              />
              <button class='btn btn-outline-success' type='submit'>
                Search
              </button>
            </form>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default withCookies(Navigation)
