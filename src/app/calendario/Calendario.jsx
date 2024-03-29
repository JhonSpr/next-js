import React from 'react'
import Card from './Card'

export default function Calendario({ data }) {
  const abril_04 = data.filter((e) => e.fechaEstreno === 'abril 04')
  const abril_05 = data.filter((e) => e.fechaEstreno === 'abril 05')
  const abril_06 = data.filter((e) => e.fechaEstreno === 'abril 06')
  const abril_07 = data.filter((e) => e.fechaEstreno === 'abril 07')
  const abril_08 = data.filter((e) => e.fechaEstreno === 'abril 08')
  const abril_09 = data.filter((e) => e.fechaEstreno === 'abril 09')

  return (
    <div className='container__calendario' style={{ marginTop: '89px' }}>
      <main>
        <h1 className='main__title__calendario'>CALENDARIO PRIMAVERA 2024</h1>
        <section className='section__calendario'>
          <h3 className='title__calendario'>Abril 04 2024</h3>
          <div>
            {abril_04.map((e, index) => (
              <Card key={`abril_04_${index}`} e={e} />
            ))}
          </div>
        </section>
        <section className='section__calendario'>
          <h3 className='title__calendario'>Abril 05 2024</h3>
          <div>
            {abril_05.map((e, index) => (
              <Card key={`abril_05_${index}`} e={e} />
            ))}
          </div>
        </section>
        <section className='section__calendario'>
          <h3 className='title__calendario'>Abril 06 2024</h3>
          <div>
            {abril_06.map((e, index) => (
              <Card key={`abril_06_${index}`} e={e} />
            ))}
          </div>
        </section>
        <section className='section__calendario'>
          <h3 className='title__calendario'>Abril 07 2024</h3>
          <div>
            {abril_07.map((e, index) => (
              <Card key={`abril_07_${index}`} e={e} />
            ))}
          </div>
        </section>
        <section className='section__calendario'>
          <h3 className='title__calendario'>Abril 08 2024</h3>
          <div>
            {abril_08.map((e, index) => (
              <Card key={`abril_08_${index}`} e={e} />
            ))}
          </div>
        </section>
        <section className='section__calendario'>
          <h3 className='title__calendario'>Abril 09 2024</h3>
          <div>
            {abril_09.map((e, index) => (
              <Card key={`abril_09_${index}`} e={e} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
