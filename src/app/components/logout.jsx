'use client'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { useCookies } from 'react-cookie'
import { useRouter } from 'next/navigation'
const LogoutButton = () => {
  const [cookies, _, removeCookie] = useCookies()
  const router = useRouter()
  const handleLogout = async () => {
    try {
      await signOut(auth)

      removeCookie(`username`)

      router.push('/')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  return (
    <a onClick={handleLogout} className='btn__logout'>
      Cerrar sesión
    </a>
  )
}

export default LogoutButton
