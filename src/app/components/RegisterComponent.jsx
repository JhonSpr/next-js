'use client'
import { useState } from 'react'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { getStorage, ref, uploadBytesResumable } from 'firebase/storage'

import { useRouter } from 'next/navigation'
import { auth } from '@/app/firebase'
import { IoMdClose } from 'react-icons/io'

const Register = ({ setRegisterPage, setLoginPage, setShowMenu }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  const handleRegister = async () => {
    try {
      setLoading(true)

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )

      const user = userCredential.user

      await updateProfile(user, { displayName: username })
      router.replace('/')
      setLoginPage(false)
      setRegisterPage(false)
      setShowMenu(false)

      if (profileImage) {
        const storage = getStorage(auth)
        const storageRef = ref(storage, `profile_images/${user.uid}`)
        const uploadTask = uploadBytesResumable(storageRef, profileImage)

        uploadTask.on(
          'state_changed',
          (snapshot) => {},
          (error) => {
            console.error('Error durante la carga de la imagen:', error)
            setLoading(false)
          }
        )
      }
    } catch (error) {
      console.error('Error durante el registro:', setError(error))
    } finally {
      setLoading(false)
    }
  }
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleRegister()
    }
  }

  return (
    <div className='container__form__page__register'>
      <div className='form'>
        <button className='close-window' onClick={() => setRegisterPage(false)}>
          <IoMdClose />
        </button>
        {error && (
          <h3 className='alert__'>
            {error.message === 'Firebase: Error (auth/missing-password).'
              ? 'falta contraseña'
              : '' || error.code == 'auth/email-already-in-use'
              ? 'correo electronico en uso'
              : ''}
          </h3>
        )}
        <h2>Registrarse</h2>
        <input
          type='email'
          placeholder='correo electronico'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <input
          type='password'
          placeholder='contraseña'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <input
          type='text'
          placeholder='usuario'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button onClick={handleRegister} disabled={loading}>
          {loading ? 'Registrando...' : 'Registrar'}
        </button>
        <button className='toggle-ready'>
          ¿ya tienes una cuenta? -{' '}
          <span onClick={() => (setLoginPage(true), setRegisterPage(false))}>
            Iniciar sesion
          </span>
        </button>
      </div>
    </div>
  )
}

export default Register
