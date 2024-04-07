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
import { IoMdClose } from 'react-icons/io'
import { toast } from 'react-toastify'
export const Login = ({ setLoginPage, setRegisterPage, setShowMenu }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)
  const [showError, setShowError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowpassword] = useState(false)
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
      toast.info(`Bienvenido a animesz`)
      const loggedInUser = userCredential.user
      setUser(loggedInUser)
      setLoginPage(false)
      setRegisterPage(false)
      setShowMenu(false)
    } catch (error) {
      setError(error.message)
      setShowError(true)
      setTimeout(() => {
        setShowError(false)
      }, 3000)
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
      setLoginPage(false)
      setRegisterPage(false)
      setShowMenu(false)
    } catch (error) {
      setError(error)
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleLogin()
    }
  }
  return (
    <div className='container__form__page__register'>
      <div className='form'>
        <button className='close-window' onClick={() => setLoginPage(false)}>
          <IoMdClose />
        </button>
        {showError ? (
          <h3 className='alert__'>
            {error === 'Firebase: Error (auth/invalid-email).'
              ? 'Correo electronico / contraseña no validos'
              : '' || error == 'auth/email-already-in-use'
              ? 'correo electronico en uso'
              : '' || error == 'Firebase: Error (auth/missing-password).'
              ? 'contraseña no ingresada'
              : '' || error === 'Firebase: Error (auth/invalid-credential).'
              ? 'credenciales no validas'
              : ''}
          </h3>
        ) : null}
        <label
          id='#'
          for='first_name'
          className='block mb-2 text-sm  text-gray-900 text-white fw-bold'>
          Correo electronico
        </label>
        <input
          type='text'
          placeholder={`correo electronico`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyPress}
          required
          minLength={1}
          className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
        />
        <label
          for='password'
          className='block mb-2 text-sm  text-gray-900 text-white fw-bold'>
          Password
        </label>
        <input
          type='password'
          id='password'
          className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
          placeholder='•••••••••'
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete='off'
          onKeyDown={handleKeyPress}
        />
        <button onClick={handleLogin} disabled={loading}>
          {loading ? 'Inciando Sesion...' : 'Iniciar Sesion'}
        </button>

        <button
          type='button'
          className='text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 mb-2 google-button'
          onClick={handleGoogleLogin}>
          <FcGoogle />
          Iniciar sesión con Google
        </button>
        <button className='toggle-ready'>
          ¿no tienes una cuenta? -{' '}
          <span onClick={() => (setLoginPage(false), setRegisterPage(true))}>
            Registrarse
          </span>
        </button>
      </div>
    </div>
  )
}
