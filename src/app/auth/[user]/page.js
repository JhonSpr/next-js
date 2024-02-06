'use client'

import LogoutButton from '@/app/components/logout'
import { contextApp } from '@/app/providers'
import { useRouter } from 'next/navigation'
import { useContext, useEffect } from 'react'
import { useCookies } from 'react-cookie'

const Page = ({ params }) => {
  const [cookie, setCookie] = useCookies(['username'])
  const { user, theme } = useContext(contextApp)
  const username = cookie?.username?.replace(/-/g, ' ')
  const router = useRouter()

  if (!username) {
    router.push('/')
  }

  const photoURL = user?.photoURL || 'https://i.postimg.cc/4xtHm8nz/images.jpg'
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
      </div>
      <div className='cards'>
        <h4>Mi lista</h4>
      </div>
    </div>
  )
}

export default Page
