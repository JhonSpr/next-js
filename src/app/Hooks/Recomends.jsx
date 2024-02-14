'use client'
import { useEffect, useState } from 'react'

export default function useRecomends(animeCurrent) {
  const [number, setNumber] = useState(0) // Inicializa el estado con un número
  const [number2, setNumber2] = useState(0) // Inicializa el estado con un número
  const [data, setData] = useState([])

  useEffect(() => {
    const n1 = Math.random() * (100 - 0) + 0
    const n2 = Math.random() * (147 - 101) + 101
    // Aquí podrías hacer algo con n1 y n2 si los necesitas
    setNumber(Math.round(n1))
    setNumber2(Math.round(n2))
  }, [animeCurrent])

  const fetchAnime = async () => {
    const response = await fetch(
      `https://api-rest.up.railway.app/api/v1/animes?limit=1000`
    )
    const data = await response.json() // Espera a que se complete la promesa
    setData(data.datos) // Asigna los datos a la variable de estado
  }

  useEffect(() => {
    fetchAnime()
  }, [])

  const arrayRecomends = data
    ?.map((i) => ({
      name: i.name,
      image: i.image,
    }))
    ?.slice(number, number2)

  const uniqueArray = arrayRecomends?.reduce((accumulator, current) => {
    const duplicate = accumulator.find((obj) => obj.name === animeCurrent)
    if (!duplicate) {
      return [...accumulator, current]
    }
    return accumulator
  }, [])

  return { uniqueArray }
}
