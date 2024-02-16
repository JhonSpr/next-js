'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useContext } from 'react'
import { contextApp } from '../providers'

const values = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
]

function LetrasMenu({ letraQuery }) {
  const router = useRouter()
  const { theme } = useContext(contextApp)

  const searchParams = useSearchParams()
  const pathname = usePathname()
  const handleSetLetra = (term) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('letra', term)
      params.delete('page')
    } else {
      params.delete('letra')
    }
    router.replace(`${pathname}?${params.toString()}`)
  }
  return (
    <div className={`letras__container ${theme === 'dark' ? 'dark' : ''}`}>
      {values.map((e, index) => (
        <button
          key={index}
          onClick={() => handleSetLetra(e)}
          className={letraQuery?.includes(e) ? 'active' : ''}>
          {e}
        </button>
      ))}
    </div>
  )
}

export default LetrasMenu
