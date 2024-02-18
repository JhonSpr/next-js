'use client'

import { useState } from 'react'
import { FaFilter } from 'react-icons/fa6'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FcClearFilters } from 'react-icons/fc'
export const años = [
  { query: 'años', value: 2024, checked: false },
  { query: 'años', value: 2023, checked: false },
  { query: 'años', value: 2022, checked: false },
  { query: 'años', value: 2021, checked: false },
  { query: 'años', value: 2020, checked: false },
  { query: 'años', value: 2019, checked: false },
  { query: 'años', value: 2018, checked: false },
  { query: 'años', value: 2017, checked: false },
  { query: 'años', value: 2016, checked: false },
  { query: 'años', value: 2015, checked: false },
  { query: 'años', value: 2014, checked: false },
  { query: 'años', value: 2013, checked: false },
  { query: 'años', value: 2012, checked: false },
  { query: 'años', value: 2011, checked: false },
  { query: 'años', value: 2010, checked: false },
  { query: 'años', value: 2009, checked: false },
  { query: 'años', value: 2008, checked: false },
  { query: 'años', value: 2007, checked: false },
  { query: 'años', value: 2006, checked: false },
]
const generos = [
  { query: 'generos', value: 'accion', label: 'acción' },
  { query: 'generos', value: 'aventuras', label: 'aventuras' },
  { query: 'generos', value: 'fantasias', label: 'fantasias' },
  { query: 'generos', value: 'demonios', label: 'demonios' },
  { query: 'generos', value: 'ciencia ficcion', label: 'ciencia ficción' },
  { query: 'generos', value: 'yaoi', label: 'yaoi' },
  { query: 'generos', value: 'shounen', label: 'shounen' },
  { query: 'generos', value: 'juegos', label: 'juegos' },
  { query: 'generos', value: 'comedia', label: 'comedia' },
  { query: 'generos', value: 'drama', label: 'drama' },
  { query: 'generos', value: 'isekai', label: 'isekai' },
  { query: 'generos', value: 'seinen', label: 'seinen' },
  { query: 'generos', value: 'terror', label: 'terror' },
  { query: 'generos', value: 'horror', label: 'horror' },
  { query: 'generos', value: 'sobrenatural', label: 'sobrenatural' },
  { query: 'generos', value: 'misterio', label: 'misterio' },
]

const estados = [
  { query: 'estado', value: 'en emision', label: 'en emisión' },
  { query: 'estado', value: 'finalizado', label: 'finalizado' },
]

const sortBy = [
  { query: 'sortBy', value: 'asc', label: 'nombre A-Z' },
  { query: 'sortBy', value: 'desc', label: 'nombre Z-A' },
  { query: 'sortBy', value: 'mayor', label: 'Mayor Calificacion' },
]

