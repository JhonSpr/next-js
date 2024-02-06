'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { useContext } from 'react'
import { contextApp } from '../providers'

export default function Search() {
  const router = useRouter()
  const { theme } = useContext(contextApp)

  const searchParams = useSearchParams()
  const pathname = usePathname()
  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('q', term)
      params.delete('page')
    } else {
      params.delete('q')
    }
    router.replace(`${pathname}?${params.toString()}`)
  }, 200)
  return (
    <div className='search__container'>
      <span className={` ${theme}`}>BUSCADOR</span>
      <input
        placeholder='escribe el anime'
        className='search__input'
        type='text'
        name='q'
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('q')?.toString()}
        autoComplete='off'
      />
    </div>
  )
}
