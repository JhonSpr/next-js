'use client'

import { useState, useEffect } from 'react'
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { FcGoogle } from 'react-icons/fc'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { auth } from '@/app/firebase'
import { useRouter } from 'next/navigation'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [_, setUser] = useState(null)
  const [login, setLogin] = useState(true)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowpassword] = useState(false)
  const [alert, setAlert] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })

    return () => unsubscribe()
  }, [])

  const handleLogin = async () => {
    setLoading(true)
    try {
      await setPersistence(auth, browserLocalPersistence)
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      const loggedInUser = userCredential.user
      setUser(loggedInUser)
      router.push('/')
    } catch (error) {
      setAlert(true)
      setTimeout(() => {
        setAlert(false)
      }, 2000)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider()
    try {
      await setPersistence(auth, browserLocalPersistence)
      const userCredential = await signInWithPopup(auth, provider)
      const loggedInUser = userCredential.user
      setUser(loggedInUser)
      router.push('/')
    } catch (error) {
      setError(error.message)
    }
  }

  const handleToggleLogin = () => {
    setLogin(!login)
  }

  const handleShowpassword = () => {
    setShowpassword(!showPassword)
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleLogin()
    }
  }
  return (
    <>
      <title>Iniciar Sesión</title>
      {login && (
        <div className={login ? `login__page show` : 'login__page'}>
          <div className='container__'>
            {alert ? (
              <h3 className='alert__'>
                {error === 'Firebase: Error (auth/invalid-credential).'
                  ? 'correo/constraseña  invalidas'
                  : '' || error == 'Firebase: Error (auth/invalid-email).'
                  ? 'correo electronico no valido'
                  : '' || error == 'Firebase: Error (auth/missing-password).'
                  ? 'falta contraseña'
                  : ''}
              </h3>
            ) : null}
            <h2>{login ? 'Iniciar Sesión' : 'Registrarse'}</h2>

            <input
              type='text'
              placeholder={`correo electronico`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <label htmlFor=''>
              <FaEye
                className={showPassword ? 'icon__' : 'disable'}
                onClick={handleShowpassword}
              />

              <FaEyeSlash
                className={showPassword ? 'disable' : 'icon__'}
                onClick={handleShowpassword}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder='contraseña'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete='off'
                onKeyDown={handleKeyPress}
              />
            </label>
            <a
              style={{ top: '70%', cursor: 'pointer', height: 'fit-content' }}
              href='/auth/resetPassword'>
              {loading
                ? 'Enviando correo electrónico...'
                : 'Restablecer Contraseña'}
            </a>

            <button onClick={handleLogin}>
              {loading ? 'iniciando sesión...' : 'iniciar sesión'}
            </button>

            <button
              onClick={handleGoogleLogin}
              style={{ border: 'none', outline: 'none', cursor: 'pointer' }}>
              <FcGoogle /> Google
            </button>
            <br />
            <br />
            <br />
            <br />
            <br />
            <button onClick={() => router.push('/auth/register')}>
              registrarse
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default Login
