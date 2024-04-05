'use client'
import { useContext } from 'react'
import Card from './Card'
import { contextApp } from '../providers'

export default function Calendario({ data }) {
  const abril_04 = data.filter((e) => e.fechaEstreno === 'abril 04')
  const abril_05 = data.filter((e) => e.fechaEstreno === 'abril 05')
  const abril_06 = data.filter((e) => e.fechaEstreno === 'abril 06')
  const abril_07 = data.filter((e) => e.fechaEstreno === 'abril 07')
  const abril_08 = data.filter((e) => e.fechaEstreno === 'abril 08')
  const abril_09 = data.filter((e) => e.fechaEstreno === 'abril 09')
  const { theme } = useContext(contextApp)
  return (
    <div className='container__calendario' style={{ marginTop: '89px' }}>
      <main>
        <h1
          className={`main__title__calendario  ${
            theme == 'dark' ? 'dark' : ''
          }`}>
          CALENDARIO PRIMAVERA 2024
        </h1>
        <section className='section__calendario'>
          <h3 className={`title__calendario  ${theme == 'dark' ? 'dark' : ''}`}>
            Abril 04 2024
          </h3>
          <div className={`card__calendario ${theme === 'dark' ? 'dark' : ''}`}>
            {abril_04.map((e, index) => (
              <Card key={`abril_04_${index}`} e={e} />
            ))}
          </div>
        </section>
        <section className='section__calendario'>
          <h3 className={`title__calendario ${theme == 'dark' ? 'dark' : ''}`}>
            Abril 05 2024
          </h3>
          <div className={`card__calendario ${theme === 'dark' ? 'dark' : ''}`}>
            {abril_05.map((e, index) => (
              <Card key={`abril_05_${index}`} e={e} />
            ))}
          </div>
        </section>
        <section className='section__calendario'>
          <h3 className={`title__calendario ${theme == 'dark' ? 'dark' : ''}`}>
            Abril 06 2024
          </h3>
          <div className={`card__calendario ${theme === 'dark' ? 'dark' : ''}`}>
            {abril_06.map((e, index) => (
              <Card key={`abril_06_${index}`} e={e} />
            ))}
          </div>
        </section>
        <section className='section__calendario'>
          <h3 className={`title__calendario ${theme == 'dark' ? 'dark' : ''}`}>
            Abril 07 2024
          </h3>
          <div className={`card__calendario ${theme === 'dark' ? 'dark' : ''}`}>
            {abril_07.map((e, index) => (
              <Card key={`abril_07_${index}`} e={e} />
            ))}
          </div>
        </section>
        <section className='section__calendario'>
          <h3 className={`title__calendario ${theme == 'dark' ? 'dark' : ''}`}>
            Abril 08 2024
          </h3>
          <div className={`card__calendario ${theme === 'dark' ? 'dark' : ''}`}>
            {abril_08.map((e, index) => (
              <Card key={`abril_08_${index}`} e={e} />
            ))}
          </div>
        </section>
        <section className='section__calendario'>
          <h3 className={`title__calendario ${theme == 'dark' ? 'dark' : ''}`}>
            Abril 09 2024
          </h3>
          <div className={`card__calendario ${theme === 'dark' ? 'dark' : ''}`}>
            {abril_09.map((e, index) => (
              <Card key={`abril_09_${index}`} e={e} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
