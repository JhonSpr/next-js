'use client'
import { FaStar } from 'react-icons/fa6'
import EpisodesList from './EpisodesList'
import { useContext, useEffect, useState } from 'react'
import { contextApp } from '../providers'
import Comments from '../components/comments'
import { agregarDatos, database, db, obtenerAnimes } from '../firebase'
import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import {
  child,
  get,
  getDatabase,
  onValue,
  push,
  ref,
  runTransaction,
  set,
} from 'firebase/database'
import { calcularRating } from '../auth/[user]/page'

export function FetchSingleAnime({ data }) {
  const name = data?.map((e) => e.name?.replace(/ /g, '-'))
  const animeId = data?.map((e) => e.id)
  const [loading, setLoading] = useState([])
  const [likes, setLikes] = useState(null)
  const [dislikes, setDislikes] = useState(null)
  const [rating, setRating] = useState(null)
  const [datos, setDatos] = useState(null)
  const { theme, dataUser, user } = useContext(contextApp)
  useEffect(() => {
    setLoading(true)
    setLoading(false)
  }, [loading])

  async function writeUserData(animeId, name) {
    try {
      const db = getDatabase()
      const animeRef = ref(db, `animes/${animeId}`)

      // Verificar si el anime ya existe
      const animeSnapshot = await get(child(animeRef, `$`))
      if (exists(animeSnapshot)) {
        console.log('El anime ya existe en la base de datos.')
        return // Salir de la función si el anime ya existe
      }

      // Agregar el nuevo anime si no existe
      await set(animeRef, {
        anime: name,
        likes: 0,
        dislikes: 0,
        visitas: 0,
      })

      console.log('El anime se agregó correctamente a la base de datos.')
    } catch (error) {
      console.error('Error al escribir los datos:', error)
    }
  }

  const agregarValorAVistosRecientes = async (name, image) => {
    const db = getDatabase()
    const object = {
      url: `${location?.pathname}`,
      name: name,
      image: image,
    }
    if (name && image) {
      const userRef = ref(db, 'users/' + user?.uid)
      const snapshot = await get(userRef)
      const userData = snapshot?.val() || {}
      const vistosRecientes = userData?.vistos_reciente || []

      // Verificar si el objeto ya existe en vistosRecientes
      const objetoExistente = vistosRecientes.find(
        (objeto) => objeto?.name === name
      )

      if (!objetoExistente) {
        // Si el objeto no existe, agregarlo
        set(ref(db, 'users/' + user.uid), {
          nombre: user?.displayName || '',
          mi_lista: [''],
          vistos_reciente: [...vistosRecientes, object],
        })
      } else {
      }
    } else {
      console.error(
        'Name e image deben estar definidos para agregar el objeto a vistosRecientes.'
      )
    }
  }

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://animesz-f90c0-default-rtdb.firebaseio.com/animes/${animeId}.json`
      )
      if (!response.ok) {
        throw new Error('Error al recuperar los datos')
      }
      const data = await response.json()
      setDatos(data)
      setDislikes(data.dislikes)
      setLikes(data.likes)

      return data
    } catch (error) {
      console.error('Error al leer datos:', error)
      return null
    }
  }

  useEffect(() => {
    if (user !== undefined && user !== null) {
      agregarValorAVistosRecientes(data[0].name, data[0].image)
      fetchData()
      writeUserData(animeId, data[0].name)
    }
  }, [data, user])
  useEffect(() => {
    setRating(calcularRating(likes, dislikes))
  }, [datos])

  const obtenerDatosUsuario = async (userId) => {
    try {
      // Obtén una referencia al documento del usuario en la base de datos
      const userRef = ref(database, 'users/' + userId)

      // Escucha cambios en los datos del usuario (en tiempo real)
      onValue(userRef, (snapshot) => {
        const userData = snapshot.val()
        console.log('Datos del usuario:', userData)
      })

      // También puedes obtener los datos una vez
      // const snapshot = await get(userRef);
      // const userData = snapshot.val();
      // console.log('Datos del usuario:', userData);
    } catch (error) {
      console.error('Error al obtener datos de usuario:', error)
    }
  }

  if (loading) {
    return (
      <div
        className='container'
        style={{
          display: 'flex',
          placeContent: 'center',
          placeItems: 'center',
          color: '#458c9e',
          minHeight: '80dvh',
        }}>
        Cargando...
      </div>
    )
  }
  return data?.map((e, index) => (
    <main
      className={`information__page ${theme === 'dark' ? 'dark ' : ''}`}
      key={index}>
      <section className='container__image'>
        <div className='image__anime'>
          <img src={e.image} alt='' />
        </div>
      </section>

      <section className={`container__information`}>
        <div className='info__anime'>
          <button onClick={() => obtenerDatosUsuario(user?.uid)}>
            obtener valores
          </button>
          <button>Like</button>
          <div class='flex items-center'>
            <svg
              class='w-4 h-4 text-yellow-300 me-1'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='currentColor'
              viewBox='0 0 22 20'>
              <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z' />
            </svg>
            <p class='ms-2 text-xlarge font-bold text-gray-900 dark:text-white'>
              {rating}
            </p>
            <span class='w-1 h-1 mx-1.5 bg-gray-500 rounded-full dark:bg-gray-400'></span>
            <a class='text-sm font-medium text-gray-900 underline hover:no-underline dark:text-white'>
              {dislikes + likes} votos
            </a>
          </div>
          <strong className='title__anime'>{e.name}</strong>
          <p>{e.descripcion}</p>
          <div className={`wrapp__anime`}>
            <span>
              fecha de emisión: <strong>{e.emitido}</strong>
            </span>
            <span>
              estado actual: <strong>{e.estado}</strong>
            </span>
            <span>
              Episiodios: <strong>{e.episodios}</strong>
            </span>
            <span>
              Numero de tempodaras: <strong>{e.temporadas}</strong>
            </span>
            <span>
              Duración x capitulo: <strong>{e.duration}</strong>
            </span>
            <span>
              Años de emisión: <strong>{e.year}</strong>
            </span>
            <span>
              Estudio: <strong>{e.studio}</strong>
            </span>
            <iframe
              src={`https://www.youtube.com/embed/${e.trailer}`}
              className='trailer__anime'></iframe>
          </div>
          <EpisodesList data={data} name={name} />
        </div>
        <Comments noButton={false} />
      </section>
    </main>
  ))
}