export const FilterMenu = ({
  queryAños,
  queryGeneros,
  queryEstados,
  queryLetra,
  querySort,
}) => {
  const [showAños, setShowAños] = useState(false)
  const [showGeneros, setShowGeneros] = useState(false)
  const [showEstados, setShowEstados] = useState(false)
  const [showSort, setShowSort] = useState(false)
  const [selectedAños, setSelectedAños] = useState(queryAños || [])
  const [selectedGeneros, setSelectedGeneros] = useState(queryGeneros || [])
  const [selectedEstados, setSelectedEstados] = useState(queryEstados || [])
  const [selectedSort, setSelectedSort] = useState(querySort || [])
  const [eliminando, setEliminando] = useState(false)

  const handleShowAños = () => {
    setShowAños(!showAños)
    setShowGeneros(false)
    setShowEstados(false)
    setShowSort(false)
  }
  const handleShowGeneros = () => {
    setShowGeneros(!showGeneros)
    setShowAños(false)
    setShowEstados(false)
    setShowSort(false)
  }
  const handleShowEstados = () => {
    setShowEstados(!showEstados)
    setShowGeneros(false)
    setShowAños(false)
    setShowSort(false)
  }
  const handleShowSort = () => {
    setShowSort(!showSort)
    setShowEstados(false)
    setShowGeneros(false)
    setShowAños(false)
  }
  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target
    if (name === 'años') {
      if (checked) {
        setSelectedAños([...selectedAños, value])
      } else {
        setSelectedAños(selectedAños.filter((year) => year !== value))
      }
    } else if (name === 'generos') {
      if (checked) {
        setSelectedGeneros([...selectedGeneros, value])
      } else {
        setSelectedGeneros(selectedGeneros.filter((genre) => genre !== value))
      }
    } else if (name === 'estado') {
      if (checked) {
        setSelectedEstados([...selectedEstados, value])
      } else {
        setSelectedEstados(selectedEstados.filter((status) => status !== value))
      }
    } else if (name === 'sortBy') {
      if (checked) {
        setSelectedSort([...selectedSort, value])
      } else {
        setSelectedSort(selectedSort.filter((order) => order !== value))
      }
    }
  }

  const router = useRouter()
  const resetFilter = (e) => {
    e.preventDefault()
    if (
      queryAños.length > 0 ||
      queryEstados.length > 0 ||
      queryGeneros.length > 0 ||
      queryLetra.length > 0 ||
      querySort.length > 0
    ) {
      setEliminando(true)
      setTimeout(() => {
        setEliminando(false)
        router.replace('/directorio')
      }, 700)
      setSelectedSort([])
      setSelectedAños([])
      setSelectedEstados([])
      setSelectedGeneros([])
    }
  }

  return (
    <form className='filter__form'>
      <div className='filter__container'>
        <span className='filter__button' onClick={handleShowAños}>
          {selectedAños.length > 1
            ? `años: selecionados ${selectedAños.length}`
            : `años: ${selectedAños}`}

          {selectedAños.length == 0 ? 'todos' : ''}
        </span>
        <div className={showAños ? 'filter__item show' : 'filter__item'}>
          {años?.map((e, index) => (
            <label
              key={index}
              className={`cr-wrapper ${
                selectedAños?.includes(`${e.value}`) ? 'active' : ''
              }`}>
              {e.value}
              <input
                type='checkbox'
                checked={selectedAños?.includes(`${e.value}`)}
                onChange={handleCheckboxChange}
                name='años'
                value={e.value}
              />
              <div className='cr-input'></div>
            </label>
          ))}
        </div>
      </div>
      <div className='filter__container'>
        <span className='filter__button' onClick={handleShowGeneros}>
          generos:{' '}
          {selectedGeneros.length > 1
            ? `selecionados ${selectedGeneros.length}`
            : `${selectedGeneros}`}
          {selectedGeneros.length == 0 ? 'todos' : ''}
        </span>
        <div
          className={
            showGeneros ? 'filter__item grond show' : 'filter__item grond'
          }>
          {generos?.map((e, index) => (
            <label
              key={index}
              className={`cr-wrapper ${
                selectedGeneros?.includes(`${e.value}`) ? 'active' : ''
              }`}>
              {e.label}
              <input
                type='checkbox'
                className={
                  selectedGeneros?.includes(`${e.value}`) ? 'active' : ''
                }
                checked={selectedGeneros?.includes(`${e.value}`)}
                onChange={handleCheckboxChange}
                name={e.query}
                value={e.value}
              />
              <div className='cr-input'></div>
            </label>
          ))}
        </div>
      </div>{' '}
      <div className='filter__container'>
        <span className='filter__button' onClick={handleShowEstados}>
          estados:{' '}
          {selectedEstados.length > 1
            ? `selecionados ${selectedEstados.length}`
            : `${selectedEstados}`}
          {selectedEstados.length == 0 ? 'todos' : ''}
        </span>
        <div
          className={
            showEstados ? 'filter__item estados show' : 'filter__item'
          }>
          {estados?.map((e, index) => (
            <label
              key={index}
              className={`cr-wrapper ${
                selectedEstados?.includes(`${e.value}`) ? 'active' : ''
              }`}>
              {e.label}
              <input
                type='checkbox'
                className={
                  selectedEstados?.includes(`${e.value}`) ? 'active' : ''
                }
                onChange={handleCheckboxChange}
                name={e.query}
                checked={selectedEstados?.includes(`${e.value}`)}
                value={e.value}
              />
              <div className='cr-input'></div>
            </label>
          ))}
        </div>
      </div>
      <div className='filter__container'>
        <span className='filter__button' onClick={handleShowSort}>
          orden:{' '}
          {selectedSort.length > 1
            ? `selecionados ${selectedSort.length}`
            : `${selectedSort}`}
          {selectedSort.length == 0 ? 'Por defecto' : ''}
        </span>
        <div className={showSort ? 'filter__item Sort show' : 'filter__item'}>
          {sortBy?.map((e, index) => (
            <label
              key={index}
              className={`cr-wrapper ${
                selectedSort?.includes(`${e.value}`) ? 'active' : ''
              }`}>
              {e.label}
              <input
                type='checkbox'
                className={selectedSort?.includes(`${e.value}`) ? 'active' : ''}
                onChange={handleCheckboxChange}
                name={e.query}
                checked={selectedSort?.includes(`${e.value}`)}
                value={e.value}
              />
              <div className='cr-input'></div>
            </label>
          ))}
        </div>
      </div>
      <button>
        <FaFilter />
      </button>
      <button
        onClick={resetFilter}
        disabled={eliminando}
        className='btn__clear__filters'>
        {eliminando ? 'eliminando filtros' : <FcClearFilters />}
      </button>
    </form>
  )
}
