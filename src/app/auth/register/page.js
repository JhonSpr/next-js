// Register.js
'use client'
import { useState } from 'react'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { getStorage, ref, uploadBytesResumable } from 'firebase/storage'

import { useRouter } from 'next/navigation'
import { auth } from '@/app/firebase'

const Register = () => {
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
    <>
      <title>Registrase</title>
      <div>
        <div className='container__'>
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
            placeholder='nickName'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button onClick={handleRegister} disabled={loading}>
            {loading ? 'Registrando...' : 'Registrar'}
          </button>
          <br /> <br />
          <br />
          <br />
          <br />
          <button onClick={() => router.push('/auth/login')}>
            Iniciar Sesión
          </button>
        </div>
      </div>
    </>
  )
}

export default Register
