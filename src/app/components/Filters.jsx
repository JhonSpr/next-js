'use client'

import { useState } from 'react'
import { FaFilter } from 'react-icons/fa6'

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

export const FilterMenu = ({ queryAños, queryGeneros }) => {
  const [showAños, setShowAños] = useState(false)
  const [showGeneros, setShowGeneros] = useState(false)
  const [showEstados, setShowEstados] = useState(false)
  const handleShowAños = () => {
    setShowAños(!showAños)
    setShowGeneros(false)
    setShowEstados(false)
  }
  const handleShowGeneros = () => {
    setShowGeneros(!showGeneros)
    setShowAños(false)
    setShowEstados(false)
  }
  const handleShowEstados = () => {
    setShowEstados(!showEstados)
    setShowGeneros(false)
    setShowAños(false)
  }

  return (
    <form className='filter__form'>
      <div className='filter__container'>
        <span className='filter__button' onClick={handleShowAños}>
          años: todos
        </span>
        <div className={showAños ? 'filter__item show' : 'filter__item'}>
          {años?.map((e, index) => (
            <label
              key={index}
              className={`cr-wrapper ${
                queryAños?.includes(`${e.value}`) ? 'active' : ''
              }`}>
              {e.value}
              <input
                type='checkbox'
                className={queryAños?.includes(`${e.value}`) ? 'active' : ''}
                name={e.query}
                value={e.value}
              />
              <div className='cr-input'></div>
            </label>
          ))}
        </div>
      </div>
      <div className='filter__container'>
        <span className='filter__button' onClick={handleShowGeneros}>
          generos: todos
        </span>
        <div
          className={
            showGeneros ? 'filter__item grond show' : 'filter__item grond'
          }>
          {generos?.map((e, index) => (
            <label
              key={index}
              className={`cr-wrapper ${
                queryGeneros?.includes(`${e.value}`) ? 'active' : ''
              }`}>
              {e.label}
              <input
                type='checkbox'
                className={queryGeneros?.includes(`${e.value}`) ? 'active' : ''}
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
          estados: todos
        </span>
        <div
          className={
            showEstados ? 'filter__item estados show' : 'filter__item'
          }>
          {estados?.map((e, index) => (
            <label
              key={index}
              className={`cr-wrapper ${
                queryAños?.includes(`${e.value}`) ? 'active' : ''
              }`}>
              {e.label}
              <input
                type='checkbox'
                className={queryAños?.includes(`${e.value}`) ? 'active' : ''}
                name={e.query}
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
    </form>
  )
}
