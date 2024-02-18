'use client'
import { useEffect, useState } from 'react'

export default function useRecomends(animeCurrent, genero1, genero2) {
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchAnime = async () => {
      const response = await fetch(
        `https://api-rest.up.railway.app/api/v1/animes?genero=${genero1}&genero=${genero2}&limit=1000`
      )
      const { datos } = await response.json()

      // Mezclar aleatoriamente el array de datos
      const shuffledData = shuffleArray(datos)

      // Eliminar duplicados
      const uniqueData = removeDuplicates(shuffledData, animeCurrent)

      setData(uniqueData)
    }

    fetchAnime()
  }, [animeCurrent, genero1, genero2])

  const shuffleArray = (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const removeDuplicates = (array, animeCurrent) => {
    const uniqueArray = []
    const map = new Map()
    for (const item of array) {
      if (!map.has(item.name) && item.name !== animeCurrent) {
        map.set(item.name, true)
        uniqueArray.push(item)
      }
    }
    return uniqueArray
  }

  return { uniqueArray: data }
}
